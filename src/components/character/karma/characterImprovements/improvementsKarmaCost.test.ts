import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import { SpellCategory, SpellDamage, SpellDrainType, SpellDuration, SpellRange, SpellType } from "#/system/magic/spellData.ts"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import {
  calcActiveSkillKarmaCost,
  calcAttributeKarmaCost,
  calcImprovementsKarmaCost,
  calcSkillGroupKarmaCost,
  NEW_SKILL_KARMA_COST,
  NEW_SPELL_KARMA_COST,
  SKILL_SPECIALIZATION_KARMA_COST,
} from "./improvementsKarmaCost.ts"
import { createImprovementsState } from "./improvementsState.ts"

describe("karma cost constants", () => {
  it("NEW_SKILL_KARMA_COST is 2", () => {
    expect(NEW_SKILL_KARMA_COST).toBe(2)
  })

  it("NEW_SPELL_KARMA_COST is 5", () => {
    expect(NEW_SPELL_KARMA_COST).toBe(5)
  })

  it("SKILL_SPECIALIZATION_KARMA_COST is 2", () => {
    expect(SKILL_SPECIALIZATION_KARMA_COST).toBe(2)
  })
})

describe("calcAttributeKarmaCost", () => {
  it("returns 5 × new rating", () => {
    // Arrange / Act / Assert
    expect(calcAttributeKarmaCost(1)).toBe(5)
    expect(calcAttributeKarmaCost(4)).toBe(20)
    expect(calcAttributeKarmaCost(6)).toBe(30)
  })
})

describe("calcActiveSkillKarmaCost", () => {
  it("returns 2 × new rating", () => {
    // Arrange / Act / Assert
    expect(calcActiveSkillKarmaCost(1)).toBe(2)
    expect(calcActiveSkillKarmaCost(4)).toBe(8)
    expect(calcActiveSkillKarmaCost(6)).toBe(12)
  })
})

describe("calcSkillGroupKarmaCost", () => {
  it("returns 2 × new rating", () => {
    // Arrange / Act / Assert
    expect(calcSkillGroupKarmaCost(1)).toBe(2)
    expect(calcSkillGroupKarmaCost(3)).toBe(6)
  })
})

describe("calcImprovementsKarmaCost", () => {
  it("returns 0 for an empty state", () => {
    // Arrange
    const state = createImprovementsState()

    // Act / Assert
    expect(calcImprovementsKarmaCost(state)).toBe(0)
  })

  it("calculates cost for an attribute improvement", () => {
    // Arrange
    const state = createImprovementsState()
    state.attrImprovement[AttributeKey.body] = { newRating: 4 }

    // Act
    const cost = calcImprovementsKarmaCost(state)

    // Assert
    expect(cost).toBe(20)
  })

  it("calculates cost for an active skill rating improvement", () => {
    // Arrange
    const state = createImprovementsState()
    state.activeSkillImprovement[SkillKey.pistols] = { newRating: 3 }

    // Act
    const cost = calcImprovementsKarmaCost(state)

    // Assert
    expect(cost).toBe(6)
  })

  it("returns specialization cost for an active skill with only a specialization", () => {
    // Arrange
    const state = createImprovementsState()
    state.activeSkillImprovement[SkillKey.pistols] = { newSpecialization: "Pistols" }

    // Act
    const cost = calcImprovementsKarmaCost(state)

    // Assert
    expect(cost).toBe(SKILL_SPECIALIZATION_KARMA_COST)
  })

  it("calculates cost for a skill group improvement", () => {
    // Arrange
    const state = createImprovementsState()
    state.skillGroupImprovement[SkillGroupKey.Athletics] = { newRating: 2 }

    // Act
    const cost = calcImprovementsKarmaCost(state)

    // Assert
    expect(cost).toBe(4)
  })

  it("calculates cost for a learn spell improvement", () => {
    // Arrange
    const state = createImprovementsState()
    state.learnSpell["00000000-0000-0000-0000-000000000001"] = {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Fireball",
      category: SpellCategory.Combat,
      type: SpellType.Physical,
      range: SpellRange.LoS,
      damage: SpellDamage.Physical,
      duration: SpellDuration.Instantaneous,
      drain: { type: SpellDrainType.Force, value: 2 },
      dealsDamage: true,
      voluntaryTargetsOnly: false,
    }

    // Act
    const cost = calcImprovementsKarmaCost(state)

    // Assert
    expect(cost).toBe(NEW_SPELL_KARMA_COST)
  })

  it("calculates cost for a knowledge skill rating improvement", () => {
    // Arrange
    const state = createImprovementsState()
    state.knowledgeImprovement["History"] = { newRating: 2 }

    // Act
    const cost = calcImprovementsKarmaCost(state)

    // Assert
    expect(cost).toBe(4)
  })

  it("returns specialization cost for a knowledge skill with only a specialization", () => {
    // Arrange
    const state = createImprovementsState()
    state.knowledgeImprovement["History"] = { newSpecialization: "Ancient Rome" }

    // Act
    const cost = calcImprovementsKarmaCost(state)

    // Assert
    expect(cost).toBe(SKILL_SPECIALIZATION_KARMA_COST)
  })

  it("calculates cost for a language skill rating improvement", () => {
    // Arrange
    const state = createImprovementsState()
    state.languageImprovement["Spanish"] = { newRating: 3 }

    // Act
    const cost = calcImprovementsKarmaCost(state)

    // Assert
    expect(cost).toBe(6)
  })

  it("sums costs across multiple improvements", () => {
    // Arrange
    const state = createImprovementsState()
    state.attrImprovement[AttributeKey.body] = { newRating: 3 }
    state.activeSkillImprovement[SkillKey.pistols] = { newRating: 4 }
    state.skillGroupImprovement[SkillGroupKey.Athletics] = { newRating: 2 }

    // Act
    const totalCost = calcImprovementsKarmaCost(state)

    // Assert
    // Attribute body 3: 5*3=15, Pistols 4: 2*4=8, Athletics group 2: 2*2=4 → 27
    expect(totalCost).toBe(27)
  })

  it("counts a learn spell at NEW_SPELL_KARMA_COST", () => {
    // Arrange
    const state = createImprovementsState()
    state.learnSpell["00000000-0000-0000-0000-000000000002"] = {
      id: "00000000-0000-0000-0000-000000000002",
      name: "Lightning Bolt",
      category: SpellCategory.Combat,
      type: SpellType.Physical,
      range: SpellRange.LoS,
      damage: SpellDamage.Physical,
      duration: SpellDuration.Instantaneous,
      drain: { type: SpellDrainType.Force, value: 2 },
      dealsDamage: true,
      voluntaryTargetsOnly: false,
    }

    // Act
    const totalCost = calcImprovementsKarmaCost(state)

    // Assert
    expect(totalCost).toBe(NEW_SPELL_KARMA_COST)
  })
})
