import { describe, expect, it } from "vitest"

import migration from "./20260823_00_addRunnerName.ts"

describe.concurrent("027_addRunnerName", () => {
  it("backfills name from profile.alias when set", () => {
    // Arrange
    const character = { profile: { alias: "Ghost", name: "Sarah Chen" } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.name).toBe("Ghost")
  })

  it("falls back to profile.name when alias is empty", () => {
    // Arrange
    const character = { profile: { alias: "", name: "Sarah Chen" } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.name).toBe("Sarah Chen")
  })

  it("defaults to an empty string when neither alias nor name is set", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.name).toBe("")
  })

  it("does not overwrite an already-stamped name", () => {
    // Arrange
    const character = { name: "Existing", profile: { alias: "Ghost", name: "Sarah Chen" } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.name).toBe("Existing")
  })
})
