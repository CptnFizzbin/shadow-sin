import { createSelector } from "reselect"

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

function selectEntityAttr(attributes: RunnerData["attributes"], attrKey: AttributeKey): number | null {
  return attributes[attrKey] ?? null
}

/** Built once at module scope so it stays memoized across the repeated `forAttr` calls that use it. */
const selectRunnerAttr = createSelector(
  [
    (state: RunnerData) => state.attributes,
    (_state: RunnerData, attrKey: AttributeKey) => attrKey,
  ],
  selectEntityAttr,
)

function selectAttrBaseValue(key: AttributeKey): AttrValueSelector {
  return (state) => selectRunnerAttr(state, key)
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

/**
 * The already-memoized `attrMod` effects list, built once at module scope. `selectAttrModifierTotal`
 * and `selectAttrValue` below are plain functions wrapped around this single cached selector, not
 * separate reselect compositions of their own — reselect's memoization only holds up when its
 * helpers are constructed once in module scope, and these are recreated on every `forAttr` call.
 */
const selectAttrModEffects = selectGameEffectsByType(GameEffectType.attrMod)

function selectAttrModifierTotal(key: AttributeKey): (state: RunnerData) => number {
  return (state) =>
    selectAttrModEffects(state)
      .filter((effect) => effect.target === key)
      .reduce((sum, effect) => sum + effect.value, 0)
}

/**
 * The attribute's current effective rating, after modifiers, augments, and drugs (all carried as
 * `attrMod` GameEffects), clamped to `[min, augmentedMax]`.
 */
function selectAttrValue(key: AttributeKey): AttrValueSelector {
  return (state) => {
    const baseValue = selectAttrBaseValue(key)(state)
    if (baseValue === null) return null

    const modifierTotal = selectAttrModifierTotal(key)(state)
    const min = selectAttrMin(key)(state)
    const augmentedMax = selectAttrAugmentedMax(key)(state)

    return NumberUtils.clamp(baseValue + modifierTotal, {
      min: min ?? undefined,
      max: augmentedMax ?? undefined,
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
