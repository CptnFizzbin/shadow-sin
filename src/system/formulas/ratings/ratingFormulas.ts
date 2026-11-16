import { findOverriddenByTag } from "#/system/formulas/gameEffects/effectTagStacking.ts"
import type { GameEffectData } from "#/system/model/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"

/** One named contribution to a rating, kept so the UI can show where a rating came from. */
export interface RatingModifier {
  name: string
  value: number
  /** Marks the Augmented Maximum cap: `value` is whatever brings the running total down to the cap. */
  isCap?: boolean
  /** Listed for reference, but not counted, because a larger modifier sharing one of its stacking tags applies instead. */
  overridden?: boolean
}

/**
 * A rating with the raw value and modifiers it was computed from. `rating` always equals
 * `rawValue` plus the sum of the `modifiers` that aren't overridden.
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
  modifiers.reduce((sum, modifier) => modifier.overridden ? sum : sum + modifier.value, 0)

export const RatingFormulas = {
  /**
   * The modifiers in `sourcedEffects` of `type` that target `target` (and `subTarget`, when
   * given), each named after the source it comes from. Of the effects sharing a stacking tag,
   * only the highest counts; the others are marked `overridden`.
   */
  getModifiers: ({ sourcedEffects, type, target, subTarget }: {
    sourcedEffects: SourcedGameEffect[]
    type: GameEffectType
    target: string
    subTarget?: string
  }): RatingModifier[] => {
    const matching = sourcedEffects.filter(({ effect }) => effect.type === type
      && effect.target === target
      && (subTarget === undefined || effect.subTarget === subTarget))
    const overridden = findOverriddenByTag(matching, {
      getTags: ({ effect }) => effect.tags,
      getValue: ({ effect }) => effect.value,
    })

    return matching.map((sourcedEffect) => ({
      name: sourcedEffect.sourceName,
      value: sourcedEffect.effect.value,
      ...(overridden.has(sourcedEffect) ? { overridden: true } : {}),
    }))
  },

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
    const capModifiers = augmented > cap ? [{ name: "Augmented maximum", value: cap - augmented, isCap: true }] : []
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
