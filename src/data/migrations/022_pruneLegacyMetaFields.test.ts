import { describe, expect, it } from "vitest"

import migration from "./022_pruneLegacyMetaFields.ts"

describe.concurrent("022_pruneLegacyMetaFields", () => {
  it("returns the character unchanged", () => {
    // Arrange
    const character = { profile: { alias: "Blur" } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual(character)
  })

  it("does not mutate the input character", () => {
    // Arrange
    const character = { profile: { alias: "Blur" } }
    const snapshot = JSON.parse(JSON.stringify(character)) as typeof character

    // Act
    migration.up(character)

    // Assert
    expect(character).toEqual(snapshot)
  })
})
