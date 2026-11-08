import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { createRunnerStateStore } from "#/state/runnerState.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { KarmaSection } from "./karmaSection.tsx"

function renderWithKarma(current: number, total: number) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.karma.current = current
    data.karma.total = total
  } })
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<KarmaSection />, { wrapper: Wrapper })

  return store
}

describe("KarmaSection", () => {
  it("shows current and total karma from the store", () => {
    // Arrange / Act
    renderWithKarma(5, 20)

    // Assert
    expect(screen.getByText("5")).toBeDefined()
    expect(screen.getByText("20")).toBeDefined()
  })

  it("earning karma through Manage Karma updates current and total in the store and the UI", async () => {
    // Arrange
    const store = renderWithKarma(5, 20)

    // Act
    fireEvent.click(screen.getByRole("button", { name: /manage karma/i }))
    const dialog = await screen.findByRole("dialog", { name: "Manage Karma" })
    fireEvent.click(within(dialog).getByRole("button", { name: /earn karma/i }))
    fireEvent.click(within(dialog).getByRole("button", { name: /^earn$/i }))

    // Assert: state updated (default Amount is 1)...
    await waitFor(() => expect(store.getState().runner.karma.current).toBe(6))
    expect(store.getState().runner.karma.total).toBe(21)
    // ...and the UI re-rendered off that same state.
    expect(await screen.findByText("6")).toBeDefined()
    expect(screen.getByText("21")).toBeDefined()
  })

  it("records the earn reason and shows it in the karma ledger", async () => {
    // Arrange
    renderWithKarma(5, 20)

    // Act
    fireEvent.click(screen.getByRole("button", { name: /manage karma/i }))
    const manageDialog = await screen.findByRole("dialog", { name: "Manage Karma" })
    fireEvent.click(within(manageDialog).getByRole("button", { name: /earn karma/i }))
    fireEvent.change(within(manageDialog).getByLabelText("Reason"), { target: { value: "Extraction run" } })
    fireEvent.click(within(manageDialog).getByRole("button", { name: /^earn$/i }))
    await waitFor(() => expect(screen.queryByRole("dialog", { name: /karma/i })).toBeNull())
    fireEvent.click(screen.getByRole("button", { name: /^ledger$/i }))

    // Assert
    const ledgerDialog = await screen.findByRole("dialog", { name: "Karma Ledger" })
    expect(within(ledgerDialog).getByText("Earned 1 karma: Extraction run")).toBeDefined()
    expect(within(ledgerDialog).getByText("+1")).toBeDefined()
  })

  it("shows an empty message when the karma ledger has no entries", async () => {
    // Arrange
    renderWithKarma(0, 0)

    // Act
    fireEvent.click(screen.getByRole("button", { name: /^ledger$/i }))

    // Assert
    const ledgerDialog = await screen.findByRole("dialog", { name: "Karma Ledger" })
    expect(within(ledgerDialog).getByText("No karma changes recorded yet")).toBeDefined()
  })
})
