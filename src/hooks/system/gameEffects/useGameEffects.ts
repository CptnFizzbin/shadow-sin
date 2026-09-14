import { createSelector } from "reselect"

import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ComplexFormsSelectors } from "#/state/runner/complexForms/complexForms.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { PowersSelectors } from "#/state/runner/powers/powers.selector.ts"
import { QualitiesSelectors } from "#/state/runner/qualities/qualities.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { SpellsSelectors } from "#/state/runner/spells/spells.selector.ts"
import { filterByEffectType } from "#/system/formulas/gameEffects/gameEffectUtils.ts"
import type { EffectByType, GameEffectData } from "#/system/model/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

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
