import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import type { LoanData } from "#/system/loanData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { LoansSection } from "./loansSection.tsx"

const fixerLoan: LoanData = {
  id: "00000000-0000-0000-0000-000000000001",
  lender: "Mr. Johnson",
  amount: 500,
  interestRate: 5,
}

function renderWithLoans(loans: LoanData[]) {
  const runnerData = runnerDataFactory({ override: (data) => {
    data.nuyen.loans = loans
    return data
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<LoansSection />, { wrapper: Wrapper })

  return store
}

describe("LoansSection", () => {
  it("shows loans from the store", () => {
    // Arrange / Act
    renderWithLoans([fixerLoan])

    // Assert
    expect(screen.getByText("Mr. Johnson")).toBeDefined()
  })

  it("adding a loan dispatches addLoan with a generated id and updates the store", async () => {
    // Arrange
    const store = renderWithLoans([])

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add loan/i }))
    const dialog = await screen.findByRole("dialog", { name: "Add Loan" })
    fireEvent.change(within(dialog).getByLabelText(/^lender/i), { target: { value: "Fixer Sam" } })
    fireEvent.change(within(dialog).getByLabelText(/amount outstanding/i), { target: { value: "1000" } })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().nuyen.loans).toHaveLength(1))
    expect(store.getState().nuyen.loans[0].lender).toBe("Fixer Sam")
    expect(store.getState().nuyen.loans[0].id).not.toBe("")
    // ...and the UI re-rendered off that same state.
    expect(await screen.findByText("Fixer Sam")).toBeDefined()
  })

  it("removing a loan dispatches removeLoan and updates the store", async () => {
    // Arrange
    const store = renderWithLoans([fixerLoan])

    // Act
    fireEvent.click(screen.getByText("Mr. Johnson"))
    const dialog = await screen.findByRole("dialog", { name: "Edit Loan" })
    fireEvent.click(within(dialog).getByRole("button", { name: "Remove" }))
    fireEvent.click(await within(dialog).findByRole("button", { name: /confirm remove/i }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().nuyen.loans).toHaveLength(0))
    // ...and the UI re-rendered off that same state.
    expect(screen.queryByText("Mr. Johnson")).toBeNull()
  })
})
