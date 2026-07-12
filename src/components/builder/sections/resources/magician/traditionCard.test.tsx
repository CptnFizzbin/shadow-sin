import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataProvider } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { TraditionData } from "#/system/magic/traditionData.ts"
import { SpiritType } from "#/system/magic/traditionData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { TraditionCard } from "./traditionCard.tsx"

const hermeticTradition: TraditionData = {
  name: "Hermetic",
  spiritTypes: {
    combat: SpiritType.fire,
    detection: SpiritType.wind,
    health: SpiritType.earth,
    illusion: SpiritType.water,
    manipulation: SpiritType.fire,
  },
  drainAttribute: AttributeKey.logic,
  concept: "",
}

function renderWithTradition(tradition: TraditionData | null) {
  const runnerData = runnerDataFactory((data) => {
    data.tradition = tradition
    return data
  })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerDataProvider store={store}>{children}</RunnerDataProvider>
  )

  render(<TraditionCard />, { wrapper: Wrapper })

  return store
}

describe("TraditionCard", () => {
  it("shows a prompt to set a tradition when none is set", () => {
    // Arrange / Act
    renderWithTradition(null)

    // Assert
    expect(screen.getByText("Set Tradition")).toBeDefined()
  })

  it("shows the runner's current tradition name and drain attribute", () => {
    // Arrange / Act
    renderWithTradition(hermeticTradition)

    // Assert
    expect(screen.getByText("Hermetic")).toBeDefined()
    expect(screen.getByText(/WIL \+ LOG/)).toBeDefined()
  })

  it("editing and saving the tradition dispatches saveTradition and updates the store", async () => {
    // Arrange
    const store = renderWithTradition(hermeticTradition)

    // Act: open the pre-filled edit dialog, change the name, and save
    fireEvent.click(screen.getByText("Hermetic"))
    const dialog = await screen.findByRole("dialog", { name: "Tradition" })
    const nameField = within(dialog).getByLabelText(/^name/i)
    fireEvent.change(nameField, { target: { value: "Shamanic" } })
    fireEvent.blur(nameField)
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert: state updated...
    await waitFor(() => expect(store.state.tradition?.name).toBe("Shamanic"), { timeout: 3000 })
    // ...and the UI re-rendered off that same state.
    expect(await screen.findByText("Shamanic")).toBeDefined()
    expect(screen.queryByText("Hermetic")).toBeNull()
  })
})
