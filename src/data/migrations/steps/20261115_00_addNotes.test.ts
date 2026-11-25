import { describe, expect, it } from "vitest"

import migration from "./20261115_00_addNotes.ts"

describe.concurrent("addNotes", () => {
  it("adds empty notes to a runner without any", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.notes).toBe("")
  })

  it("keeps existing notes", () => {
    // Arrange
    const character = { notes: "Owes Mr. Johnson a favor" }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.notes).toBe("Owes Mr. Johnson a favor")
  })
})
