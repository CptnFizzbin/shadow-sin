import { describe, expect, it } from "vitest"

import migration from "#/character/migrations/20250801_addSpellThreshold.ts"

describe("20250801_addSpellThreshold", () => {
  it("initialises spells to an empty array when missing", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells).toEqual([])
  })

  it("adds an empty threshold to spells that lack one", () => {
    // Arrange
    const character = {
      spells: [{ name: "Fireball" }, { name: "Heal" }] as { name: string, threshold?: string }[],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells).toEqual([
      { name: "Fireball", threshold: "" },
      { name: "Heal", threshold: "" },
    ])
  })

  it("does not overwrite an existing threshold", () => {
    // Arrange
    const character = {
      spells: [{ name: "Detect Life", threshold: "F" }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells?.[0].threshold).toBe("F")
  })

  it("does not mutate the input character", () => {
    // Arrange
    const original = { spells: [{ name: "Fireball" }] as { name: string, threshold?: string }[] }
    const snapshot = JSON.parse(JSON.stringify(original)) as typeof original

    // Act
    migration.up(original)

    // Assert
    expect(original).toEqual(snapshot)
  })
})
