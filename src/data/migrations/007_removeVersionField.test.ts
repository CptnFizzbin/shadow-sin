import { describe, expect, it } from "vitest"

import migration from "./007_removeVersionField.ts"

describe("007_removeVersionField", () => {
  it("removes the top-level version field when present", () => {
    // Arrange
    const character = { version: 3 }

    // Act
    const result = migration.up(character)

    // Assert
    expect("version" in result).toBe(false)
  })

  it("is a no-op when there is no version field", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect("version" in result).toBe(false)
  })

  it("preserves unrelated top-level fields", () => {
    // Arrange
    const character = { version: 1, id: "abc", profile: { alias: "Blur" } } as {
      version?: number
      id?: string
      profile?: { alias: string }
    }

    // Act
    const result = migration.up(character) as typeof character

    // Assert
    expect(result.id).toBe("abc")
    expect(result.profile).toEqual({ alias: "Blur" })
    expect("version" in result).toBe(false)
  })

  it("does nothing when _meta_.version is already at or past this migration", () => {
    // Arrange
    const character = { _meta_: { version: 7 }, version: 1 }

    // Act
    const result = migration.up(character)

    // Assert — the legacy version field was left in place
    expect("version" in result).toBe(true)
  })
})
