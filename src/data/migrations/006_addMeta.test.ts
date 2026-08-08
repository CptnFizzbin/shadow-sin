import { describe, expect, it } from "vitest"

import migration from "./006_addMeta.ts"

describe("006_addMeta", () => {
  it("creates an empty _meta_ object when missing", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._meta_).toEqual({})
  })

  it("preserves existing _meta_ fields", () => {
    // Arrange
    const character = { _meta_: { version: 3 } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._meta_).toEqual({ version: 3 })
  })
})
