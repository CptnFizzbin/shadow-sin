import { describe, expect, it } from "vitest"

import type { SpellData } from "#/system/magic/spellData.ts"
import { SpellCategory, SpellDamage, SpellDuration, SpellRange, SpellType } from "#/system/magic/spellData.ts"

import { computeDrainValue, formatDrainFormula } from "./spellDrainFormula.ts"

function makeSpellWithDrainMod(drainValueMod: number): SpellData {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Test Spell",
    type: SpellType.Mana,
    range: SpellRange.LoS,
    damage: SpellDamage.Stun,
    category: SpellCategory.Combat,
    drainValueMod,
    dealsDamage: false,
    duration: SpellDuration.Instantaneous,
    voluntaryTargetsOnly: false,
  }
}

describe("formatDrainFormula", () => {
  it("returns 'F/2' when the modifier is 0", () => {
    // Arrange / Act / Assert
    expect(formatDrainFormula(0)).toBe("F/2")
  })

  it("returns 'F/2+N' for positive modifiers", () => {
    // Arrange / Act / Assert
    expect(formatDrainFormula(2)).toBe("F/2+2")
    expect(formatDrainFormula(1)).toBe("F/2+1")
  })

  it("returns 'F/2-N' for negative modifiers (no double sign)", () => {
    // Arrange / Act / Assert
    expect(formatDrainFormula(-1)).toBe("F/2-1")
    expect(formatDrainFormula(-3)).toBe("F/2-3")
  })
})

describe("computeDrainValue", () => {
  it("rounds force/2 up", () => {
    // Arrange
    const spell = makeSpellWithDrainMod(0)

    // Act / Assert — odd force halves and rounds up
    expect(computeDrainValue(5, spell)).toBe(3)
    expect(computeDrainValue(4, spell)).toBe(2)
    expect(computeDrainValue(1, spell)).toBe(1)
  })

  it("adds the spell drain modifier", () => {
    // Arrange
    const spell = makeSpellWithDrainMod(2)

    // Act / Assert — ceil(6/2) + 2 = 5
    expect(computeDrainValue(6, spell)).toBe(5)
  })

  it("subtracts a negative modifier", () => {
    // Arrange
    const spell = makeSpellWithDrainMod(-1)

    // Act / Assert — ceil(4/2) - 1 = 1
    expect(computeDrainValue(4, spell)).toBe(1)
  })

  it("clamps the result to a minimum of 1", () => {
    // Arrange — large negative modifier would otherwise produce <1
    const spell = makeSpellWithDrainMod(-5)

    // Act / Assert
    expect(computeDrainValue(2, spell)).toBe(1)
    expect(computeDrainValue(1, spell)).toBe(1)
  })
})
