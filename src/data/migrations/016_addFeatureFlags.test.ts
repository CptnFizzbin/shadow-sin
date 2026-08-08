import { describe, expect, it } from "vitest"

import migration from "./016_addFeatureFlags.ts"

describe("016_addFeatureFlags", () => {
  it("adds an empty featureFlags object when the field is absent", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.featureFlags).toEqual({})
  })

  it("preserves an existing featureFlags object without overwriting it", () => {
    // Arrange
    const character = {
      featureFlags: {
        optionalRules: { encumbranceEnabled: true },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.featureFlags).toEqual({
      optionalRules: { encumbranceEnabled: true },
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

  it("does nothing when _meta_.version is already at or past this migration", () => {
    // Arrange
    const character = { _meta_: { version: 16 } }

    // Act
    const result = migration.up(character)

    // Assert — featureFlags was not backfilled
    expect(result).not.toHaveProperty("featureFlags")
  })
})
