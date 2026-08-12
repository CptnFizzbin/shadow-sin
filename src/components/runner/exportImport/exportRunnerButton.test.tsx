import { fireEvent, render, screen } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { ExportRunnerButton } from "./exportRunnerButton.tsx"
import type * as ExportUtils from "./exportUtils.ts"
import { downloadTextFile } from "./exportUtils.ts"

vi.mock("./exportUtils.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof ExportUtils>()
  return { ...actual, downloadTextFile: vi.fn() }
})

function renderWithRunner(overrideFn?: Parameters<typeof runnerDataFactory>[0]) {
  const runnerData = runnerDataFactory(overrideFn)
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<ExportRunnerButton />, { wrapper: Wrapper })

  return store
}

describe("ExportRunnerButton", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-08-12T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.mocked(downloadTextFile).mockClear()
  })

  it("downloads the runner as `<name>.<isoDate>.sin`", () => {
    // Arrange
    renderWithRunner((data) => {
      data.profile.alias = "Artemis"
      return data
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Export" }))

    // Assert
    expect(downloadTextFile).toHaveBeenCalledWith(
      expect.any(String),
      "artemis.2026-08-12.sin",
    )
  })

  it("records the export timestamp on the runner's meta", () => {
    // Arrange
    const store = renderWithRunner()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Export" }))

    // Assert
    expect(store.getState()._meta_.lastExportDate).toBe("2026-08-12T12:00:00.000Z")
  })
})
