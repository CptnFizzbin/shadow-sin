import { describe, expect, it } from "vitest"

import type { SpellData } from "#/system/magic/spellData.ts"
import { SpellCategory, SpellDamage, SpellDrainType, SpellDuration, SpellRange, SpellType } from "#/system/magic/spellData.ts"

import { computeDrainValue, formatDrainFormula } from "./spellDrainFormula.ts"

function makeForceSpell(drainValueMod: number): SpellData {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Test Spell",
    type: SpellType.Mana,
    range: SpellRange.LoS,
    damage: SpellDamage.Stun,
    category: SpellCategory.Combat,
    drain: { type: SpellDrainType.Force, value: drainValueMod },
    dealsDamage: false,
    duration: SpellDuration.Instantaneous,
    voluntaryTargetsOnly: false,
  }
}

function makeFixedSpell(drainValue: number): SpellData {
  return {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Test Curative Spell",
    type: SpellType.Mana,
    range: SpellRange.Touch,
    damage: SpellDamage.Stun,
    category: SpellCategory.Health,
    drain: { type: SpellDrainType.Fixed, value: drainValue },
    dealsDamage: false,
    duration: SpellDuration.Permanent,
    voluntaryTargetsOnly: true,
  }
}

describe("formatDrainFormula", () => {
  describe("force-based spells", () => {
    it("returns 'F/2' when the modifier is 0", () => {
      // Arrange
      const spell = makeForceSpell(0)

      // Act
      const result = formatDrainFormula(spell)

      // Assert
      expect(result).toBe("F/2")
    })

    it("returns 'F/2+N' for positive modifiers", () => {
      // Arrange
      const spellMod2 = makeForceSpell(2)
      const spellMod1 = makeForceSpell(1)

      // Act
      const result2 = formatDrainFormula(spellMod2)
      const result1 = formatDrainFormula(spellMod1)

      // Assert
      expect(result2).toBe("F/2+2")
      expect(result1).toBe("F/2+1")
    })

    it("returns 'F/2-N' for negative modifiers (no double sign)", () => {
      // Arrange
      const spellModNeg1 = makeForceSpell(-1)
      const spellModNeg3 = makeForceSpell(-3)

      // Act
      const resultNeg1 = formatDrainFormula(spellModNeg1)
      const resultNeg3 = formatDrainFormula(spellModNeg3)

      // Assert
      expect(resultNeg1).toBe("F/2-1")
      expect(resultNeg3).toBe("F/2-3")
    })
  })

  describe("fixed-base spells", () => {
    it("returns the fixed value as a string", () => {
      // Arrange
      const spell = makeFixedSpell(3)

      // Act
      const result = formatDrainFormula(spell)

      // Assert
      expect(result).toBe("3")
    })

    it("returns the fixed value regardless of its magnitude", () => {
      // Arrange
      const spellFive = makeFixedSpell(5)
      const spellOne = makeFixedSpell(1)

      // Act
      const resultFive = formatDrainFormula(spellFive)
      const resultOne = formatDrainFormula(spellOne)

      // Assert
      expect(resultFive).toBe("5")
      expect(resultOne).toBe("1")
    })
  })
})

describe("computeDrainValue", () => {
  describe("force-based spells", () => {
    it("rounds force/2 down (SR4e p. 163)", () => {
      // Arrange
      const spell = makeForceSpell(0)

      // Act
      const atForce5 = computeDrainValue(5, spell)
      const atForce4 = computeDrainValue(4, spell)
      const atForce1 = computeDrainValue(1, spell)

      // Assert
      expect(atForce5).toBe(2)
      expect(atForce4).toBe(2)
      expect(atForce1).toBe(1)
    })

    it("adds the spell drain modifier", () => {
      // Arrange
      const spell = makeForceSpell(2)

      // Act
      const value = computeDrainValue(6, spell)

      // Assert — floor(6/2) + 2 = 5
      expect(value).toBe(5)
    })

    it("subtracts a negative modifier", () => {
      // Arrange
      const spell = makeForceSpell(-1)

      // Act
      const value = computeDrainValue(4, spell)

      // Assert — floor(4/2) - 1 = 1
      expect(value).toBe(1)
    })

    it("clamps the result to a minimum of 1", () => {
      // Arrange
      const spell = makeForceSpell(-5)

      // Act
      const atForce2 = computeDrainValue(2, spell)
      const atForce1 = computeDrainValue(1, spell)

      // Assert
      expect(atForce2).toBe(1)
      expect(atForce1).toBe(1)
    })
  })

  describe("fixed-base spells", () => {
    it("uses the fixed drain value regardless of force", () => {
      // Arrange
      const spell = makeFixedSpell(4)

      // Act
      const atForce1 = computeDrainValue(1, spell)
      const atForce12 = computeDrainValue(12, spell)

      // Assert
      expect(atForce1).toBe(4)
      expect(atForce12).toBe(4)
    })

    it("clamps the result to a minimum of 1", () => {
      // Arrange
      const spell = makeFixedSpell(1)

      // Act
      const value = computeDrainValue(6, spell)

      // Assert
      expect(value).toBe(1)
    })
  })
})
