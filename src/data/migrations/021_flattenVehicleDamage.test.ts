import { describe, expect, it } from "vitest"

import migration from "./021_flattenVehicleDamage.ts"

describe.concurrent("021_flattenVehicleDamage", () => {
  it("returns the character unchanged when there is no gear", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("flattens a vehicle's { current, max } damage down to a plain number", () => {
    // Arrange
    const character = {
      gear: {
        v1: { itemType: "vehicle", damage: { physical: { current: 3, max: 6 } } },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.v1.damage).toEqual({ physical: 3 })
  })

  it("defaults to 0 when the old shape has no numeric current value", () => {
    // Arrange
    const character = {
      gear: {
        v1: { itemType: "vehicle", damage: { physical: { max: 6 } } },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.v1.damage).toEqual({ physical: 0 })
  })

  it("leaves a vehicle with no damage field alone", () => {
    // Arrange
    const character = {
      gear: {
        v1: { itemType: "vehicle" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.v1.damage).toBeUndefined()
  })

  it("is idempotent — leaves an already-flattened vehicle damage value alone", () => {
    // Arrange
    const character = {
      gear: {
        v1: { itemType: "vehicle", damage: { physical: 3 } },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.v1.damage).toEqual({ physical: 3 })
  })

  it("ignores non-vehicle gear", () => {
    // Arrange
    const character = {
      gear: {
        w1: { itemType: "weapon" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.w1.damage).toBeUndefined()
  })
})
