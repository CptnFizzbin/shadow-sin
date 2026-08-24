import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { LifestyleType } from "#/system/lifestyleType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { LifestylePanel } from "./lifestylePanel.tsx"

function renderWithLifestyle(lifestyle: { quality: LifestyleType, monthsPaid: number } | null) {
  const runnerData = runnerDataFactory({ override: (data) => {
    data.profile.lifestyle = lifestyle
    return data
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<LifestylePanel />, { wrapper: Wrapper })

  return store
}

describe("LifestylePanel", () => {
  it("defaults to Street/1 month when the runner has no lifestyle set", () => {
    // Arrange / Act
    renderWithLifestyle(null)

    // Assert
    expect(screen.getByRole("combobox").textContent).toBe(LifestyleType.Street)
    expect((screen.getByLabelText("Months prepaid") as HTMLInputElement).value).toBe("1")
  })

  it("shows the runner's lifestyle quality and months prepaid from the store", () => {
    // Arrange / Act
    renderWithLifestyle({ quality: LifestyleType.High, monthsPaid: 3 })

    // Assert
    expect(screen.getByRole("combobox").textContent).toBe(LifestyleType.High)
    expect((screen.getByLabelText("Months prepaid") as HTMLInputElement).value).toBe("3")
  })

  it("changing lifestyle quality dispatches setLifestyleQuality and updates the store", async () => {
    // Arrange
    const store = renderWithLifestyle({ quality: LifestyleType.Street, monthsPaid: 1 })

    // Act
    fireEvent.mouseDown(screen.getByRole("combobox"))
    fireEvent.click(screen.getByRole("option", { name: LifestyleType.Middle }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().profile.lifestyle?.quality).toBe(LifestyleType.Middle))
    // ...and the UI re-rendered off that same state.
    expect(screen.getByRole("combobox").textContent).toBe(LifestyleType.Middle)
  })

  it("changing months prepaid dispatches setLifestyleMonthsPaid and updates the store", async () => {
    // Arrange
    const store = renderWithLifestyle({ quality: LifestyleType.Street, monthsPaid: 1 })

    // Act
    fireEvent.change(screen.getByLabelText("Months prepaid"), { target: { value: "5" } })

    // Assert
    await waitFor(() => expect(store.getState().profile.lifestyle?.monthsPaid).toBe(5))
  })
})
