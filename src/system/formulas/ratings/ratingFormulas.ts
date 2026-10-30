import type { GameEffectData } from "#/system/model/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"

/** One named contribution to a rating, kept so the UI can show where a rating came from. */
export interface RatingModifier {
  name: string
  value: number
}

/**
 * A rating with the raw value and modifiers it was computed from. `rating` always equals
 * `rawValue` plus the sum of `modifiers`.
 */
export interface RatingBreakdown {
  rawValue: number
  modifiers: RatingModifier[]
  rating: number
}

/** A GameEffect paired with the name of the Quality, Item, Spell, Complex Form, or Power it comes from. */
export interface SourcedGameEffect {
  sourceName: string
  effect: GameEffectData
}

const sumModifiers = (modifiers: RatingModifier[]): number =>
  modifiers.reduce((sum, modifier) => sum + modifier.value, 0)

export const RatingFormulas = {
  /**
   * The modifiers in `sourcedEffects` of `type` that target `target` (and `subTarget`, when
   * given), each named after the source it comes from.
   */
  getModifiers: ({ sourcedEffects, type, target, subTarget }: {
    sourcedEffects: SourcedGameEffect[]
    type: GameEffectType
    target: string
    subTarget?: string
  }): RatingModifier[] =>
    sourcedEffects
      .filter(({ effect }) => effect.type === type
        && effect.target === target
        && (subTarget === undefined || effect.subTarget === subTarget))
      .map(({ sourceName, effect }) => ({ name: sourceName, value: effect.value })),

  /**
   * An Attribute's rating: `rawValue` plus `modifiers`, capped at `augmentedMax` when one is given,
   * then reduced by `penalties` (which the cap never absorbs). A cap that applies is listed as its
   * own negative modifier.
   */
  getAttrRating: ({ rawValue, modifiers, augmentedMax, penalties = [] }: {
    rawValue: number
    modifiers: RatingModifier[]
    augmentedMax?: number
    penalties?: RatingModifier[]
  }): RatingBreakdown => {
    const augmented = rawValue + sumModifiers(modifiers)
    const cap = augmentedMax === undefined ? augmented : Math.max(rawValue, augmentedMax)
    const capModifiers = augmented > cap ? [{ name: "Augmented maximum", value: cap - augmented }] : []
    const allModifiers = [...modifiers, ...capModifiers, ...penalties]

    return {
      rawValue,
      modifiers: allModifiers,
      rating: rawValue + sumModifiers(allModifiers),
    }
  },

  /** A Skill's (or a Specialization's) rating: `rawValue` plus `modifiers`. */
  getSkillRating: ({ rawValue, modifiers }: { rawValue: number, modifiers: RatingModifier[] }): RatingBreakdown => ({
    rawValue,
    modifiers,
    rating: rawValue + sumModifiers(modifiers),
  }),
}
