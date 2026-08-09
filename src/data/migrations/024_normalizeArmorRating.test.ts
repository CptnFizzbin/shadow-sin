import { describe, expect, it } from "vitest"

import migration from "./024_normalizeArmorRating.ts"

describe("024_normalizeArmorRating", () => {
  it("returns the character unchanged when there is no gear", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("converts a numeric string rating to a number", () => {
    // Arrange
    const character = {
      gear: {
        a1: { itemType: "armor", rating: "4" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.a1.rating).toBe(4)
  })

  it("trims whitespace before converting a numeric string rating", () => {
    // Arrange
    const character = {
      gear: {
        a1: { itemType: "armor", rating: " 6 " },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.a1.rating).toBe(6)
  })

  it("removes an empty string rating", () => {
    // Arrange
    const character = {
      gear: {
        a1: { itemType: "armor", rating: "" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.a1.rating).toBeUndefined()
  })

  it("removes a non-numeric string rating", () => {
    // Arrange
    const character = {
      gear: {
        a1: { itemType: "armor", rating: "real" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.a1.rating).toBeUndefined()
  })

  it("leaves a numeric rating alone", () => {
    // Arrange
    const character = {
      gear: {
        a1: { itemType: "armor", rating: 8 },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.a1.rating).toBe(8)
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

  it("ignores non-armor gear even with a string rating", () => {
    // Arrange
    const character = {
      gear: {
        s1: { itemType: "sin", rating: "real" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.s1.rating).toBe("real")
  })
})
