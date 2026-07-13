import { createStore } from "@tanstack/store"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { VehiclesList } from "./vehiclesList.tsx"

const bike: VehicleData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Suzuki Mirage",
  itemType: ItemType.vehicle,
  vehicleCategory: VehicleCategory.vehicle,
  vehicleType: "Bike",
  handling: 5,
  accel: "1/2",
  pilot: 1,
  speed: 5,
  body: 4,
  armor: 6,
  sensor: 2,
}

describe("VehiclesList", () => {
  it("shows vehicles matching the category from the store", () => {
    // Arrange / Act
    renderInBuilder(<VehiclesList vehicleCategory={VehicleCategory.vehicle} />, {
      runnerStore: createStore(runnerDataFactory((runner) => ({ ...runner, gear: { [bike.id]: bike } }))),
    })

    // Assert
    expect(screen.getByText("Suzuki Mirage")).toBeDefined()
  })

  it("adding a vehicle dispatches addItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<VehiclesList vehicleCategory={VehicleCategory.vehicle} />)

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add vehicle/i }))
    fillNameAndClickSave("Ares Roadmaster")

    // Assert: the UI re-rendered off the updated store.
    expect(await screen.findByText("Ares Roadmaster")).toBeDefined()
  })

  it("removing a vehicle dispatches removeItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<VehiclesList vehicleCategory={VehicleCategory.vehicle} />, {
      runnerStore: createStore(runnerDataFactory((runner) => ({ ...runner, gear: { [bike.id]: bike } }))),
    })
    expect(screen.getByText("Suzuki Mirage")).toBeDefined()

    // Act: the remove icon button has no accessible name.
    const removeButton = screen.getAllByRole("button").find((button) => button.textContent === "")
    fireEvent.click(removeButton!)

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Suzuki Mirage")).toBeNull())
  })
})
