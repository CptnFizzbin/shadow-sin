import { describe, expect, it } from "vitest"

import migration from "./20261106_00_moveLifestyleToRunner.ts"

describe.concurrent("moveLifestyleToRunner", () => {
  it("moves profile.lifestyle to a top-level lifestyle with the standard upkeep", () => {
    // Arrange
    const character = { profile: { lifestyle: { quality: "Low", monthsPaid: 3 } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.lifestyle).toEqual({ name: "Low", upkeep: 2_000, monthsPaid: 3 })
    expect(result.profile).toEqual({})
  })

  it("defaults a null lifestyle to Street with one month prepaid", () => {
    // Arrange
    const character = { profile: { lifestyle: null } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.lifestyle).toEqual({ name: "Street", upkeep: 0, monthsPaid: 1 })
    expect(result.profile).toEqual({})
  })

  it("defaults an unrecognised quality to Street", () => {
    // Arrange
    const character = { profile: { lifestyle: { quality: "toString", monthsPaid: 2 } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.lifestyle).toEqual({ name: "Street", upkeep: 0, monthsPaid: 2 })
  })

  it("keeps an already-migrated lifestyle and drops a re-added profile.lifestyle", () => {
    // Arrange
    const lifestyle = { name: "Trust Fund", upkeep: -5_000, monthsPaid: 0, notes: "Paid by the family" }
    const character = { profile: { lifestyle: null }, lifestyle }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.lifestyle).toEqual(lifestyle)
    expect(result.profile).toEqual({})
  })
})
