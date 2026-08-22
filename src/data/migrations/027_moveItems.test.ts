import { describe, expect, it } from "vitest"

import migration from "./027_moveItems.ts"

describe.concurrent("027_moveItems", () => {
  it("moves gear into _data_.items", () => {
    // Arrange
    const character = {
      gear: {
        a1: { itemType: "armor" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_.items).toEqual({ a1: { itemType: "armor" } })
  })

  it("removes the top-level gear field", () => {
    // Arrange
    const character = {
      gear: {
        a1: { itemType: "armor" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).not.toHaveProperty("gear")
  })

  it("defaults _data_.items to an empty object when gear is absent", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_.items).toEqual({})
  })

  it("moves featureFlags into _data_.featureFlags", () => {
    // Arrange
    const character = {
      featureFlags: { optionalRules: { encumbranceEnabled: true } },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_.featureFlags).toEqual({ optionalRules: { encumbranceEnabled: true } })
  })

  it("removes the top-level featureFlags field", () => {
    // Arrange
    const character = {
      featureFlags: { optionalRules: { encumbranceEnabled: true } },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).not.toHaveProperty("featureFlags")
  })

  it("defaults _data_.featureFlags to an empty object when featureFlags is absent", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_.featureFlags).toEqual({})
  })
})
