import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector, injectOption, selectorOption } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { EntityWithDamage, EntityWithQualities } from "#/system/entities/entityTraits.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface DamageTrackInfo {
  max: number
  current: number
  woundInterval: number
  woundIntervalOffset: number
}

/** @deprecated Use `DamageSelectors.selectPhysical` via `useRunnerSelector` instead. */
export function selectPhysicalTrack(runner: RunnerData): DamageTrackInfo {
  return mapToLegacySelector(runner, DamageSelectors.track.physical)
}

/** @deprecated Use `DamageSelectors.selectStun` via `useRunnerSelector` instead. */
export function selectStunTrack(runner: RunnerData): DamageTrackInfo {
  return mapToLegacySelector(runner, DamageSelectors.track.stun)
}

/** @deprecated Use `DamageSelectors.selectMatrix` via `useRunnerSelector` instead. */
export const selectMatrixTrack = (runner: RunnerData, system?: number) => {
  return mapToLegacySelector(runner, DamageSelectors.track.matrix, { system })
}

/** Standardized, namespaced selectors for the Damage domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace DamageSelectors {
  export type DamageSelector<TReturn, TOptions extends object | never = never> = Selector<
    {
      runner: RunnerData
      entity: EntityWithDamage
    },
    TReturn,
    TOptions
  >

  export const Options = {
    system: selectorOption<{ system?: number }>("system"),
    track: selectorOption<{ track: DamageTrackKey }>("track"),
  }

  export const selectWoundIntervalModifier = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    ViewerStateSelectors.selectEntity.withTrait<EntityWithQualities>(),
    Options.track,
    (runner, entity, track) => {
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

      for (const item of Object.values(runner.gear)) {
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
    ViewerStateSelectors.selectEntity.withTrait<EntityWithQualities>(),
    Options.track,
    (runner, entity, track) => {
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

      for (const item of Object.values(runner.gear)) {
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

  export const selectWoundModForTrack = createMemoizedSelector(
    selectWoundInterval,
    selectWoundIntervalOffset,
    ViewerStateSelectors.selectEntity.withTrait<EntityWithDamage>(),
    Options.track,
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
    ViewerStateSelectors.selectEntity.withTrait<EntityWithDamage>(),
    Options.track,
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
      Options.system,
    ),
  }
}
