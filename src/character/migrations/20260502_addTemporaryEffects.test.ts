import { describe, expect, it } from "vitest"

import migration from "./20260502_addTemporaryEffects.ts"

describe("20260502_addTemporaryEffects", () => {
  it("initialises temporaryEffects to an empty array when missing", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.temporaryEffects).toEqual([])
  })

  it("preserves an existing temporaryEffects array", () => {
    // Arrange
    const temporaryEffects = [{ id: "abc", label: "Team Sync", enabled: true, type: "attrMod", value: 1 }]
    const character = { temporaryEffects }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.temporaryEffects).toEqual(temporaryEffects)
  })

  it("does not mutate the input character", () => {
    // Arrange
    const original = {}
    const snapshot = {}

    // Act
    migration.up(original)

    // Assert
    expect(original).toEqual(snapshot)
  })
})
