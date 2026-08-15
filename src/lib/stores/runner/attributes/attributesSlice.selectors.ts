import { NumberUtils } from "#/lib/numberUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { awakenings } from "#/system/awakeningType.ts"
import { selectGameEffectsByType } from "#/system/gameEffects/gameEffectSelectors.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { getAttributeCap } from "#/system/karma/improvements/improvementCaps.ts"
import { metatypes } from "#/system/metatypeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectAttributes(state: RunnerData): RunnerData["attributes"] {
  return state.attributes
}

export type AttrValueSelector = (state: RunnerData) => number | null

const isAwakeningAttr = (key: AttributeKey): key is AttributeKey.magic | AttributeKey.resonance =>
  key === AttributeKey.magic || key === AttributeKey.resonance

function selectAttrBaseValue(key: AttributeKey): AttrValueSelector {
  return (state) => state.attributes[key] ?? null
}

function selectAttrMin(key: AttributeKey): AttrValueSelector {
  return (state) => {
    if (isAwakeningAttr(key)) return awakenings[state.biology.awakening].attributes[key].min
    return metatypes[state.biology.metatype].attributes[key].min
  }
}

/** The highest rating this attribute can be raised to, including cap-boosting Qualities (e.g. Exceptional Attribute). */
function selectAttrNaturalMax(key: AttributeKey): AttrValueSelector {
  return (state) => getAttributeCap(state, key)
}

function selectAttrAugmentedMax(key: AttributeKey): AttrValueSelector {
  return (state) => {
    if (isAwakeningAttr(key)) return awakenings[state.biology.awakening].attributes[key].max

    const { max, augMax } = metatypes[state.biology.metatype].attributes[key]
    return augMax ?? max
  }
}

function selectAttrModifierTotal(key: AttributeKey) {
  return (state: RunnerData): number => {
    return selectGameEffectsByType(GameEffectType.attrMod)(state)
      .filter((effect) => effect.target === key)
      .reduce((sum, effect) => sum + effect.value, 0)
  }
}

/** The attribute's current effective rating, after modifiers, augments, and drugs (all carried as `attrMod` GameEffects), clamped to `[min, augmentedMax]`. */
function selectAttrValue(key: AttributeKey): AttrValueSelector {
  return (state) => {
    const baseValue = selectAttrBaseValue(key)(state)
    if (baseValue === null) return null

    const total = baseValue + selectAttrModifierTotal(key)(state)
    return NumberUtils.clamp(total, {
      min: selectAttrMin(key)(state) ?? undefined,
      max: selectAttrAugmentedMax(key)(state) ?? undefined,
    })
  }
}

export interface AttrSelectors {
  /** Current value of the attribute, after modifiers, augments, and drugs. */
  value: AttrValueSelector
  /** Current value of the attribute, before modifiers. */
  baseValue: AttrValueSelector
  min: AttrValueSelector
  naturalMax: AttrValueSelector
  augmentedMax: AttrValueSelector
}

/**
 * Selectors for a single attribute's current value and range. `value` and `baseValue` are `null`
 * when the runner sheet doesn't populate `key` (e.g. `resonance` for a non-Technomancer).
 */
export function forAttr(key: AttributeKey): AttrSelectors {
  return {
    value: selectAttrValue(key),
    baseValue: selectAttrBaseValue(key),
    min: selectAttrMin(key),
    naturalMax: selectAttrNaturalMax(key),
    augmentedMax: selectAttrAugmentedMax(key),
  }
}
