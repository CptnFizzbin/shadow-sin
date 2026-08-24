import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { ReputationBuilderSection } from "./reputationBuilderSection.tsx"

function renderSection() {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.profile.streetCred = 3
    data.profile.notoriety = 1
    data.profile.publicAwarenessModifier = 2
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<ReputationBuilderSection />, { wrapper: Wrapper })

  return store
}

describe("ReputationBuilderSection", () => {
  it("shows the runner's reputation fields and computed public awareness from the store", () => {
    // Arrange / Act
    renderSection()

    // Assert
    expect((screen.getByLabelText("Street Cred") as HTMLInputElement).value).toBe("3")
    expect((screen.getByLabelText("Notoriety") as HTMLInputElement).value).toBe("1")
    expect((screen.getByLabelText("Awareness Modifier") as HTMLInputElement).value).toBe("2")
    // floor((3 + 1) / 3) + 2 = 1 + 2 = 3
    expect(screen.getByText("3", { selector: "p" })).toBeDefined()
  })

  it("editing Street Cred dispatches setStreetCred, updating the store and the UI", async () => {
    // Arrange
    const store = renderSection()

    // Act
    fireEvent.change(screen.getByLabelText("Street Cred"), { target: { value: "8" } })

    // Assert: state updated...
    await waitFor(() => expect(store.getState().profile.streetCred).toBe(8))
    // ...and the UI re-rendered off that same state.
    expect((screen.getByLabelText("Street Cred") as HTMLInputElement).value).toBe("8")
  })

  it("editing Notoriety dispatches setNotoriety, updating the store and the UI", async () => {
    // Arrange
    const store = renderSection()

    // Act
    fireEvent.change(screen.getByLabelText("Notoriety"), { target: { value: "5" } })

    // Assert
    await waitFor(() => expect(store.getState().profile.notoriety).toBe(5))
    expect((screen.getByLabelText("Notoriety") as HTMLInputElement).value).toBe("5")
  })
})
