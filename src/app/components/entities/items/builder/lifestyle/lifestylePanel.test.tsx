import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { createRunnerStateStore } from "#/state/runnerState.ts"
import { LifestyleType } from "#/system/model/finances/lifestyleType.ts"
import type { RunnerLifestyle } from "#/system/model/finances/runnerLifestyle.ts"
import { standardLifestyle } from "#/system/model/finances/runnerLifestyle.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { LifestylePanel } from "./lifestylePanel.tsx"

function renderWithLifestyle(lifestyle: RunnerLifestyle) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.lifestyle = lifestyle
  } })
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<LifestylePanel />, { wrapper: Wrapper })

  return store
}

describe("LifestylePanel", () => {
  it("shows the runner's standard lifestyle and months prepaid from the store", () => {
    // Arrange / Act
    renderWithLifestyle(standardLifestyle(LifestyleType.High, { monthsPaid: 3 }))

    // Assert
    expect(screen.getByRole("combobox").textContent).toBe(LifestyleType.High)
    expect((screen.getByLabelText("Months prepaid") as HTMLInputElement).value).toBe("3")
    expect(screen.queryByLabelText("Name")).toBeNull()
  })

  it("changing to another standard lifestyle sets its name and upkeep", async () => {
    // Arrange
    const store = renderWithLifestyle(standardLifestyle(LifestyleType.Street))

    // Act
    fireEvent.mouseDown(screen.getByRole("combobox"))
    fireEvent.click(screen.getByRole("option", { name: /^Middle/ }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().runner.lifestyle).toMatchObject({ name: "Middle", upkeep: 5_000 }))
    // ...and the UI re-rendered off that same state.
    expect(screen.getByRole("combobox").textContent).toBe(LifestyleType.Middle)
  })

  it("changing months prepaid updates the store", async () => {
    // Arrange
    const store = renderWithLifestyle(standardLifestyle(LifestyleType.Low))

    // Act
    fireEvent.change(screen.getByLabelText("Months prepaid"), { target: { value: "5" } })

    // Assert
    await waitFor(() => expect(store.getState().runner.lifestyle.monthsPaid).toBe(5))
  })

  it("hides months prepaid for a lifestyle without upkeep", () => {
    // Arrange / Act
    renderWithLifestyle(standardLifestyle(LifestyleType.Street))

    // Assert
    expect(screen.queryByLabelText("Months prepaid")).toBeNull()
  })

  it("choosing Custom shows name and upkeep fields with the current upkeep kept", async () => {
    // Arrange
    const store = renderWithLifestyle(standardLifestyle(LifestyleType.Low))

    // Act
    fireEvent.mouseDown(screen.getByRole("combobox"))
    fireEvent.click(screen.getByRole("option", { name: "Custom" }))

    // Assert
    await waitFor(() => expect(store.getState().runner.lifestyle).toMatchObject({ name: "Custom", upkeep: 2_000 }))
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Custom")
    expect((screen.getByLabelText("Monthly upkeep") as HTMLInputElement).value).toBe("2000")
  })

  it("toggling Income stores the custom upkeep as a negative amount", async () => {
    // Arrange
    const store = renderWithLifestyle({ name: "Trust Fund", upkeep: 5_000, monthsPaid: 1 })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Income" }))

    // Assert
    await waitFor(() => expect(store.getState().runner.lifestyle.upkeep).toBe(-5_000))
    expect(screen.getByText(/Monthly income:/)).toBeTruthy()
  })

  it("editing notes updates the store", async () => {
    // Arrange
    const store = renderWithLifestyle(standardLifestyle(LifestyleType.Low))

    // Act
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "Coffin hotel downtown" } })

    // Assert
    await waitFor(() => expect(store.getState().runner.lifestyle.notes).toBe("Coffin hotel downtown"))
  })
})
