import { describe, expect, it } from "vitest"

import migration from "./20260830_00_normalizeSinRating.ts"

describe.concurrent("normalizeSinRating", () => {
  it("returns the character unchanged when there is no _data_", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("converts a real SIN's sentinel rating to isReal: true with no rating", () => {
    // Arrange
    const character = { _data_: { items: { s1: { itemType: "sin", rating: "real" } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.s1).toEqual({ itemType: "sin", isReal: true })
  })

  it("converts a fake SIN's numeric rating to isReal: false, keeping the rating", () => {
    // Arrange
    const character = { _data_: { items: { s1: { itemType: "sin", rating: 4 } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.s1).toEqual({ itemType: "sin", isReal: false, rating: 4 })
  })

  it("is idempotent — a SIN already carrying isReal is left untouched", () => {
    // Arrange
    const character = { _data_: { items: { s1: { itemType: "sin", isReal: false, rating: 4 } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.s1).toEqual({ itemType: "sin", isReal: false, rating: 4 })
  })

  it("ignores non-SIN items even with a string rating", () => {
    // Arrange
    const character = { _data_: { items: { l1: { itemType: "license", rating: "real" } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.l1).toEqual({ itemType: "license", rating: "real" })
  })
})
