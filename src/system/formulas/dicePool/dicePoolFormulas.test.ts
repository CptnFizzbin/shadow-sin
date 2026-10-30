import { describe, expect, it } from "vitest"

import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { DicePoolFormulas } from "./dicePoolFormulas.ts"

describe.concurrent("DicePoolFormulas.getSkillModTotal", () => {
  it("sums only the skillMods targeting the skill", () => {
    // Arrange
    const skillMods = [
      { type: GameEffectType.skillMod, target: SkillKey.pistols, value: 2 },
      { type: GameEffectType.skillMod, target: SkillKey.pistols, value: 1 },
      { type: GameEffectType.skillMod, target: SkillKey.dodge, value: 3 },
    ] as const

    // Act
    const total = DicePoolFormulas.getSkillModTotal({ skillMods: [...skillMods], skill: SkillKey.pistols })

    // Assert
    expect(total).toBe(3)
  })
})

describe.concurrent("DicePoolFormulas.getSpecializationModTotal", () => {
  it("sums only the mods targeting both the skill and the specialization", () => {
    // Arrange
    const specializationMods = [
      { type: GameEffectType.skillSpecializationMod, target: SkillKey.pistols, subTarget: "Revolvers", value: 2 },
      { type: GameEffectType.skillSpecializationMod, target: SkillKey.pistols, subTarget: "Tasers", value: 4 },
      { type: GameEffectType.skillSpecializationMod, target: SkillKey.dodge, subTarget: "Revolvers", value: 8 },
    ] as const

    // Act
    const total = DicePoolFormulas.getSpecializationModTotal({
      specializationMods: [...specializationMods],
      skill: SkillKey.pistols,
      specialization: "Revolvers",
    })

    // Assert
    expect(total).toBe(2)
  })
})

describe.concurrent("DicePoolFormulas.getActiveSkillDice", () => {
  it("adds the mod total to a trained rating", () => {
    // Arrange / Act
    const dice = DicePoolFormulas.getActiveSkillDice({ rating: 3, modTotal: 2, defaulting: true })

    // Assert
    expect(dice).toEqual({ size: 5, isDefaulting: false })
  })

  it("returns the Defaulting penalty when untrained and defaulting is allowed", () => {
    // Arrange / Act
    const dice = DicePoolFormulas.getActiveSkillDice({ rating: 0, modTotal: 2, defaulting: true })

    // Assert
    expect(dice).toEqual({ size: -1, isDefaulting: true })
  })

  it("returns just the mod total when untrained and defaulting is not allowed", () => {
    // Arrange / Act
    const dice = DicePoolFormulas.getActiveSkillDice({ rating: 0, modTotal: 2, defaulting: false })

    // Assert
    expect(dice).toEqual({ size: 2, isDefaulting: false })
  })
})
