import type { SkillModEffect, SkillSpecializationModEffect } from "#/system/model/gameEffects/gameEffectData.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import { SRC } from "#/system/model/systemValues.ts"

/** How many dice a single Active Skill contributes to a test, and whether that count is a Defaulting penalty. */
export interface ActiveSkillDice {
  size: number
  isDefaulting: boolean
}

export const DicePoolFormulas = {
  /** Sums every `skillMod` GameEffect in `skillMods` that targets `skill`. */
  getSkillModTotal: ({ skillMods, skill }: { skillMods: SkillModEffect[], skill: SkillKey }): number =>
    skillMods
      .filter((effect) => effect.target === skill)
      .reduce((sum, effect) => sum + effect.value, 0),

  /** Sums every `skillSpecializationMod` GameEffect in `specializationMods` that targets `skill`'s `specialization`. */
  getSpecializationModTotal: ({ specializationMods, skill, specialization }: {
    specializationMods: SkillSpecializationModEffect[]
    skill: SkillKey
    specialization: string
  }): number =>
    specializationMods
      .filter((effect) => effect.target === skill && effect.subTarget === specialization)
      .reduce((sum, effect) => sum + effect.value, 0),

  /**
   * The base dice an Active Skill contributes to a test, before modifiers: its rating when
   * trained, a Defaulting penalty when untrained and `defaulting` is allowed, otherwise none.
   */
  getActiveSkillDice: ({ rating, defaulting }: { rating: number, defaulting: boolean }): ActiveSkillDice => {
    if (rating >= 1) return { size: rating, isDefaulting: false }
    if (defaulting) return { size: SRC.Skills.Defaulting.Modifier, isDefaulting: true }
    return { size: 0, isDefaulting: false }
  },
}
