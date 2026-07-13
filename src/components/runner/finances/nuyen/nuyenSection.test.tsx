import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataProvider } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { NuyenSection } from "./nuyenSection.tsx"

function renderWithNuyen(current: number) {
  const runnerData = runnerDataFactory((data) => {
    data.nuyen.current = current
    return data
  })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerDataProvider store={store}>{children}</RunnerDataProvider>
  )

  render(<NuyenSection />, { wrapper: Wrapper })

  return store
}

describe("NuyenSection", () => {
  it("depositing dispatches depositNuyen and updates the store", async () => {
    // Arrange
    const store = renderWithNuyen(100)

    // Act
    fireEvent.change(screen.getByLabelText("Adjust"), { target: { value: "50" } })
    fireEvent.click(screen.getByRole("button", { name: "Deposit" }))

    // Assert: state updated...
    await waitFor(() => expect(store.state.nuyen.current).toBe(150))
    // ...and the UI re-rendered off that same state.
    expect(screen.getByText("150¥")).toBeDefined()
  })

  it("withdrawing dispatches withdrawNuyen and updates the store", async () => {
    // Arrange
    const store = renderWithNuyen(100)

    // Act
    fireEvent.change(screen.getByLabelText("Adjust"), { target: { value: "30" } })
    fireEvent.click(screen.getByRole("button", { name: "Withdraw" }))

    // Assert
    await waitFor(() => expect(store.state.nuyen.current).toBe(70))
  })

  it("setting dispatches setNuyenAmount and replaces the balance", async () => {
    // Arrange
    const store = renderWithNuyen(100)

    // Act
    fireEvent.change(screen.getByLabelText("Adjust"), { target: { value: "42" } })
    fireEvent.click(screen.getByRole("button", { name: "Set" }))

    // Assert
    await waitFor(() => expect(store.state.nuyen.current).toBe(42))
  })
})
