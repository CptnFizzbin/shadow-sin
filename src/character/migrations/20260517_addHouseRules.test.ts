import { describe, expect, it } from "vitest"

import { defaultHouseRules } from "#/system/houseRules.ts"

import migration from "./20260517_addHouseRules.ts"

describe("20260517_addHouseRules", () => {
  it("adds defaultHouseRules when the field is absent", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.houseRules).toEqual(defaultHouseRules)
  })

  it("preserves an existing houseRules object without overwriting fields", () => {
    // Arrange
    const character = {
      houseRules: {
        woundModifierInterval: 4,
        encumbranceEnabled: false,
      } as const,
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.houseRules).toEqual({
      woundModifierInterval: 4,
      encumbranceEnabled: false,
    })
  })

  it("does not mutate the input object", () => {
    // Arrange
    const character = {}

    // Act
    migration.up(character)

    // Assert
    expect(character).toEqual({})
  })
})
