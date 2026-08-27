import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { ReputationSection } from "./reputationSection.tsx"

function renderWithReputation(streetCred: number, notoriety: number) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.profile.streetCred = streetCred
    data.profile.notoriety = notoriety
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<ReputationSection />, { wrapper: Wrapper })

  return store
}

describe("ReputationSection", () => {
  it("shows the current reputation values and an Adjust Reputation button", () => {
    // Arrange / Act
    renderWithReputation(4, 2)

    // Assert
    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("2")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Adjust Reputation" })).toBeTruthy()
  })

  it("opens the Adjust Reputation dialog and adding an entry updates the display underneath", async () => {
    // Arrange
    const store = renderWithReputation(4, 0)

    // Act — open the dialog, add a Street Cred +1 entry (form defaults, plus a required note)
    fireEvent.click(screen.getByRole("button", { name: "Adjust Reputation" }))
    const dialog = await screen.findByRole("dialog", { name: "Adjust Reputation" })
    fireEvent.click(within(dialog).getByRole("button", { name: "Add Entry" }))
    const form = await screen.findByRole("dialog", { name: "Add Reputation Event" })
    fireEvent.change(within(form).getByLabelText("Notes"), { target: { value: "Clean run" } })
    fireEvent.click(within(form).getByRole("button", { name: "Add Event" }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().reputation.ledger).toHaveLength(1))
    // ...and both the dialog's own display and the section underneath (still open, still
    // mounted) read off that same state — two ReputationDisplay instances, one number.
    expect(await screen.findAllByText("5")).toHaveLength(2)
  })
})
