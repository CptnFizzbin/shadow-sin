import { describe, expect, it } from "vitest"

import migration from "./20261108_01_addSpellSustainTarget.ts"

describe.concurrent("addSpellSustainTarget", () => {
  it("marks a sustained spell as sustained on Self", () => {
    // Arrange
    const character = { spells: [{ sustained: true }] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells).toEqual([{ sustained: true, sustainedOn: "Self" }])
  })

  it("keeps a sustained spell's existing target", () => {
    // Arrange
    const character = { spells: [{ sustained: true, sustainedOn: "Other" }] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells).toEqual([{ sustained: true, sustainedOn: "Other" }])
  })

  it("leaves a spell that isn't sustained untouched", () => {
    // Arrange
    const character = { spells: [{ sustained: false }, {}] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells).toEqual([{ sustained: false }, {}])
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
