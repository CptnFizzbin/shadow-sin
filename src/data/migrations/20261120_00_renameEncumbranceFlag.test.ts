import { describe, expect, it } from "vitest"

import migration from "./20261120_00_renameEncumbranceFlag.ts"

describe.concurrent("20261120_00_renameEncumbranceFlag", () => {
  it("moves an encumbranceEnabled override to items.armor.encumbrance", () => {
    // Arrange
    const character = { _data_: { featureFlags: { optionalRules: { encumbranceEnabled: true } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.featureFlags).toEqual({ optionalRules: { "items.armor.encumbrance": true } })
  })

  it("keeps a false override rather than dropping it", () => {
    // Arrange
    const character = { _data_: { featureFlags: { optionalRules: { encumbranceEnabled: false } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.featureFlags).toEqual({ optionalRules: { "items.armor.encumbrance": false } })
  })

  it("leaves featureFlags untouched when there is no encumbranceEnabled override", () => {
    // Arrange
    const character = { _data_: { featureFlags: { optionalRules: {}, houseRules: { "karma.nuyenExchange": false } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toBe(character)
  })

  it("leaves a runner without _data_ untouched", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toBe(character)
  })

  it("is idempotent when run twice", () => {
    // Arrange
    const character = { _data_: { featureFlags: { optionalRules: { encumbranceEnabled: true } } } }

    // Act
    const twice = migration.up(migration.up(character))

    // Assert
    expect(twice._data_?.featureFlags).toEqual({ optionalRules: { "items.armor.encumbrance": true } })
  })

  it("does not mutate the input object", () => {
    // Arrange
    const character = { _data_: { featureFlags: { optionalRules: { encumbranceEnabled: true } } } }

    // Act
    migration.up(character)

    // Assert
    expect(character).toEqual({ _data_: { featureFlags: { optionalRules: { encumbranceEnabled: true } } } })
  })
})
