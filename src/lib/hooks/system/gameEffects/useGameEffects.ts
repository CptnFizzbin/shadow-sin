import { createSelector } from "reselect"

import { createCurriedSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { RunnerDataSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { EffectByType, GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { filterByEffectType } from "#/system/gameEffects/gameEffectUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

function getGameEffects(item: { effects?: GameEffectData[] }): GameEffectData[] {
  return item.effects ?? []
}

export const selectAllGameEffects: RunnerDataSelector<GameEffectData[]> = createSelector(
  [
    (sheet: RunnerData) => sheet.qualities,
    (sheet: RunnerData) => sheet.gear,
    (sheet: RunnerData) => sheet.spells,
    (sheet: RunnerData) => sheet.complexForms,
    (sheet: RunnerData) => sheet.powers,
  ],
  (qualities, gear, spells, complexForms, powers): GameEffectData[] => {
    const equippedGear = Object.values(gear).filter((gearItem) => gearItem.equipped)

    return [
      ...qualities,
      ...equippedGear,
      ...spells,
      ...complexForms,
      ...powers,
    ].flatMap(getGameEffects)
  },
)

interface TypedGameEffectSelector {
  <TType extends GameEffectType>(type: TType): RunnerDataSelector<EffectByType[TType][]>
}

export const selectGameEffectsByType: TypedGameEffectSelector = createCurriedSelector(
  [
    selectAllGameEffects,
    (_, type: keyof EffectByType) => type,
  ],
  (allEffects, type) => {
    return allEffects.filter(filterByEffectType(type))
  },
)

/**
 * Hook to retrieve all game effects of a specific type from the runner sheet.
 * This scans qualities, gear, spells, complex forms, and powers.
 */
export function useGameEffects<T extends keyof EffectByType>(type: T): EffectByType[T][] {
  return useRunnerStoreSelector(selectGameEffectsByType(type))
}
