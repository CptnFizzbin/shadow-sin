import { createSelector } from "reselect"

import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createCurriedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ItemSelectors } from "#/lib/stores/runner/gear/gearSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { EffectByType, GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { filterByEffectType } from "#/system/gameEffects/gameEffectUtils.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

function getGameEffects(item: { effects?: GameEffectData[] }): GameEffectData[] {
  return item.effects ?? []
}

/** `items` is only pulled in for `ItemSelectors.selectEquipped` — see docs/adr/0014-selector-input-decomposition.md
 *  on why a multi-source selector intersects the wrapper shapes it needs instead of taking bare `RunnerData`. */
type GameEffectsState = { runner: RunnerData } & { items: ItemCatalog }

export const selectAllGameEffects: Selector<GameEffectsState, GameEffectData[]> = createSelector(
  [
    (state: GameEffectsState) => state.runner.qualities,
    (state: GameEffectsState) => ItemSelectors.selectEquipped(state),
    (state: GameEffectsState) => state.runner.spells,
    (state: GameEffectsState) => state.runner.complexForms,
    (state: GameEffectsState) => state.runner.powers,
  ],
  (qualities, equippedGear, spells, complexForms, powers): GameEffectData[] => {
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
  <TType extends GameEffectType>(type: TType): Selector<GameEffectsState, EffectByType[TType][]>
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
 * This scans qualities, equipped gear, spells, complex forms, and powers.
 */
export function useGameEffects<T extends keyof EffectByType>(type: T): EffectByType[T][] {
  return useRunnerSelector(selectGameEffectsByType(type))
}
