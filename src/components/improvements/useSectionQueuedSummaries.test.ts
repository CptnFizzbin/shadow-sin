import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import type {
  ImprovementEntry,
  SkillIncreaseEntry,
  SkillSpecializationEntry,
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

  it("maps skill specializations to the specialization section regardless of skill type", () => {
    // Arrange
    function makeSpec(skillType: SkillSpecializationEntry["skillType"]): SkillSpecializationEntry {
      return {
        id: FAKE_ID,
        type: ImprovementType.skillSpecialization,
        skillType,
        skill: SkillKey.pistols,
        specialization: "Revolvers",
      }
    }

    // Act
    const activeSection = sectionForEntry(makeSpec("ActiveSkill"))
    const knowledgeSection = sectionForEntry(makeSpec("KnowledgeSkill"))
    const languageSection = sectionForEntry(makeSpec("LanguageSkill"))

    // Assert
    expect(activeSection).toBe("specialization")
    expect(knowledgeSection).toBe("specialization")
    expect(languageSection).toBe("specialization")
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

  it("maps complex form entries to the complex form section", () => {
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
    expect(section).toBe("complexForm")
  })

  it("maps quality entries to the quality section", () => {
    // Arrange
    const learnEntry: ImprovementEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnQuality,
      quality: { id: FAKE_ID, name: "Toughness", type: "positive", bpValue: 15 },
    }
    const buyOffEntry: ImprovementEntry = {
      id: FAKE_ID,
      type: ImprovementType.qualityBuyOff,
      qualityId: FAKE_ID,
      qualityName: "Uneducated",
      bpValue: 20,
    }

    // Act
    const learnSection = sectionForEntry(learnEntry)
    const buyOffSection = sectionForEntry(buyOffEntry)

    // Assert
    expect(learnSection).toBe("quality")
    expect(buyOffSection).toBe("quality")
  })

  it("maps Initiation and Submersion entries to their own sections", () => {
    // Arrange
    const initiationEntry: ImprovementEntry = {
      id: FAKE_ID,
      type: ImprovementType.initiationIncrease,
      baseGrade: 0,
      newGrade: 1,
    }
    const submersionEntry: ImprovementEntry = {
      id: FAKE_ID,
      type: ImprovementType.submersionIncrease,
      baseGrade: 0,
      newGrade: 1,
    }

    // Act
    const initiationSection = sectionForEntry(initiationEntry)
    const submersionSection = sectionForEntry(submersionEntry)

    // Assert
    expect(initiationSection).toBe("initiation")
    expect(submersionSection).toBe("submersion")
  })
})
