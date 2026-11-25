import { render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getRunnerStorageKey } from "#/services/persistence/builderDraftKey.ts"

import { BuilderLoadErrorBoundary } from "./builderLoadErrorBoundary.tsx"

/**
 * The exact key `BuilderLoadErrorBoundary`'s underlying storage reads/writes to (see
 * `BrowserLocalStorage`/`getRunnerStorageKey`). Seeding and asserting against `localStorage`
 * directly — rather than through the debounced, cached `AsyncJsonStorage` wrapper the app uses —
 * makes these tests independent of how many times React internally re-invokes a throwing
 * component before committing to the error boundary, and of the wrapper's write debounce.
 */
function rawStorageKey(runnerStorageKey: string): string {
  return `shadowsin:${runnerStorageKey}`
}

function seedRawDraft(runnerStorageKey: string): void {
  globalThis.localStorage.setItem(rawStorageKey(runnerStorageKey), JSON.stringify({ legacy: "shape" }))
}

/** Simulates a real legacy draft: crashes only while its own saved draft is still in storage. */
function CrashesWhileDraftSaved({ runnerStorageKey }: { runnerStorageKey: string }) {
  if (globalThis.localStorage.getItem(rawStorageKey(runnerStorageKey)) !== null) {
    throw new Error("Simulated crash loading a legacy draft")
  }
  return <div>Builder loaded</div>
}

/** Simulates a crash unrelated to the draft — recovery clears storage but it still fails. */
function AlwaysCrashes(): never {
  throw new Error("Simulated crash unrelated to the draft")
}

describe("BuilderLoadErrorBoundary", () => {
  beforeEach(() => {
    // React logs caught render errors to the console; expected here, so silence it.
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("clears the draft and remounts once when the Builder crashes on mount", async () => {
    // Arrange
    const storageKey = getRunnerStorageKey("crashes-once")
    seedRawDraft(storageKey)

    // Act
    render(
      <BuilderLoadErrorBoundary runnerStorageKey={storageKey}>
        <CrashesWhileDraftSaved runnerStorageKey={storageKey} />
      </BuilderLoadErrorBoundary>,
    )

    // Assert
    expect(await screen.findByText("Builder loaded")).toBeTruthy()
    expect(globalThis.localStorage.getItem(rawStorageKey(storageKey))).toBeNull()
  })

  it("gives up after a second crash on the same draft instead of retrying forever", async () => {
    // Arrange
    const storageKey = getRunnerStorageKey("always-crashes")
    seedRawDraft(storageKey)

    // Act
    render(
      <BuilderLoadErrorBoundary runnerStorageKey={storageKey}>
        <AlwaysCrashes />
      </BuilderLoadErrorBoundary>,
    )

    // Assert
    expect(
      await screen.findByText("Failed to start the character builder"),
    ).toBeTruthy()
    // The draft was still cleared on the first (only) recovery attempt.
    expect(globalThis.localStorage.getItem(rawStorageKey(storageKey))).toBeNull()
  })

  it("does not touch other drafts' storage", async () => {
    // Arrange
    const crashingKey = getRunnerStorageKey("crashes-once-2")
    const otherKey = getRunnerStorageKey("untouched")
    seedRawDraft(crashingKey)
    globalThis.localStorage.setItem(rawStorageKey(otherKey), JSON.stringify({ profile: { alias: "Kept" } }))

    // Act
    render(
      <BuilderLoadErrorBoundary runnerStorageKey={crashingKey}>
        <CrashesWhileDraftSaved runnerStorageKey={crashingKey} />
      </BuilderLoadErrorBoundary>,
    )
    await screen.findByText("Builder loaded")

    // Assert
    expect(globalThis.localStorage.getItem(rawStorageKey(otherKey)))
      .toEqual(JSON.stringify({ profile: { alias: "Kept" } }))
  })

  it("renders children normally when nothing crashes", () => {
    // Arrange & Act
    render(
      <BuilderLoadErrorBoundary runnerStorageKey={getRunnerStorageKey("never-crashes")}>
        <div>Builder loaded</div>
      </BuilderLoadErrorBoundary>,
    )

    // Assert
    expect(screen.getByText("Builder loaded")).toBeTruthy()
  })

  it("recovers again after navigating to a different runner's draft", async () => {
    // Arrange
    const firstKey = getRunnerStorageKey("first-runner")
    const secondKey = getRunnerStorageKey("second-runner")
    seedRawDraft(firstKey)
    seedRawDraft(secondKey)
    const { rerender } = render(
      <BuilderLoadErrorBoundary runnerStorageKey={firstKey}>
        <AlwaysCrashes />
      </BuilderLoadErrorBoundary>,
    )
    await screen.findByText("Failed to start the character builder")

    // Act — navigate to a second runner whose draft crashes only until it's cleared
    rerender(
      <BuilderLoadErrorBoundary runnerStorageKey={secondKey}>
        <CrashesWhileDraftSaved runnerStorageKey={secondKey} />
      </BuilderLoadErrorBoundary>,
    )

    // Assert
    await waitFor(() => expect(screen.getByText("Builder loaded")).toBeTruthy())
    expect(globalThis.localStorage.getItem(rawStorageKey(secondKey))).toBeNull()
  })
})
