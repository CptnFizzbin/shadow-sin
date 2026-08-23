import { produce } from "immer"
import { describe, expect, it } from "vitest"

import type { UUID } from "#/lib/uuidUtils.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import type {
  SkillIncreaseEntry,
  SkillSpecializationEntry,
} from "./improvementEntry.ts"
import { ImprovementType } from "./improvementType.ts"
import { applyImprovement } from "./improvementUtils.ts"

const FAKE_ID = "00000000-0000-0000-0000-000000000000" as UUID

describe.concurrent("applyImprovement — grouped active skill without the group on sheet", () => {
  it("raises a standalone active skill that belongs to a group, without erroring", () => {
    // Arrange — runner has Banishing (a Conjuring-group skill) standalone, no Conjuring group
    const entry: SkillIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.skillIncrease,
      skillType: "ActiveSkill",
      skill: SkillKey.banishing,
      baseRating: 3,
      newRating: 4,
    }
    const sheet = runnerDataFactory((draft) => {
      draft.skills.activeSkills = [{ name: SkillKey.banishing, rating: 3 }]
      draft.skills.skillGroups = []
      draft.karma.current = 50
      return draft
    })

    // Act
    const next = produce(sheet, (draft) => applyImprovement(draft, entry))

    // Assert
    expect(next.skills.activeSkills.find((s) => s.name === SkillKey.banishing)?.rating).toBe(4)
    expect(next.karma.current).toBe(50 - 8) // 4 * 2 = 8 karma
  })

  it("specializes a standalone grouped active skill without erroring", () => {
    // Arrange
    const entry: SkillSpecializationEntry = {
      id: FAKE_ID,
      type: ImprovementType.skillSpecialization,
      skillType: "ActiveSkill",
      skill: SkillKey.banishing,
      specialization: "Spirits of Fire",
    }
    const sheet = runnerDataFactory((draft) => {
      draft.skills.activeSkills = [{ name: SkillKey.banishing, rating: 3 }]
      draft.skills.skillGroups = []
      draft.karma.current = 50
      return draft
    })

    // Act
    const next = produce(sheet, (draft) => applyImprovement(draft, entry))

    // Assert
    expect(
      next.skills.activeSkills.find((s) => s.name === SkillKey.banishing)?.specialization,
    ).toBe("Spirits of Fire")
  })

  it("still breaks the group when the group IS on the sheet", () => {
    // Arrange — runner has the Conjuring group, raises Banishing individually
    const entry: SkillIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.skillIncrease,
      skillType: "ActiveSkill",
      skill: SkillKey.banishing,
      baseRating: 3,
      newRating: 4,
    }
    const sheet = runnerDataFactory((draft) => {
      draft.skills.activeSkills = []
      draft.skills.skillGroups = [{ name: SkillGroupKey.Conjuring, rating: 3 }]
      draft.karma.current = 50
      return draft
    })

    // Act
    const next = produce(sheet, (draft) => applyImprovement(draft, entry))

    // Assert — group is gone, constituent skills promoted, Banishing at new rating 4
    expect(next.skills.skillGroups.find((g) => g.name === SkillGroupKey.Conjuring)).toBeUndefined()
    expect(next.skills.activeSkills.find((s) => s.name === SkillKey.banishing)?.rating).toBe(4)
  })
})
