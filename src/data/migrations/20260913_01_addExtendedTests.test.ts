import { describe, expect, it } from "vitest"

import migration from "./20260913_01_addExtendedTests.ts"

describe.concurrent("addExtendedTests", () => {
  it("adds an empty extendedTests array when entirely missing", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.extendedTests).toEqual([])
  })

  it("leaves an existing extendedTests array untouched", () => {
    // Arrange
    const existingTests = [
      { id: "00000000-0000-0000-0000-000000000001", description: "Prior test", interval: "1-day", hitsThreshold: 5, currentHits: 2, attempts: 1 },
    ]
    const character = { extendedTests: existingTests }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.extendedTests).toEqual(existingTests)
  })

  it("is idempotent — running it twice produces the same result", () => {
    // Arrange
    const character = {}

    // Act
    const once = migration.up(character)
    const twice = migration.up(once)

    // Assert
    expect(twice).toEqual(once)
  })
})
