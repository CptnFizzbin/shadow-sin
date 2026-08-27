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

interface GameEffectsByTypeSelector {
  <TType extends GameEffectType>(
    state: GameEffectsState,
    options: { gameEffectType: TType },
  ): EffectByType[TType][]
}

export const GameEffectSelectors = {
  selectAll,

  /**
   * `createMemoizedSelector` infers `options.gameEffectType` as the full `GameEffectType` union,
   * so its return type is the full `GameEffectData` union rather than the narrower
   * `EffectByType[TType][]` each call site actually gets back — the single `as` below asserts what
   * `filterByEffectType` already guarantees at runtime for any concrete `TType` (see AGENTS.md §
   * Type assertions).
   */
  selectByType: createMemoizedSelector(
    selectAll,
    SelectorOptions.gameEffectType,
    (allEffects, gameEffectType) => allEffects.filter(filterByEffectType(gameEffectType)),
  ) as GameEffectsByTypeSelector,
}
