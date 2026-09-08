import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import type { ReputationLedgerEntry } from "#/system/reputation/reputationLedgerEntry.ts"
import { ReputationStatType } from "#/system/reputation/reputationLedgerEntry.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { useEditReputationEntryForm } from "./useEditReputationEntryForm.tsx"

// Fixed so it can be both the ledger entry seeded into the store and the entry the dialog is
// opened with — the dialog dispatches `editReputationEntry(entry.id, ...)`, so the two must
// agree on `id` for a save to actually find and update the seeded entry.
const testEntry: ReputationLedgerEntry = {
  id: "00000000-0000-0000-0000-000000000001",
  stat: ReputationStatType.streetCred,
  amount: 3,
  description: "Successful run",
  timestamp: "2026-01-01T00:00:00Z",
}

// `useEditReputationEntryForm` only exposes `{ open, outlet }` — this harness stands in for a
// real trigger (a row's Edit button) so the dialog it renders can be exercised through the
// public hook API, same as a consumer would use it.
const Harness: FC = () => {
  const dialog = useEditReputationEntryForm()
  return (
    <>
      <button type="button" onClick={() => dialog.open({ entry: testEntry })}>
        Open Edit
      </button>
      {dialog.outlet}
    </>
  )
}

function renderHarness(afterBuild?: (sheet: RunnerData) => void) {
  const store = new RunnerDataStore(runnerDataFactory({ afterBuild }))

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<Harness />, { wrapper: Wrapper })
  fireEvent.click(screen.getByRole("button", { name: "Open Edit" }))
  return store
}

function seedLedger(sheet: RunnerData) {
  sheet.reputation.ledger = [testEntry]
}

describe("EditReputationEntryForm", () => {
  it("pre-fills the form with the entry's current stat, amount, and description", () => {
    // Arrange / Act
    renderHarness(seedLedger)

    // Assert — the Street Cred stat button is the selected one (MUI's "contained" variant)
    expect(screen.getByRole("button", { name: "Street Cred" }).className).toMatch(/MuiButton-contained/)
    expect(screen.getByDisplayValue("Successful run")).toBeTruthy()
    expect((screen.getByLabelText("Value") as HTMLInputElement).value).toBe("3")
  })

  it("updates the ledger entry in place when saved", async () => {
    // Arrange
    const store = renderHarness(seedLedger)

    // Act — switch the stat to Notoriety and correct the description
    fireEvent.click(screen.getByRole("button", { name: "Notoriety" }))
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "Actually a botched job" } })
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }))

    // Assert — dialog closed (MUI's exit transition is async) and the ledger reflects the edit
    await waitFor(() => expect(screen.queryByText("Edit Reputation Event")).toBeNull())
    expect(store.getState().reputation.ledger).toHaveLength(1)
    const [entry] = store.getState().reputation.ledger
    expect(entry.stat).toBe("notoriety")
    expect(entry.description).toBe("Actually a botched job")
    // id, amount, and timestamp are untouched by the stat/description edit
    expect(entry.id).toBe(testEntry.id)
    expect(entry.amount).toBe(3)
    expect(entry.timestamp).toBe(testEntry.timestamp)
  })

  it("closes without changing the ledger when cancelled", async () => {
    // Arrange
    const store = renderHarness(seedLedger)

    // Act
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "Changed my mind" } })
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))

    // Assert
    await waitFor(() => expect(screen.queryByText("Edit Reputation Event")).toBeNull())
    expect(store.getState().reputation.ledger[0].description).toBe("Successful run")
  })
})
