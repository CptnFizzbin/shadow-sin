import { describe, expect, it } from "vitest"

import migration from "./20260517_addFeatureFlags.ts"

describe("20260517_addFeatureFlags", () => {
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
})
