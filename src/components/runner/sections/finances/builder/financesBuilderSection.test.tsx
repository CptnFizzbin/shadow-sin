import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { createRunnerStateStore } from "#/state/runnerState.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { FinancesBuilderSection } from "./financesBuilderSection.tsx"

function renderSection(nuyen: number) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.nuyen.current = nuyen
  } })
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<FinancesBuilderSection />, { wrapper: Wrapper })

  return store
}

describe("FinancesBuilderSection", () => {
  it("renders the Finances section header and the runner's nuyen from the store", () => {
    // Arrange / Act
    renderSection(1500)

    // Assert
    expect(screen.getByRole("heading", { name: "Finances" })).toBeDefined()
    expect(screen.getByLabelText("Adjust")).toBeDefined()
  })

  it("setting nuyen dispatches setNuyenAmount, updating the store", async () => {
    // Arrange
    const store = renderSection(1000)

    // Act
    fireEvent.change(screen.getByLabelText("Adjust"), { target: { value: "2500" } })
    fireEvent.click(screen.getByRole("button", { name: "Set" }))

    // Assert
    await waitFor(() => expect(store.getState().runner.nuyen.current).toBe(2500))
  })
})
