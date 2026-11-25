import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { runnerSections } from "#app/components/runner/sections/runnerSections.ts"
import { EntityKind } from "#data/entities/entityKind.ts"
import { ItemType } from "#data/items/itemType.ts"
import type { VehicleData } from "#data/items/vehicleData.ts"
import { VehicleCategory } from "#data/items/vehicleData.ts"
import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import { makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

import { useRunnerTabs } from "./useRunnerTabs.ts"

const makeVehicle = (id: VehicleData["id"], vehicleCategory: VehicleCategory): VehicleData => ({
  kind: EntityKind.item,
  items: { parentId: null, childIds: [] },
  id,
  name: vehicleCategory === VehicleCategory.drone ? "MCT Fly-Spy" : "Suzuki Mirage",
  itemType: ItemType.vehicle,
  vehicleCategory,
  vehicleType: "Micro",
  handling: 4,
  accel: "5/10",
  pilot: 3,
  speed: 10,
  body: 0,
  armor: 0,
  sensor: 3,
})

describe("useRunnerTabs", () => {
  it("hides the Drones tab when the Runner has no drones", () => {
    // Arrange
    const bike = makeVehicle("00000000-0000-0000-0000-000000000001", VehicleCategory.vehicle)
    const runner = runnerDataFactory({ items: { [bike.id]: bike } })

    // Act
    const { result } = renderHook(() => useRunnerTabs(), { wrapper: makeRunnerDataWrapper(runner) })

    // Assert
    expect(result.current).not.toContain(runnerSections.drones)
    expect(result.current).toContain(runnerSections.vehicles)
  })

  it("shows the Drones tab when the Runner has a drone", () => {
    // Arrange
    const drone = makeVehicle("00000000-0000-0000-0000-000000000002", VehicleCategory.drone)
    const runner = runnerDataFactory({ items: { [drone.id]: drone } })

    // Act
    const { result } = renderHook(() => useRunnerTabs(), { wrapper: makeRunnerDataWrapper(runner) })

    // Assert
    expect(result.current).toContain(runnerSections.drones)
  })
})
