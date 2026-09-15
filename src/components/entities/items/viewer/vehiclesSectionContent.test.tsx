import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { VehicleData } from "#/system/model/items/vehicleData.ts"
import { VehicleCategory } from "#/system/model/items/vehicleData.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { VehiclesSectionContent } from "./vehiclesSectionContent.tsx"

const bike: VehicleData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
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

describe("VehiclesSectionContent", () => {
  it("shows vehicles from the store", () => {
    // Arrange / Act
    renderInBuilder(<VehiclesSectionContent />, {
      runner: runnerDataFactory({ items: { [bike.id]: bike } }),
    })

    // Assert
    expect(screen.getByText("Suzuki Mirage")).toBeDefined()
  })

  it("tapping a vehicle opens the edit dialog directly — the Builder has no details page", () => {
    // Arrange
    renderInBuilder(<VehiclesSectionContent />, {
      runner: runnerDataFactory({ items: { [bike.id]: bike } }),
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: /suzuki mirage/i }))

    // Assert: the vehicle form dialog opened, pre-filled for editing.
    expect(screen.getByRole("dialog", { name: /edit vehicle/i })).toBeDefined()
  })

  it("removing a vehicle dispatches removeItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<VehiclesSectionContent />, {
      runner: runnerDataFactory({ items: { [bike.id]: bike } }),
    })
    expect(screen.getByText("Suzuki Mirage")).toBeDefined()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Suzuki Mirage")).toBeNull())
  })
})
