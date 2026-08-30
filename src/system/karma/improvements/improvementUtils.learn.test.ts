import { produce } from "immer"
import { describe, expect, it } from "vitest"

import type { UUID } from "#/lib/uuidUtils.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import type {
  LearnActiveSkillEntry,
  LearnKnowledgeSkillEntry,
  LearnLanguageSkillEntry,
  LearnSkillGroupEntry,
} from "./improvementEntry.ts"
import { ImprovementType } from "./improvementType.ts"
import {
  applyImprovement,
  getImprovementCost,
} from "./improvementUtils.ts"

const FAKE_ID = "00000000-0000-0000-0000-000000000000" as UUID

describe.concurrent("getImprovementCost — learn entries", () => {
  it("charges 4k for a new active skill at rating 1", () => {
    // Arrange
    const entry: LearnActiveSkillEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnActiveSkill,
      skill: { name: SkillKey.pistols, rating: 1 },
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert — 4 (new) + 0 (no rating bump)
    expect(cost).toBe(4)
  })

  it("charges 4k + improve-to-rating for a new active skill at higher rating", () => {
    // Arrange — rating 3: 4 (new) + 2*2 + 3*2 = 4 + 4 + 6 = 14
    const entry: LearnActiveSkillEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnActiveSkill,
      skill: { name: SkillKey.pistols, rating: 3 },
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(14)
  })

  it("charges 10k for a new skill group at rating 1", () => {
    // Arrange
    const entry: LearnSkillGroupEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnSkillGroup,
      group: { name: SkillGroupKey.Firearms, rating: 1 },
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(10)
  })

  it("charges 2k for a new knowledge skill at rating 1", () => {
    // Arrange
    const entry: LearnKnowledgeSkillEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnKnowledgeSkill,
      skill: { name: "Ancient History", rating: 1 },
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(2)
  })

  it("charges 2k for a new language skill at rating 1", () => {
    // Arrange
    const entry: LearnLanguageSkillEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnLanguageSkill,
      skill: { name: "Sperethiel", isNative: false, rating: 1 },
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(2)
  })
})

describe.concurrent("applyImprovement — learn entries", () => {
  it("pushes the new active skill onto the runner sheet", () => {
    // Arrange
    const entry: LearnActiveSkillEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnActiveSkill,
      skill: { name: SkillKey.pistols, rating: 1 },
    }
    const sheet = runnerDataFactory({ afterBuild: (draft) => {
      draft.skills.activeSkills = []
      draft.skills.skillGroups = []
      draft.karma.current = 20
    } })

    // Act
    const next = produce(sheet, (draft) => applyImprovement(draft, entry))

    // Assert
    expect(next.skills.activeSkills.find((s) => s.name === SkillKey.pistols)).toEqual({
      name: SkillKey.pistols,
      rating: 1,
    })
    expect(next.karma.current).toBe(20 - 4)
  })

  it("throws when the active skill already exists on the sheet", () => {
    // Arrange
    const entry: LearnActiveSkillEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnActiveSkill,
      skill: { name: SkillKey.pistols, rating: 1 },
    }
    const sheet = runnerDataFactory({ afterBuild: (draft) => {
      draft.skills.activeSkills = [{ name: SkillKey.pistols, rating: 2 }]
    } })

    // Act
    const act = () => produce(sheet, (draft) => applyImprovement(draft, entry))

    // Assert
    expect(act).toThrow(/already exists/i)
  })

  it("pushes the new skill group onto the runner sheet", () => {
    // Arrange
    const entry: LearnSkillGroupEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnSkillGroup,
      group: { name: SkillGroupKey.Firearms, rating: 1 },
    }
    const sheet = runnerDataFactory({ afterBuild: (draft) => {
      draft.skills.activeSkills = []
      draft.skills.skillGroups = []
      draft.karma.current = 20
    } })

    // Act
    const next = produce(sheet, (draft) => applyImprovement(draft, entry))

    // Assert
    expect(next.skills.skillGroups.find((g) => g.name === SkillGroupKey.Firearms)).toEqual({
      name: SkillGroupKey.Firearms,
      rating: 1,
    })
    expect(next.karma.current).toBe(20 - 10)
  })
})
