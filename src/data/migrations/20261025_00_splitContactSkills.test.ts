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
        { id: expect.any(String), name: "Street Gangs", type: "knowledge" },
        { id: expect.any(String), name: "Corporate Politics", type: "knowledge", specialization: "Ares" },
      ],
    }])
  })

  it("keeps the id and type of skills that already have them", () => {
    // Arrange
    const skill = { id: "00000000-0000-4000-8000-000000000001", name: "Pistols", type: "keyActive" }
    const character = { contacts: [{ skills: [skill] }] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.contacts).toEqual([{ skills: [skill] }])
  })

  it("gives each migrated skill a distinct id", () => {
    // Arrange
    const character = {
      contacts: [{ knowledgeSkills: [{ name: "Street Gangs", rating: 3 }, { name: "Smuggling", rating: 2 }] }],
    }

    // Act
    const result = migration.up(character)

    // Assert
    const [first, second] = result.contacts?.[0].skills ?? []
    expect(first.id).not.toBe(second.id)
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
