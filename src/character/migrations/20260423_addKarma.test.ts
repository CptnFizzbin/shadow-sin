import { describe, expect, it } from "vitest"

import migration from "#/character/migrations/20260423_addKarma.ts"

describe("20260423_addKarma", () => {
  it("sets karma to { current: 0, total: 0 } when the field is missing", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.karma).toEqual({ current: 0, total: 0 })
  })

  it("converts a plain karma number to { current: N, total: N }", () => {
    // Arrange
    const character = { karma: 42 }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.karma).toEqual({ current: 42, total: 42 })
  })

  it("does not overwrite an existing karma object that has both fields", () => {
    // Arrange
    const character = { karma: { current: 5, total: 20 } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.karma).toEqual({ current: 5, total: 20 })
  })

  it("backfills only missing sub-fields when karma is a partial object", () => {
    // Arrange — old data may have had only one sub-field
    const character = { karma: { total: 15 } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.karma).toEqual({ current: 0, total: 15 })
  })
})
