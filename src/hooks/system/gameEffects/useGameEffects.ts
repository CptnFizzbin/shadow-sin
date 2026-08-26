import { createSelector } from "reselect"

import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ComplexFormsSelectors } from "#/stores/runner/complexForms/complexFormsSlice.selectors.ts"
import { ItemSelectors } from "#/stores/runner/gear/gearSlice.selectors.ts"
import { PowersSelectors } from "#/stores/runner/powers/powersSlice.selectors.ts"
import { QualitiesSelectors } from "#/stores/runner/qualities/qualitiesSlice.selectors.ts"
import { SelectorOptions } from "#/stores/runner/selectorOptions.ts"
import { SpellsSelectors } from "#/stores/runner/spells/spellsSlice.selectors.ts"
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
export type GameEffectsState = { runner: RunnerData } & { items: ItemCatalog }

const selectAll: Selector<GameEffectsState, GameEffectData[]> = createSelector(
  [
    QualitiesSelectors.selectAll,
    ItemSelectors.selectEquipped,
    SpellsSelectors.selectAll,
    ComplexFormsSelectors.selectAll,
    PowersSelectors.selectAll,
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

const selectByTypeMemo = createMemoizedSelector(
  selectAll,
  SelectorOptions.gameEffectType,
  (allEffects, gameEffectType) => allEffects.filter(filterByEffectType(gameEffectType)),
)

export const GameEffectSelectors = {
  selectAll,

  /**
   * `EffectByType[TType][]` can't be derived from a bare `GameEffectType` through generic
   * inference — indexing a discriminated union by an unresolved type parameter collapses to
   * `never` (see AGENTS.md § Type assertions) — so this asserts what `filterByEffectType` already
   * guarantees at runtime for any concrete `TType`, rather than fighting the inference gap.
   */
  selectByType: <TType extends GameEffectType>(
    state: GameEffectsState,
    options: { gameEffectType: TType },
  ): EffectByType[TType][] => {
    return selectByTypeMemo(state, options) as EffectByType[TType][]
  },
}
