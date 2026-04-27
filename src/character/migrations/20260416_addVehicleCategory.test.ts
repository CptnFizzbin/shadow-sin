import { describe, expect, it } from "vitest"

import migration from "#/character/migrations/20260416_addVehicleCategory.ts"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"

describe("20260416_addVehicleCategory", () => {
  it("returns the character unchanged when there is no gear", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("sets the default vehicle category for vehicles missing one", () => {
    // Arrange
    const character = {
      gear: {
        v1: { itemType: "vehicle" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.v1.vehicleCategory).toBe(VehicleCategory.vehicle)
  })

  it("does not overwrite an existing vehicleCategory", () => {
    // Arrange
    const character = {
      gear: {
        v1: { itemType: "vehicle", vehicleCategory: "drone" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.v1.vehicleCategory).toBe("drone")
  })

  it("ignores non-vehicle gear", () => {
    // Arrange
    const character = {
      gear: {
        w1: { itemType: "weapon" },
        a1: { itemType: "armor" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.w1.vehicleCategory).toBeUndefined()
    expect(result.gear?.a1.vehicleCategory).toBeUndefined()
  })
})
