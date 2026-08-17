import { createCurriedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { NumberUtils } from "#/lib/numberUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { awakenings } from "#/system/awakeningType.ts"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
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

/** Relies on {@link selectGameEffectsByType}, so it's memoized like any other selector composition. */
const selectAttrModifierTotal = createCurriedSelector(
  [
    (state: RunnerData, _key: AttributeKey) => selectGameEffectsByType(GameEffectType.attrMod)(state),
    (_state: RunnerData, key: AttributeKey) => key,
  ],
  (attrModEffects: GameEffectData[], key: AttributeKey) => {
    return attrModEffects
      .filter((effect) => effect.target === key)
      .reduce((sum, effect) => sum + effect.value, 0)
  },
)

/**
 * The attribute's current effective rating, after modifiers, augments, and drugs (all carried as
 * `attrMod` GameEffects), clamped to `[min, augmentedMax]`. Composes the other `forAttr`
 * selectors, so it's memoized to avoid re-deriving on every read.
 */
const selectAttrValue = createCurriedSelector(
  [
    (state: RunnerData, key: AttributeKey) => selectAttrBaseValue(key)(state),
    (state: RunnerData, key: AttributeKey) => selectAttrModifierTotal(key)(state),
    (state: RunnerData, key: AttributeKey) => selectAttrMin(key)(state),
    (state: RunnerData, key: AttributeKey) => selectAttrAugmentedMax(key)(state),
  ],
  (baseValue: number | null, modifierTotal: number, min: number | null, augmentedMax: number | null) => {
    if (baseValue === null) return null

    return NumberUtils.clamp(baseValue + modifierTotal, {
      min: min ?? undefined,
      max: augmentedMax ?? undefined,
    })
  },
)

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
