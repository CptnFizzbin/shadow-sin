import { describe, expect, it } from "vitest"

import migration from "./20261031_00_addKnowledgeLanguageSkillIds.ts"

describe.concurrent("addKnowledgeLanguageSkillIds", () => {
  it("adds a unique id to every Knowledge and Language skill missing one", () => {
    // Arrange
    const character = {
      skills: {
        knowledgeSkills: [{ name: "Gangs", rating: 3 }, { name: "Magic Theory", rating: 2 }],
        languageSkills: [{ name: "English", isNative: true }],
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    const ids = [...result.skills!.knowledgeSkills!, ...result.skills!.languageSkills!].map((skill) => skill.id)
    expect(ids).toEqual([expect.any(String), expect.any(String), expect.any(String)])
    expect(new Set(ids).size).toBe(3)
    expect(result.skills!.knowledgeSkills![0]).toEqual({ id: ids[0], name: "Gangs", rating: 3 })
  })

  it("keeps an id a skill already has", () => {
    // Arrange
    const skill = { id: "8d3f1c2a-1b2c-4d5e-8f90-123456789abc", name: "Gangs", rating: 3 }
    const character = { skills: { knowledgeSkills: [skill], languageSkills: [] } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.skills!.knowledgeSkills![0]).toEqual(skill)
  })

  it("leaves a Runner without skills untouched", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).toEqual({})
  })
})
