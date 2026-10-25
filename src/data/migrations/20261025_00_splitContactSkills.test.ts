import { describe, expect, it } from "vitest"

import migration from "./20261025_00_splitContactSkills.ts"

describe.concurrent("splitContactSkills", () => {
  it("moves rated knowledgeSkills into unrated knowledge-typed skills", () => {
    // Arrange
    const character = {
      contacts: [{
        knowledgeSkills: [
          { name: "Street Gangs", rating: 3 },
          { name: "Corporate Politics", rating: 2, specialization: "Ares" },
        ],
      }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.contacts).toEqual([{
      skills: [
        { name: "Street Gangs", type: "knowledge" },
        { name: "Corporate Politics", type: "knowledge", specialization: "Ares" },
      ],
    }])
  })

  it("keeps the type of skills that already have one", () => {
    // Arrange
    const character = {
      contacts: [{ skills: [{ name: "Pistols", type: "keyActive" }] }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.contacts).toEqual([{ skills: [{ name: "Pistols", type: "keyActive" }] }])
  })

  it("gives a contact with no skills an empty skills list", () => {
    // Arrange
    const character = { contacts: [{}] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.contacts).toEqual([{ skills: [] }])
  })

  it("leaves a runner without contacts untouched", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })

  it("is idempotent — running it twice produces the same result", () => {
    // Arrange
    const character = { contacts: [{ knowledgeSkills: [{ name: "Street Gangs", rating: 3 }] }] }

    // Act
    const once = migration.up(character)
    const twice = migration.up(once)

    // Assert
    expect(twice).toEqual(once)
  })
})
