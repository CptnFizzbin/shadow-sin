import { describe, expect, it } from "vitest"

import migration from "./20261118_00_addSpellSustainedBy.ts"

describe.concurrent("addSpellSustainedBy", () => {
  it("marks every spell as sustained by its caster", () => {
    // Arrange
    const character = { spells: [{}, {}] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells).toEqual([{ sustainedBy: null }, { sustainedBy: null }])
  })

  it("keeps a spell's existing sustaining focus", () => {
    // Arrange
    const character = { spells: [{ sustainedBy: "focus-id" }] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells).toEqual([{ sustainedBy: "focus-id" }])
  })

  it("handles a runner with no spells", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })
})
