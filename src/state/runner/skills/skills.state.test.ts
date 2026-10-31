import { describe, expect, it } from "vitest"

import type { RunnerData } from "#/system/model/runnerData.ts"
import { uuid } from "#/utils/uuidUtils.ts"

import { removeKnowledgeSkill, removeLanguageSkill, setKnowledgeSkill, setLanguageSkill } from "./skills.actions.ts"
import { skillsReducer } from "./skills.state.ts"

const emptySkills = (): RunnerData["skills"] => ({
  activeSkills: [],
  skillGroups: [],
  knowledgeSkills: [],
  languageSkills: [],
})

describe.concurrent("setKnowledgeSkill", () => {
  it("renames a Knowledge Skill in place instead of adding a second one", () => {
    // Arrange
    const skill = { id: uuid.v7(), name: "Gangs", rating: 3 }
    const state = { ...emptySkills(), knowledgeSkills: [skill] }

    // Act
    const next = skillsReducer(state, setKnowledgeSkill({ ...skill, name: "Seattle Gangs" }))

    // Assert
    expect(next.knowledgeSkills).toEqual([{ ...skill, name: "Seattle Gangs" }])
  })

  it("adds a Knowledge Skill with a new id", () => {
    // Arrange
    const existing = { id: uuid.v7(), name: "Gangs", rating: 3 }
    const added = { id: uuid.v7(), name: "Gangs", rating: 1 }
    const state = { ...emptySkills(), knowledgeSkills: [existing] }

    // Act
    const next = skillsReducer(state, setKnowledgeSkill(added))

    // Assert
    expect(next.knowledgeSkills).toEqual([existing, added])
  })
})

describe.concurrent("removeKnowledgeSkill", () => {
  it("removes only the Knowledge Skill with the given id", () => {
    // Arrange
    const kept = { id: uuid.v7(), name: "Gangs", rating: 3 }
    const removed = { id: uuid.v7(), name: "Gangs", rating: 1 }
    const state = { ...emptySkills(), knowledgeSkills: [kept, removed] }

    // Act
    const next = skillsReducer(state, removeKnowledgeSkill(removed.id))

    // Assert
    expect(next.knowledgeSkills).toEqual([kept])
  })
})

describe.concurrent("setLanguageSkill", () => {
  it("renames a Language Skill in place instead of adding a second one", () => {
    // Arrange
    const skill = { id: uuid.v7(), name: "Elven", isNative: false, rating: 3 }
    const state = { ...emptySkills(), languageSkills: [skill] }

    // Act
    const next = skillsReducer(state, setLanguageSkill({ ...skill, name: "Sperethiel" }))

    // Assert
    expect(next.languageSkills).toEqual([{ ...skill, name: "Sperethiel" }])
  })
})

describe.concurrent("removeLanguageSkill", () => {
  it("removes only the Language Skill with the given id", () => {
    // Arrange
    const kept = { id: uuid.v7(), name: "English", isNative: true }
    const removed = { id: uuid.v7(), name: "Sperethiel", isNative: false, rating: 3 }
    const state = { ...emptySkills(), languageSkills: [kept, removed] }

    // Act
    const next = skillsReducer(state, removeLanguageSkill(removed.id))

    // Assert
    expect(next.languageSkills).toEqual([kept])
  })
})
