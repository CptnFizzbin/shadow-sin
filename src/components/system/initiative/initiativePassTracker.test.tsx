import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { InitiativePassTracker } from "./initiativePassTracker.tsx"

function renderWithPasses(passesCompleted: number[]) {
  const runnerData = runnerDataFactory({ override: (data) => {
    data.initiative.passesCompleted = passesCompleted
    return data
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<InitiativePassTracker numPasses={3} />, { wrapper: Wrapper })

  return store
}

describe("InitiativePassTracker", () => {
  it("marks completed passes as filled from the store", () => {
    // Arrange / Act
    renderWithPasses([1])

    // Assert
    expect(screen.getByRole("button", { name: "2" }).className).toContain("MuiButton-contained")
    expect(screen.getByRole("button", { name: "1" }).className).toContain("MuiButton-outlined")
  })

  it("clicking a pass dispatches togglePass, updating the store and the UI", async () => {
    // Arrange
    const store = renderWithPasses([])

    // Act
    fireEvent.click(screen.getByRole("button", { name: "1" }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().initiative.passesCompleted).toEqual([0]))
    // ...and the UI re-rendered off that same state.
    expect(screen.getByRole("button", { name: "1" }).className).toContain("MuiButton-contained")
  })

  it("clicking an already-completed pass toggles it back off", async () => {
    // Arrange
    const store = renderWithPasses([0])

    // Act
    fireEvent.click(screen.getByRole("button", { name: "1" }))

    // Assert
    await waitFor(() => expect(store.getState().initiative.passesCompleted).toEqual([]))
  })
})
