import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import type {
  AttrIncreaseEntry,
  ComplexFormIncreaseEntry,
  InitiationIncreaseEntry,
  LearnComplexFormEntry,
  LearnKnowledgeSkillEntry,
  LearnLanguageSkillEntry,
  LearnQualityEntry,
  LearnSkillGroupEntry,
  LearnSpellEntry,
  QualityBuyOffEntry,
  SkillGroupIncreaseEntry,
  SkillIncreaseEntry,
  SubmersionIncreaseEntry,
} from "./improvementEntry.ts"
import { ImprovementType } from "./improvementType.ts"
import { getImprovementCost } from "./improvementUtils.ts"

const FAKE_ID = "00000000-0000-0000-0000-000000000000" as UUID

describe("getImprovementCost — SR4A rating-increase multipliers", () => {
  it("attribute increase charges new-rating × 5 per step", () => {
    // Arrange — 3 → 5: (4*5) + (5*5) = 20 + 25 = 45
    const entry: AttrIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.attrIncrease,
      attr: AttributeKey.body,
      baseRating: 3,
      newRating: 5,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(45)
  })

  it("active skill increase charges new-rating × 2 per step", () => {
    // Arrange — 3 → 4: 4*2 = 8
    const entry: SkillIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.skillIncrease,
      skillType: "ActiveSkill",
      skill: SkillKey.pistols,
      baseRating: 3,
      newRating: 4,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(8)
  })

  it("knowledge skill increase charges new-rating × 1 per step (not × 2)", () => {
    // Arrange — 3 → 5: 4 + 5 = 9
    const entry: SkillIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.skillIncrease,
      skillType: "KnowledgeSkill",
      skill: "Ancient History" as SkillKey,
      baseRating: 3,
      newRating: 5,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(9)
  })

  it("language skill increase charges new-rating × 1 per step (not × 2)", () => {
    // Arrange — 2 → 4: 3 + 4 = 7
    const entry: SkillIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.skillIncrease,
      skillType: "LanguageSkill",
      skill: "Sperethiel" as SkillKey,
      baseRating: 2,
      newRating: 4,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(7)
  })

  it("skill group increase charges new-rating × 5 per step (not × 2)", () => {
    // Arrange — 2 → 4: (3*5) + (4*5) = 15 + 20 = 35
    const entry: SkillGroupIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.skillGroupIncrease,
      group: SkillGroupKey.Firearms,
      baseRating: 2,
      newRating: 4,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(35)
  })
})

describe("getImprovementCost — SR4A learn-with-rating", () => {
  it("learning a skill group at rating 3 uses × 5 per raise (10 base + 2*5 + 3*5 = 35)", () => {
    // Arrange
    const entry: LearnSkillGroupEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnSkillGroup,
      group: { name: SkillGroupKey.Firearms, rating: 3 },
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert — 10 (new) + 10 (2*5) + 15 (3*5) = 35
    expect(cost).toBe(35)
  })

  it("learning a knowledge skill at rating 3 uses × 1 per raise (2 base + 2 + 3 = 7)", () => {
    // Arrange
    const entry: LearnKnowledgeSkillEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnKnowledgeSkill,
      skill: { name: "Ancient History", rating: 3 },
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert — 2 (new) + 2 + 3 = 7
    expect(cost).toBe(7)
  })

  it("learning a language skill at rating 3 uses × 1 per raise (2 base + 2 + 3 = 7)", () => {
    // Arrange
    const entry: LearnLanguageSkillEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnLanguageSkill,
      skill: { name: "Sperethiel", rating: 3 },
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert — 2 (new) + 2 + 3 = 7
    expect(cost).toBe(7)
  })
})

describe("getImprovementCost — Aptitude double-cost beyond rating 6", () => {
  it("uses normal cost when raising from 5 to 6 (no double-cost)", () => {
    // Arrange — 5 → 6 with Aptitude: 6*2 = 12 (no double-up below 7)
    const entry: SkillIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.skillIncrease,
      skillType: "ActiveSkill",
      skill: SkillKey.pistols,
      baseRating: 5,
      newRating: 6,
      boostedByAptitude: true,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(12)
  })

  it("doubles the multiplier for steps into rating 7 with Aptitude", () => {
    // Arrange — 6 → 7 with Aptitude: 7 * (2*2) = 28
    const entry: SkillIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.skillIncrease,
      skillType: "ActiveSkill",
      skill: SkillKey.pistols,
      baseRating: 6,
      newRating: 7,
      boostedByAptitude: true,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(28)
  })

  it("blends normal and doubled costs when the raise crosses rating 6", () => {
    // Arrange — 5 → 7 with Aptitude: (6*2) + (7*2*2) = 12 + 28 = 40
    const entry: SkillIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.skillIncrease,
      skillType: "ActiveSkill",
      skill: SkillKey.pistols,
      baseRating: 5,
      newRating: 7,
      boostedByAptitude: true,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(40)
  })

  it("ignores boostedByAptitude on knowledge/language skills (rule applies to Active only)", () => {
    // Arrange — knowledge skill 5 → 6: 6 * 1 = 6, unchanged by Aptitude flag
    const entry: SkillIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.skillIncrease,
      skillType: "KnowledgeSkill",
      skill: "Ancient History" as SkillKey,
      baseRating: 5,
      newRating: 6,
      boostedByAptitude: true,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(6)
  })
})

describe("getImprovementCost — magic and resonance entries", () => {
  it("learning a spell is a flat 5 karma", () => {
    // Arrange
    const entry: LearnSpellEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnSpell,
      spell: { id: "s1", name: "Manabolt" } as LearnSpellEntry["spell"],
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(5)
  })

  it("learning a complex form is a flat 2 karma (not 5)", () => {
    // Arrange
    const entry: LearnComplexFormEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnComplexForm,
      complexForm: { kind: EntityKind.complexForm, id: "cf1", name: "Resonance Spike", rating: 1 },
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(2)
  })

  it("complex form rating increase charges new-rating × 1 per step", () => {
    // Arrange — 2 → 4: 3 + 4 = 7
    const entry: ComplexFormIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.complexFormIncrease,
      complexFormId: "cf1",
      baseRating: 2,
      newRating: 4,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(7)
  })
})

describe("getImprovementCost — qualities", () => {
  it("a new positive quality costs BP value × 2 in karma", () => {
    // Arrange
    const entry: LearnQualityEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnQuality,
      quality: { kind: EntityKind.quality, id: FAKE_ID, name: "Toughness", type: "positive", bpValue: 15 },
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(30)
  })

  it("a new positive quality with no BP value costs 0 (pending GM review)", () => {
    // Arrange
    const entry: LearnQualityEntry = {
      id: FAKE_ID,
      type: ImprovementType.learnQuality,
      quality: { kind: EntityKind.quality, id: FAKE_ID, name: "Home-brewed Quality", type: "positive" },
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(0)
  })

  it("buying off a negative quality costs BP value × 2 in karma", () => {
    // Arrange
    const entry: QualityBuyOffEntry = {
      id: FAKE_ID,
      type: ImprovementType.qualityBuyOff,
      qualityId: FAKE_ID,
      qualityName: "Uneducated",
      bpValue: 20,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(40)
  })
})

describe("getImprovementCost — Initiation and Submersion grades", () => {
  it("raising Initiate Grade costs 10 + (new grade × 3)", () => {
    // Arrange — grade 0 → 1: 10 + 1*3 = 13
    const entry: InitiationIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.initiationIncrease,
      baseGrade: 0,
      newGrade: 1,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(13)
  })

  it("raising Initiate Grade at a higher grade scales with the new grade", () => {
    // Arrange — grade 3 → 4: 10 + 4*3 = 22
    const entry: InitiationIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.initiationIncrease,
      baseGrade: 3,
      newGrade: 4,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(22)
  })

  it("raising Submersion Grade uses the same formula as Initiation", () => {
    // Arrange — grade 0 → 1: 10 + 1*3 = 13
    const entry: SubmersionIncreaseEntry = {
      id: FAKE_ID,
      type: ImprovementType.submersionIncrease,
      baseGrade: 0,
      newGrade: 1,
    }

    // Act
    const cost = getImprovementCost(entry)

    // Assert
    expect(cost).toBe(13)
  })
})
