import { describe, expect, it } from "vitest"

import type {
  ActiveSkillFormState,
  ActiveSkillGroupFormState,
  KnowledgeSkillFormState,
  LanguageSkillFormState,
} from "#/components/CharacterBuilder/Skills/SkillFormState.ts"
import {
  ActiveSkillBpPerRating,
  ActiveSkillGroupBpPerRating,
  ActiveSkillSpecializationBp,
  ExtraSkillPointBpCost,
  KnowledgeSkillSpPerRating,
  KnowledgeSpecializationSp,
  LanguageSkillSpPerRating,
  LanguageSpecializationSp,
  SkillGroupRatingMax,
  SkillRatingMax,
  calculateActiveSkillsBp,
  calculateExtraSpBp,
  calculateKnowledgeAndLanguageSpUsed,
  getActiveSkillBp,
  getActiveSkillGroupBp,
  getActiveSkillRatingWarnings,
  getActiveSkillSelectionWarnings,
  getFreeSkillPoints,
  getKnowledgeSkillRatingWarnings,
  getKnowledgeSkillSp,
  getLanguageSelectionWarnings,
  getLanguageSkillSp,
  getMaxSkillPoints,
} from "#/components/CharacterBuilder/Skills/SkillRequirements.ts"
import { SkillGroupKey } from "#/lib/system/types/SkillGroupKey.ts"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeActiveSkill = (
  overrides: Partial<ActiveSkillFormState> & { name: string },
): ActiveSkillFormState => ({
  id: overrides.name,
  rating: 3,
  ...overrides,
})

const makeActiveSkillGroup = (
  overrides: Partial<ActiveSkillGroupFormState> & { groupName: SkillGroupKey },
): ActiveSkillGroupFormState => ({
  id: overrides.groupName,
  rating: 3,
  ...overrides,
})

const makeKnowledgeSkill = (
  overrides: Partial<KnowledgeSkillFormState> & { name: string },
): KnowledgeSkillFormState => ({
  id: overrides.name,
  rating: 2,
  ...overrides,
})

const makeLanguageSkill = (
  overrides: Partial<LanguageSkillFormState> & { name: string },
): LanguageSkillFormState => ({
  id: overrides.name,
  isNative: false,
  rating: 2,
  ...overrides,
})

// ─── Constants ───────────────────────────────────────────────────────────────

describe("exported constants", () => {
  it("has the expected base values", () => {
    expect(ActiveSkillBpPerRating).toBe(4)
    expect(ActiveSkillGroupBpPerRating).toBe(10)
    expect(ActiveSkillSpecializationBp).toBe(2)
    expect(KnowledgeSkillSpPerRating).toBe(1)
    expect(KnowledgeSpecializationSp).toBe(1)
    expect(LanguageSkillSpPerRating).toBe(1)
    expect(LanguageSpecializationSp).toBe(1)
    expect(ExtraSkillPointBpCost).toBe(2)
    expect(SkillRatingMax).toBe(6)
    expect(SkillGroupRatingMax).toBe(4)
  })
})

// ─── getFreeSkillPoints / getMaxSkillPoints ────────────────────────────────

describe("getFreeSkillPoints", () => {
  it("returns (logic + intuition) × 3", () => {
    expect(getFreeSkillPoints(4, 4)).toBe(24)
    expect(getFreeSkillPoints(3, 5)).toBe(24)
    expect(getFreeSkillPoints(1, 1)).toBe(6)
  })
})

describe("getMaxSkillPoints", () => {
  it("returns (logic + intuition) × 6", () => {
    expect(getMaxSkillPoints(4, 4)).toBe(48)
    expect(getMaxSkillPoints(3, 5)).toBe(48)
    expect(getMaxSkillPoints(2, 3)).toBe(30)
  })
})

// ─── getActiveSkillBp ─────────────────────────────────────────────────────

describe("getActiveSkillBp", () => {
  it("returns rating × 4 with no specialization", () => {
    expect(getActiveSkillBp(3, false)).toBe(12)
    expect(getActiveSkillBp(6, false)).toBe(24)
    expect(getActiveSkillBp(1, false)).toBe(4)
  })

  it("adds the specialization cost of 2 BP when specialized", () => {
    expect(getActiveSkillBp(3, true)).toBe(14)
    expect(getActiveSkillBp(1, true)).toBe(6)
  })
})

// ─── getActiveSkillGroupBp ────────────────────────────────────────────────

describe("getActiveSkillGroupBp", () => {
  it("returns rating × 10", () => {
    expect(getActiveSkillGroupBp(2)).toBe(20)
    expect(getActiveSkillGroupBp(4)).toBe(40)
  })
})

// ─── getKnowledgeSkillSp ──────────────────────────────────────────────────

describe("getKnowledgeSkillSp", () => {
  it("returns rating × 1 with no specialization", () => {
    expect(getKnowledgeSkillSp(3, false)).toBe(3)
  })

  it("adds 1 SP for specialization", () => {
    expect(getKnowledgeSkillSp(3, true)).toBe(4)
  })
})

// ─── getLanguageSkillSp ───────────────────────────────────────────────────

describe("getLanguageSkillSp", () => {
  it("returns 0 for a native language without a specialization", () => {
    expect(getLanguageSkillSp(true, 5, false)).toBe(0)
  })

  it("returns 1 for a native language with a specialization", () => {
    expect(getLanguageSkillSp(true, 5, true)).toBe(1)
  })

  it("returns rating × 1 for a non-native language without specialization", () => {
    expect(getLanguageSkillSp(false, 3, false)).toBe(3)
  })

  it("adds 1 SP for a non-native language with specialization", () => {
    expect(getLanguageSkillSp(false, 3, true)).toBe(4)
  })
})

// ─── calculateActiveSkillsBp ──────────────────────────────────────────────

describe("calculateActiveSkillsBp", () => {
  it("returns 0 when there are no skills or groups", () => {
    expect(calculateActiveSkillsBp([], [])).toBe(0)
  })

  it("sums BP costs across multiple skills", () => {
    const skills = [
      makeActiveSkill({ name: "Pistols", rating: 4 }),
      makeActiveSkill({ name: "Stealth", rating: 3, specialization: "Crowds" }),
    ]
    // 4×4 + (3×4 + 2) = 16 + 14 = 30
    expect(calculateActiveSkillsBp(skills, [])).toBe(30)
  })

  it("sums BP costs across skill groups", () => {
    const groups = [makeActiveSkillGroup({ groupName: SkillGroupKey.Firearms, rating: 3 })]
    // 3×10 = 30
    expect(calculateActiveSkillsBp([], groups)).toBe(30)
  })

  it("combines skills and group BP costs", () => {
    const skills = [makeActiveSkill({ name: "Pistols", rating: 2 })]
    const groups = [makeActiveSkillGroup({ groupName: SkillGroupKey.Athletics, rating: 1 })]
    // 2×4 + 1×10 = 18
    expect(calculateActiveSkillsBp(skills, groups)).toBe(18)
  })
})

// ─── calculateKnowledgeAndLanguageSpUsed ──────────────────────────────────

describe("calculateKnowledgeAndLanguageSpUsed", () => {
  it("returns 0 with no skills", () => {
    expect(calculateKnowledgeAndLanguageSpUsed([], [])).toBe(0)
  })

  it("totals SP for knowledge skills only", () => {
    const knowledgeSkills = [
      makeKnowledgeSkill({ name: "History", rating: 3 }),
      makeKnowledgeSkill({ name: "Street Gang Lore", rating: 2, specialization: "Triads" }),
    ]
    // 3 + (2 + 1) = 6
    expect(calculateKnowledgeAndLanguageSpUsed(knowledgeSkills, [])).toBe(6)
  })

  it("totals SP for language skills only", () => {
    const languageSkills = [
      makeLanguageSkill({ name: "English", isNative: true }),
      makeLanguageSkill({ name: "Japanese", rating: 4 }),
    ]
    // native = 0, Japanese = 4
    expect(calculateKnowledgeAndLanguageSpUsed([], languageSkills)).toBe(4)
  })

  it("combines knowledge and language SP", () => {
    const knowledgeSkills = [makeKnowledgeSkill({ name: "History", rating: 2 })]
    const languageSkills = [makeLanguageSkill({ name: "Spanish", rating: 3 })]
    // 2 + 3 = 5
    expect(calculateKnowledgeAndLanguageSpUsed(knowledgeSkills, languageSkills)).toBe(5)
  })
})

// ─── calculateExtraSpBp ───────────────────────────────────────────────────

describe("calculateExtraSpBp", () => {
  it("returns 0 when used SP is within the free allowance", () => {
    expect(calculateExtraSpBp(10, 24)).toBe(0)
    expect(calculateExtraSpBp(24, 24)).toBe(0)
  })

  it("charges 2 BP per extra SP above the free allowance", () => {
    // 26 used − 24 free = 2 extra SP × 2 BP = 4 BP
    expect(calculateExtraSpBp(26, 24)).toBe(4)
    // 30 − 24 = 6 extra × 2 = 12
    expect(calculateExtraSpBp(30, 24)).toBe(12)
  })

  it("returns 0 when free SP exceeds used SP", () => {
    expect(calculateExtraSpBp(0, 24)).toBe(0)
  })
})

// ─── getActiveSkillRatingWarnings ─────────────────────────────────────────

describe("getActiveSkillRatingWarnings", () => {
  it("returns no warnings when skill ratings are all within limits", () => {
    const skills = [
      makeActiveSkill({ name: "Pistols", rating: 4 }),
      makeActiveSkill({ name: "Stealth", rating: 4 }),
    ]
    expect(getActiveSkillRatingWarnings(skills)).toHaveLength(0)
  })

  it("returns no warnings for exactly one Rating-6 skill", () => {
    const skills = [
      makeActiveSkill({ name: "Pistols", rating: 6 }),
      makeActiveSkill({ name: "Stealth", rating: 4 }),
    ]
    expect(getActiveSkillRatingWarnings(skills)).toHaveLength(0)
  })

  it("returns a warning when two Rating-6 skills are present", () => {
    const skills = [
      makeActiveSkill({ name: "Pistols", rating: 6 }),
      makeActiveSkill({ name: "Stealth", rating: 6 }),
    ]
    expect(getActiveSkillRatingWarnings(skills)).toHaveLength(1)
  })

  it("returns a warning for three Rating-5 skills", () => {
    const skills = [
      makeActiveSkill({ name: "A", rating: 5 }),
      makeActiveSkill({ name: "B", rating: 5 }),
      makeActiveSkill({ name: "C", rating: 5 }),
    ]
    expect(getActiveSkillRatingWarnings(skills)).toHaveLength(1)
  })

  it("returns a warning when a Rating-6 and a Rating-5 skill coexist", () => {
    const skills = [
      makeActiveSkill({ name: "A", rating: 6 }),
      makeActiveSkill({ name: "B", rating: 5 }),
    ]
    expect(getActiveSkillRatingWarnings(skills)).toHaveLength(1)
  })

  it("returns no warnings for exactly two Rating-5 skills", () => {
    const skills = [
      makeActiveSkill({ name: "A", rating: 5 }),
      makeActiveSkill({ name: "B", rating: 5 }),
    ]
    expect(getActiveSkillRatingWarnings(skills)).toHaveLength(0)
  })
})

// ─── getActiveSkillSelectionWarnings ──────────────────────────────────────

describe("getActiveSkillSelectionWarnings", () => {
  it("returns no warnings when there are no active skills", () => {
    const groups = [makeActiveSkillGroup({ groupName: SkillGroupKey.Firearms, rating: 3 })]
    expect(getActiveSkillSelectionWarnings([], groups)).toHaveLength(0)
  })

  it("returns no warnings when there are no skill groups", () => {
    const skills = [makeActiveSkill({ name: "Pistols", rating: 3 })]
    expect(getActiveSkillSelectionWarnings(skills, [])).toHaveLength(0)
  })

  it("returns a warning when a skill is also covered by a group", () => {
    // "Automatics" is part of the Firearms group
    const skills = [makeActiveSkill({ name: "Automatics", rating: 3 })]
    const groups = [makeActiveSkillGroup({ groupName: SkillGroupKey.Firearms, rating: 3 })]

    const warnings = getActiveSkillSelectionWarnings(skills, groups)
    expect(warnings.length).toBeGreaterThan(0)
    expect(warnings[0]).toContain("Automatics")
  })

  it("returns no warnings when the skill is not part of any selected group", () => {
    // "Pilot Aircraft" is not in the Firearms group
    const skills = [makeActiveSkill({ name: "Pilot Aircraft", rating: 3 })]
    const groups = [makeActiveSkillGroup({ groupName: SkillGroupKey.Firearms, rating: 3 })]

    expect(getActiveSkillSelectionWarnings(skills, groups)).toHaveLength(0)
  })
})

// ─── getKnowledgeSkillRatingWarnings ──────────────────────────────────────

describe("getKnowledgeSkillRatingWarnings", () => {
  it("returns no warnings when all ratings are within limits", () => {
    const knowledgeSkills = [
      makeKnowledgeSkill({ name: "History", rating: 4 }),
      makeKnowledgeSkill({ name: "Law", rating: 4 }),
    ]
    expect(getKnowledgeSkillRatingWarnings(knowledgeSkills, [])).toHaveLength(0)
  })

  it("returns a warning for more than one Rating-6 skill", () => {
    const knowledgeSkills = [
      makeKnowledgeSkill({ name: "A", rating: 6 }),
      makeKnowledgeSkill({ name: "B", rating: 6 }),
    ]
    expect(getKnowledgeSkillRatingWarnings(knowledgeSkills, [])).toHaveLength(1)
  })

  it("returns a warning when a Rating-6 and a Rating-5 coexist", () => {
    const knowledgeSkills = [
      makeKnowledgeSkill({ name: "A", rating: 6 }),
      makeKnowledgeSkill({ name: "B", rating: 5 }),
    ]
    expect(getKnowledgeSkillRatingWarnings(knowledgeSkills, [])).toHaveLength(1)
  })

  it("returns a warning when more than 2 Rating-5 skills exist (no R6)", () => {
    const knowledgeSkills = [
      makeKnowledgeSkill({ name: "A", rating: 5 }),
      makeKnowledgeSkill({ name: "B", rating: 5 }),
      makeKnowledgeSkill({ name: "C", rating: 5 }),
    ]
    expect(getKnowledgeSkillRatingWarnings(knowledgeSkills, [])).toHaveLength(1)
  })

  it("returns no warnings for exactly two Rating-5 skills (no R6)", () => {
    const knowledgeSkills = [
      makeKnowledgeSkill({ name: "A", rating: 5 }),
      makeKnowledgeSkill({ name: "B", rating: 5 }),
    ]
    expect(getKnowledgeSkillRatingWarnings(knowledgeSkills, [])).toHaveLength(0)
  })
})

// ─── getLanguageSelectionWarnings ─────────────────────────────────────────

describe("getLanguageSelectionWarnings", () => {
  it("returns no warnings when there is exactly one native language", () => {
    const languageSkills = [
      makeLanguageSkill({ name: "English", isNative: true }),
      makeLanguageSkill({ name: "Japanese", isNative: false }),
    ]
    expect(getLanguageSelectionWarnings(languageSkills)).toHaveLength(0)
  })

  it("returns a warning when more than one native language is selected", () => {
    const languageSkills = [
      makeLanguageSkill({ name: "English", isNative: true }),
      makeLanguageSkill({ name: "Spanish", isNative: true }),
    ]
    const warnings = getLanguageSelectionWarnings(languageSkills)
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain("2 native languages")
  })

  it("returns no warnings when no language is native", () => {
    const languageSkills = [
      makeLanguageSkill({ name: "German", isNative: false }),
    ]
    expect(getLanguageSelectionWarnings(languageSkills)).toHaveLength(0)
  })
})
