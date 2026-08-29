import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { mapToLegacySelector } from "#/stores/runner/mapToLegacySelector.ts"
import { SelectorOptions } from "#/stores/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { isEntityWithDamage, isEntityWithQualities } from "#/system/entities/entityTraits.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"

export interface DamageTrackInfo {
  max: number
  current: number
  woundInterval: number
  woundIntervalOffset: number
}

/** @deprecated Use `DamageSelectors.track.physical` via `useRunnerSelector` instead. */
export function selectPhysicalTrack(runner: RunnerData): DamageTrackInfo {
  return mapToLegacySelector(runner, DamageSelectors.track.physical)
}

/** @deprecated Use `DamageSelectors.track.stun` via `useRunnerSelector` instead. */
export function selectStunTrack(runner: RunnerData): DamageTrackInfo {
  return mapToLegacySelector(runner, DamageSelectors.track.stun)
}

export namespace DamageSelectors {
  export const selectWoundIntervalModifier = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithQualities),
    SelectorOptions.damageTrack,
    (runner: RunnerData, entity, track) => {
      let modifier = 0

      for (const quality of entity.qualities) {
        for (const effect of quality.effects ?? []) {
          if (
            effect.type === GameEffectType.lowPainTolerance
            && (effect.target === track || effect.target === "all")
          ) {
            modifier += effect.value
          }
        }
      }

      for (const item of Object.values(getItemCatalog(runner))) {
        if (item.equipped !== true) continue
        for (const effect of item.effects ?? []) {
          if (
            effect.type === GameEffectType.lowPainTolerance
            && (effect.target === track || effect.target === "all")
          ) {
            modifier += effect.value
          }
        }
      }

      return modifier
    },
  )

  export const selectWoundInterval = createMemoizedSelector(
    selectWoundIntervalModifier,
    (intervalMod) => Math.max(1, 3 + intervalMod),
  )

  export const selectWoundIntervalOffset = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithQualities),
    SelectorOptions.damageTrack,
    (runner: RunnerData, entity, track) => {
      let offset = 0

      for (const quality of entity.qualities) {
        for (const effect of quality.effects ?? []) {
          if (
            effect.type === GameEffectType.highPainTolerance
            && (effect.target === track || effect.target === "all")
          ) {
            offset += effect.value
          }
        }
      }

      for (const item of Object.values(getItemCatalog(runner))) {
        if (item.equipped !== true) continue
        for (const effect of item.effects ?? []) {
          if (
            effect.type === GameEffectType.highPainTolerance
            && (effect.target === track || effect.target === "all")
          ) {
            offset += effect.value
          }
        }
      }

      return offset
    },
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
}
