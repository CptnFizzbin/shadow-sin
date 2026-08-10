import { describe, expect, it } from "vitest"

import migration from "./026_removeArmorRatingField.ts"

describe("026_removeArmorRatingField", () => {
  it("returns the character unchanged when there is no gear", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("removes a numeric rating from armor", () => {
    // Arrange
    const character = {
      gear: {
        a1: { itemType: "armor", rating: 8 },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.a1.rating).toBeUndefined()
    expect("rating" in result.gear!.a1).toBe(false)
  })

  it("leaves armor with no rating alone", () => {
    // Arrange
    const character = {
      gear: {
        a1: { itemType: "armor" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.a1.rating).toBeUndefined()
  })

  it("ignores non-armor gear even with a rating", () => {
    // Arrange
    const character = {
      gear: {
        s1: { itemType: "sin", rating: 3 },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.s1.rating).toBe(3)
  })
})
