import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import type {
  ImprovementEntry,
  SkillIncreaseEntry,
} from "#/system/karma/improvements/improvementEntry.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { sectionForEntry } from "./useSectionQueuedSummaries.ts"

const FAKE_ID = "00000000-0000-0000-0000-000000000000" as UUID

function makeSkillIncrease(skillType: SkillIncreaseEntry["skillType"]): SkillIncreaseEntry {
  return {
    id: FAKE_ID,
    type: ImprovementType.skillIncrease,
    skillType,
    skill: SkillKey.pistols,
    baseRating: 2,
    newRating: 3,
  }
}

describe("sectionForEntry", () => {
  it("maps attribute increases to the attribute section", () => {
    // Arrange
    const entry: ImprovementEntry = {
      id: FAKE_ID,
      type: ImprovementType.attrIncrease,
      attr: AttributeKey.body,
      baseRating: 2,
      newRating: 3,
    }

    // Act
    const section = sectionForEntry(entry)

    // Assert
    expect(section).toBe("attribute")
  })

  it("maps skill increases to a section by skill type", () => {
    // Arrange
    const activeEntry = makeSkillIncrease("ActiveSkill")
    const knowledgeEntry = makeSkillIncrease("KnowledgeSkill")
    const languageEntry = makeSkillIncrease("LanguageSkill")

    // Act
    const activeSection = sectionForEntry(activeEntry)
    const knowledgeSection = sectionForEntry(knowledgeEntry)
    const languageSection = sectionForEntry(languageEntry)

    // Assert
    expect(activeSection).toBe("skill")
    expect(knowledgeSection).toBe("knowledge")
    expect(languageSection).toBe("language")
  })

  it("maps group increases to the skill group section", () => {
    // Arrange
    const entry: ImprovementEntry = {
      id: FAKE_ID,
      type: ImprovementType.skillGroupIncrease,
      group: SkillGroupKey.Firearms,
      baseRating: 1,
      newRating: 2,
    }

    // Act
    const section = sectionForEntry(entry)

    // Assert
    expect(section).toBe("skillGroup")
  })

  it("maps complex form entries to the spell section", () => {
    // Arrange
    const entry: ImprovementEntry = {
      id: FAKE_ID,
      type: ImprovementType.complexFormIncrease,
      complexFormId: "cf-1",
      baseRating: 1,
      newRating: 2,
    }

    // Act
    const section = sectionForEntry(entry)

    // Assert
    expect(section).toBe("spell")
  })
})
