import { describe, expect, it } from "vitest"

import migration from "./20260424_addSpiritsArray.ts"

describe("20260424_addSpiritsArray", () => {
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
})
