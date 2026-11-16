import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import { DamageFormulas } from "#/system/formulas/damage/damageFormulas.ts"
import { keepHighestPerTag } from "#/system/formulas/gameEffects/effectTagStacking.ts"
import { getItemGameEffects, itemEffectsApply } from "#/system/formulas/gameEffects/gameEffectUtils.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { DamageTrackKey } from "#/system/model/entities/damageTrackKey.ts"
import { isEntityWithDamage, isEntityWithQualities } from "#/system/model/entities/entityTraits.ts"
import type { GameEffectData } from "#/system/model/gameEffects/gameEffectData.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"

interface DamageTrackInfo {
  max: number
  current: number
  woundInterval: number
  woundIntervalOffset: number
}

/**
 * The total of the `type` pain tolerance effects on `track` (or on every track) from the Runner's
 * `qualities` and Items whose effects apply. Of the effects sharing a stacking tag, only the
 * highest counts.
 */
function sumPainToleranceEffects(
  runner: RunnerData,
  qualities: { effects?: GameEffectData[] }[],
  type: GameEffectType.lowPainTolerance | GameEffectType.highPainTolerance,
  track: DamageTrackKey,
): number {
  const itemEffects = Object.values(getItemCatalog(runner)).filter(itemEffectsApply).flatMap(getItemGameEffects)
  const effects = [...qualities.flatMap((quality) => quality.effects ?? []), ...itemEffects]
    .filter((effect) => effect.type === type && (effect.target === track || effect.target === "all"))

  return keepHighestPerTag(effects, {
    getTags: (effect) => effect.tags,
    getValue: (effect) => effect.value,
  }).reduce((sum, effect) => sum + effect.value, 0)
}

export namespace DamageSelectors {
  export const selectWoundIntervalModifier = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithQualities),
    SelectorOptions.damageTrack,
    (runner: RunnerData, entity, track) =>
      sumPainToleranceEffects(runner, entity.qualities, GameEffectType.lowPainTolerance, track),
  )

  export const selectWoundInterval = createMemoizedSelector(
    selectWoundIntervalModifier,
    (intervalMod) => Math.max(1, 3 + intervalMod),
  )

  export const selectWoundIntervalOffset = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithQualities),
    SelectorOptions.damageTrack,
    (runner: RunnerData, entity, track) =>
      sumPainToleranceEffects(runner, entity.qualities, GameEffectType.highPainTolerance, track),
  )

  export const selectWoundModForTrack: Selector<
    { runner: RunnerData, entity: object },
    number,
    { track: DamageTrackKey }
  > = createMemoizedSelector(
    selectWoundInterval,
    selectWoundIntervalOffset,
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithDamage),
    SelectorOptions.damageTrack,
    (woundInterval, intervalOffset, entity, track) => {
      const damage = entity.damage[track]
      return Math.floor(Math.max(0, damage - intervalOffset) / woundInterval)
    },
  )

  export const selectWoundMod = createMemoizedSelector(
    injectOption(selectWoundModForTrack, { track: DamageTrackKey.physical }),
    injectOption(selectWoundModForTrack, { track: DamageTrackKey.stun }),
    (physicalWound, stunWound) => physicalWound + stunWound,
  )

  export const selectDamage = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithDamage),
    SelectorOptions.damageTrack,
    (entity, track) => entity.damage[track],
  )

  function createDamageTrackSelector<TState, TOptions extends object | never = never>(
    track: DamageTrackKey,
    attrSelector: Selector<TState, number | undefined, TOptions>,
  ): Selector<TState, DamageTrackInfo, TOptions> {
    return createMemoizedSelector(
      injectOption(selectDamage, { track }),
      (state: TState, options) => {
        const attr = attrSelector(state, options) ?? 0
        return 8 + Math.ceil(attr / 2)
      },
      injectOption(selectWoundInterval, { track }),
      injectOption(selectWoundIntervalOffset, { track }),
      (current, max, woundInterval, woundIntervalOffset) => ({
        max: max,
        current: current,
        woundInterval: woundInterval,
        woundIntervalOffset: woundIntervalOffset,
      }),
    )
  }

  /** Matrix damage-track capacity for the System-rated entity in scope (e.g. an Agent). */
  export const selectMatrixMax = createMemoizedSelector(
    AttrSelectors.forAttr(AttributeKey.system).selectValue,
    (system) => DamageFormulas.matrixMax({ system }),
  )

  export const track = {
    physical: createDamageTrackSelector(
      DamageTrackKey.physical,
      AttrSelectors.forAttr(AttributeKey.body).selectValue,
    ),
    stun: createDamageTrackSelector(
      DamageTrackKey.stun,
      AttrSelectors.forAttr(AttributeKey.willpower).selectValue,
    ),
    matrix: createDamageTrackSelector(
      DamageTrackKey.matrix,
      SelectorOptions.damageSystem,
    ),
  }

  // The `DiceGroups` member below shares this name, so it reads the number through an alias.
  const selectWoundModValue = selectWoundMod

  /** The Dice Groups damage contributes to a dice pool. See `createDicePoolSelector`. */
  export namespace DiceGroups {
    /** The Wound Modifier as a penalty, or none while uninjured. */
    export const selectWoundMod = createMemoizedSelector(
      selectWoundModValue,
      (woundMod): DiceGroup[] => woundMod === 0 ? [] : [{ name: "Wound", size: -woundMod, type: "penalty" }],
    )
  }
}
