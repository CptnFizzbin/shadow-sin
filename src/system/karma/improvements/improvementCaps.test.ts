import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { MetatypeType } from "#/system/metatypeData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import {
  APTITUDE_ACTIVE_SKILL_CAP,
  BASE_ACTIVE_SKILL_CAP,
  BASE_KNOWLEDGE_SKILL_CAP,
  BASE_LANGUAGE_SKILL_CAP,
  BASE_SKILL_GROUP_CAP,
  getActiveSkillCap,
  getAttributeCap,
  getKnowledgeSkillCap,
  getLanguageSkillCap,
  getSkillGroupCap,
  hasAptitudeFor,
  hasExceptionalAttributeFor,
} from "./improvementCaps.ts"

describe("hasAptitudeFor", () => {
  it("returns true for a parenthesized quality name matching the skill (case-insensitive)", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.qualities = [{ kind: EntityKind.quality, id: NullUuid, name: "Aptitude (Pistols)", type: "positive" }]
      return draft
    })

    // Act + Assert
    expect(hasAptitudeFor(sheet, SkillKey.pistols)).toBe(true)
  })

  it("returns false when the quality targets a different skill", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.qualities = [{ kind: EntityKind.quality, id: NullUuid, name: "Aptitude (Longarms)", type: "positive" }]
      return draft
    })

    // Act + Assert
    expect(hasAptitudeFor(sheet, SkillKey.pistols)).toBe(false)
  })

  it("returns false when no Aptitude quality is present", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act + Assert
    expect(hasAptitudeFor(sheet, SkillKey.pistols)).toBe(false)
  })
})

describe("hasExceptionalAttributeFor", () => {
  it("matches the attribute key", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.qualities = [
        { kind: EntityKind.quality, id: NullUuid, name: "Exceptional Attribute (Logic)", type: "positive" },
      ]
      return draft
    })

    // Act + Assert
    expect(hasExceptionalAttributeFor(sheet, AttributeKey.logic)).toBe(true)
  })

  it("matches the attribute abbreviation", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.qualities = [{ kind: EntityKind.quality, id: NullUuid, name: "Exceptional (LOG)", type: "positive" }]
      return draft
    })

    // Act + Assert
    expect(hasExceptionalAttributeFor(sheet, AttributeKey.logic)).toBe(true)
  })

  it("returns false for a different attribute", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.qualities = [
        { kind: EntityKind.quality, id: NullUuid, name: "Exceptional Attribute (Body)", type: "positive" },
      ]
      return draft
    })

    // Act + Assert
    expect(hasExceptionalAttributeFor(sheet, AttributeKey.logic)).toBe(false)
  })
})

describe("getActiveSkillCap", () => {
  it("returns the base cap (6) without Aptitude", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act + Assert
    expect(getActiveSkillCap(sheet, SkillKey.pistols)).toBe(BASE_ACTIVE_SKILL_CAP)
  })

  it("returns the Aptitude cap (7) when the runner has Aptitude for the skill", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.qualities = [{ kind: EntityKind.quality, id: NullUuid, name: "Aptitude (Pistols)", type: "positive" }]
      return draft
    })

    // Act + Assert
    expect(getActiveSkillCap(sheet, SkillKey.pistols)).toBe(APTITUDE_ACTIVE_SKILL_CAP)
  })
})

describe("getSkillGroupCap / getKnowledgeSkillCap / getLanguageSkillCap", () => {
  it("returns the SR4A defaults", () => {
    expect(getSkillGroupCap()).toBe(BASE_SKILL_GROUP_CAP)
    expect(getKnowledgeSkillCap()).toBe(BASE_KNOWLEDGE_SKILL_CAP)
    expect(getLanguageSkillCap()).toBe(BASE_LANGUAGE_SKILL_CAP)
  })
})

describe("getAttributeCap", () => {
  it("returns the metatype max for a regular attribute (Human Body = 6)", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.biology.metatype = MetatypeType.Human
      return draft
    })

    // Act + Assert
    expect(getAttributeCap(sheet, AttributeKey.body)).toBe(6)
  })

  it("adds +1 when Exceptional Attribute targets the attribute", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.biology.metatype = MetatypeType.Human
      draft.qualities = [{ kind: EntityKind.quality, id: NullUuid, name: "Exceptional Attribute (Body)", type: "positive" }]
      return draft
    })

    // Act + Assert
    expect(getAttributeCap(sheet, AttributeKey.body)).toBe(7)
  })

  it("uses the awakening max for Magic on a magician", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.biology.awakening = AwakeningType.Magician
      return draft
    })

    // Act + Assert
    expect(getAttributeCap(sheet, AttributeKey.magic)).toBeGreaterThan(0)
  })

  it("returns 0 for Magic on a mundane (it isn't a usable cap)", () => {
    // Arrange
    const sheet = runnerDataFactory((draft) => {
      draft.biology.awakening = AwakeningType.Mundane
      return draft
    })

    // Act + Assert
    expect(getAttributeCap(sheet, AttributeKey.magic)).toBe(0)
  })
})
