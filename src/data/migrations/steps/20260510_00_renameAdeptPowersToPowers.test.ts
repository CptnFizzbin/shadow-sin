import { describe, expect, it } from "vitest"

import migration from "./20260510_00_renameAdeptPowersToPowers.ts"

describe.concurrent("014_renameAdeptPowersToPowers", () => {
  it("renames adeptPowers to powers", () => {
    // Arrange
    const character = {
      adeptPowers: [{ id: "abc", name: "Astral Perception", rating: 1, costPerRating: 1 }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.powers).toHaveLength(1)
    expect("adeptPowers" in result).toBe(false)
  })

  it("preserves the existing power data", () => {
    // Arrange
    const power = { type: "adeptPower", id: "abc", name: "Improved Reflexes 2", rating: 1, costPerRating: 2.5 }
    const character = { adeptPowers: [power] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.powers?.[0]).toEqual(power)
  })

  it("initialises powers as undefined when adeptPowers is missing", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.powers).toBeUndefined()
    expect("adeptPowers" in result).toBe(false)
  })

  it("is idempotent — does not double-wrap an already-renamed character", () => {
    // Arrange
    const character = {
      powers: [{ id: "abc", name: "Astral Perception", rating: 1, costPerRating: 1 }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.powers).toHaveLength(1)
    expect("adeptPowers" in result).toBe(false)
  })

  it("initialises powers to an empty array when adeptPowers is undefined", () => {
    // Arrange
    const character = { adeptPowers: undefined }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.powers).toEqual([])
    expect("adeptPowers" in result).toBe(false)
  })
})
