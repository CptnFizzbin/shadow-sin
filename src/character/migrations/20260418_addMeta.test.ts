import { describe, expect, it } from "vitest"

import migration from "./20260418_addMeta.ts"

describe("20260418_addMeta", () => {
  it("creates a _meta_ object with version 1 when missing", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._meta_).toEqual({ version: 1 })
  })

  it("preserves existing _meta_ fields and only sets version", () => {
    // Arrange — appliedMigrations was already populated by the manager
    const character = {
      _meta_: { appliedMigrations: ["20250101"] } as { version?: number, appliedMigrations: string[] },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._meta_).toEqual({ version: 1, appliedMigrations: ["20250101"] })
  })

  it("does not overwrite an existing version", () => {
    // Arrange
    const character = { _meta_: { version: 5 } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._meta_.version).toBe(5)
  })
})
