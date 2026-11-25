import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import { RunnerStoreProvider } from "#state/runner/runnerStoreProvider.tsx"
import { createRunnerStateStore } from "#state/runnerState.ts"

import { InitiativeSection } from "./initiativeSection.tsx"

function renderWithPasses(passesCompleted: number[]) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.initiative.passesCompleted = passesCompleted
  } })
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<InitiativeSection />, { wrapper: Wrapper })

  return store
}

describe("InitiativeSection", () => {
  it("clicking End Round dispatches resetPasses, clearing completed passes in the store", async () => {
    // Arrange
    const store = renderWithPasses([0])

    // Act
    fireEvent.click(screen.getByRole("button", { name: "End Round" }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().runner.initiative.passesCompleted).toEqual([]))
    // ...and the UI re-rendered off that same state.
    expect(screen.getByRole("button", { name: "1" }).className).toContain("MuiButton-outlined")
  })
})
