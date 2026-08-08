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

  it("does nothing when _meta_.version is already at or past this migration", () => {
    // Arrange — _meta_ present, so the guard is moot here, but the check still holds
    const character = { _meta_: { version: 6 } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._meta_).toEqual({ version: 6 })
  })
})
