import type { OverrideReason } from "#/system/formulas/gameEffects/effectTagStacking.ts"
import { findOverriddenByTag } from "#/system/formulas/gameEffects/effectTagStacking.ts"
import type { GameEffectData } from "#/system/model/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"

/** One named contribution to a rating, kept so the UI can show where a rating came from. */
export interface RatingModifier {
  name: string
  value: number
  /** Marks the Augmented Maximum cap: `value` is whatever brings the running total down to the cap. */
  isCap?: boolean
  /**
   * When set, the Modifier is listed for reference but not counted, because this larger one,
   * sharing one of its stacking tags, applies instead.
   */
  overriddenBy?: OverrideReason
}

/**
 * A rating with the raw value and modifiers it was computed from. `rating` always equals
 * `rawValue` plus the sum of the `modifiers` that aren't overridden (have no `overriddenBy`).
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
  modifiers.reduce((sum, modifier) => modifier.overriddenBy ? sum : sum + modifier.value, 0)

export const RatingFormulas = {
  /**
   * The modifiers in `sourcedEffects` of `type` that target `target` (and `subTarget`, when
   * given), each named after the source it comes from. Of the effects sharing a stacking tag,
   * only the highest counts; the others carry `overriddenBy`.
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

    return matching.map((sourcedEffect): RatingModifier => {
      const override = overridden.get(sourcedEffect)
      const modifier = { name: sourcedEffect.sourceName, value: sourcedEffect.effect.value }
      return override
        ? { ...modifier, overriddenBy: { name: override.by.sourceName, value: override.by.effect.value, tag: override.tag } }
        : modifier
    })
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

  /**
   * A Program's rating: `rawValue`, capped at `systemLimit` (the System rating of the device
   * running it) when one is given. A cap that applies is listed as its own negative modifier.
   */
  getProgramRating: ({ rawValue, systemLimit }: { rawValue: number, systemLimit?: number }): RatingBreakdown => {
    const modifiers = systemLimit !== undefined && rawValue > systemLimit
      ? [{ name: "System limit", value: systemLimit - rawValue, isCap: true }]
      : []
    return { rawValue, modifiers, rating: rawValue + sumModifiers(modifiers) }
  },

  /** A Skill's (or a Specialization's) rating: `rawValue` plus `modifiers`. */
  getSkillRating: ({ rawValue, modifiers }: { rawValue: number, modifiers: RatingModifier[] }): RatingBreakdown => ({
    rawValue,
    modifiers,
    rating: rawValue + sumModifiers(modifiers),
  }),
}
