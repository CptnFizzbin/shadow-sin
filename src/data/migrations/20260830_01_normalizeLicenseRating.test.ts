import { describe, expect, it } from "vitest"

import migration from "./20260830_01_normalizeLicenseRating.ts"

describe.concurrent("normalizeLicenseRating", () => {
  it("returns the character unchanged when there is no _data_", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("converts a real Licence's sentinel rating to isReal: true with no rating", () => {
    // Arrange
    const character = { _data_: { items: { l1: { itemType: "license", rating: "real" } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.l1).toEqual({ itemType: "license", isReal: true })
  })

  it("converts a fake Licence's numeric rating to isReal: false, keeping the rating", () => {
    // Arrange
    const character = { _data_: { items: { l1: { itemType: "license", rating: 3 } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.l1).toEqual({ itemType: "license", isReal: false, rating: 3 })
  })

  it("is idempotent — a Licence already carrying isReal is left untouched", () => {
    // Arrange
    const character = { _data_: { items: { l1: { itemType: "license", isReal: false, rating: 3 } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.l1).toEqual({ itemType: "license", isReal: false, rating: 3 })
  })

  it("ignores non-Licence items even with a string rating", () => {
    // Arrange
    const character = { _data_: { items: { s1: { itemType: "sin", rating: "real" } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.s1).toEqual({ itemType: "sin", rating: "real" })
  })
})
