import { describe, expect, it } from "vitest"

import migration from "./20261120_00_flattenFeatureFlags.ts"

describe.concurrent("20261120_00_flattenFeatureFlags", () => {
  it("flattens nested House Rule overrides into namespaced refs", () => {
    // Arrange
    const character = { _data_: { featureFlags: { houseRules: { "karma.nuyenExchange": false } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.featureFlags).toEqual({ "houseRules.karma.nuyenExchange": false })
  })

  it("renames encumbranceEnabled to optionalRules.items.armor.encumbrance, keeping its value", () => {
    // Arrange
    const character = { _data_: { featureFlags: { optionalRules: { encumbranceEnabled: true } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.featureFlags).toEqual({ "optionalRules.items.armor.encumbrance": true })
  })

  it("keeps a false override rather than dropping it", () => {
    // Arrange
    const character = { _data_: { featureFlags: { optionalRules: { encumbranceEnabled: false } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.featureFlags).toEqual({ "optionalRules.items.armor.encumbrance": false })
  })

  it("drops empty nested namespaces", () => {
    // Arrange
    const character = { _data_: { featureFlags: { optionalRules: {}, houseRules: {} } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.featureFlags).toEqual({})
  })

  it("leaves already-flat feature flags untouched", () => {
    // Arrange
    const character = { _data_: { featureFlags: { "houseRules.karma.nuyenExchange": false } } }

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
    expect(twice._data_?.featureFlags).toEqual({ "optionalRules.items.armor.encumbrance": true })
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
