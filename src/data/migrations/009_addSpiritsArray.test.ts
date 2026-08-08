import { describe, expect, it } from "vitest"

import migration from "./009_addSpiritsArray.ts"

describe("009_addSpiritsArray", () => {
  it("initialises spirits to an empty array when missing", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spirits).toEqual([])
  })

  it("preserves an existing spirits array", () => {
    // Arrange
    const spirits = [{ id: "s1", name: "Fire Spirit" }]
    const character = { spirits }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spirits).toEqual(spirits)
  })

  it("does not mutate the input character", () => {
    // Arrange
    const original = { spirits: [{ id: "s1" }] }
    const snapshot = JSON.parse(JSON.stringify(original)) as typeof original

    // Act
    migration.up(original)

    // Assert
    expect(original).toEqual(snapshot)
  })

  it("does nothing when _meta_.version is already at or past this migration", () => {
    // Arrange
    const character = { _meta_: { version: 9 } }

    // Act
    const result = migration.up(character)

    // Assert — spirits was not backfilled
    expect(result).not.toHaveProperty("spirits")
  })
})
