import { describe, expect, it } from "vitest"

import { VehicleCategory } from "#/system/gear/vehicleData.ts"

import migration from "./004_addVehicleCategory.ts"

describe("004_addVehicleCategory", () => {
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

  it("does nothing when _meta_.version is already at or past this migration", () => {
    // Arrange
    const character = {
      _meta_: { version: 4 },
      gear: { v1: { itemType: "vehicle" } },
    }

    // Act
    const result = migration.up(character)

    // Assert — vehicleCategory was not backfilled
    expect(result.gear?.v1.vehicleCategory).toBeUndefined()
  })
})
