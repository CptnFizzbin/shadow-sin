import { createSelector } from "reselect"

import type { EffectByType, GameEffectData } from "#/data/gameEffects/gameEffectData.ts"
import type { GameEffectType } from "#/data/gameEffects/gameEffectType.ts"
import type { ItemCatalog } from "#/data/items/itemUtils.ts"
import type { RunnerData } from "#/data/runner/runnerData.ts"
import { keepHighestPerTag } from "#/rules/gameEffects/effectTagStacking.ts"
import { filterByEffectType, getItemGameEffects, itemEffectsApply } from "#/rules/gameEffects/gameEffectUtils.ts"
import { spellEffectsApply } from "#/rules/magic/spellSustaining.ts"
import type { Selector } from "#/state/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/state/reselect/selectorUtils.ts"
import { ComplexFormsSelectors } from "#/state/runner/complexForms/complexForms.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { PowersSelectors } from "#/state/runner/powers/powers.selector.ts"
import { QualitiesSelectors } from "#/state/runner/qualities/qualities.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { SpellsSelectors } from "#/state/runner/spells/spells.selector.ts"

function getGameEffects(item: { effects?: GameEffectData[] }): GameEffectData[] {
  return item.effects ?? []
}

/** `items` is only pulled in for `ItemSelectors.selectAll` — see docs/adr/0014-selector-input-decomposition.md
 *  on why a multi-source selector intersects the wrapper shapes it needs instead of taking bare `RunnerData`. */
export type GameEffectsState = { runner: RunnerData } & { items: ItemCatalog }

const selectAll: Selector<GameEffectsState, GameEffectData[]> = createSelector(
  [
    QualitiesSelectors.selectAll,
    ItemSelectors.selectAll,
    SpellsSelectors.selectAll,
    ComplexFormsSelectors.selectAll,
    PowersSelectors.selectAll,
  ],
  (qualities, items, spells, complexForms, powers): GameEffectData[] => {
    return [
      ...qualities,
      ...Object.values(items).filter(itemEffectsApply).map((item) => ({ effects: getItemGameEffects(item) })),
      ...spells.filter(spellEffectsApply),
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
    // Effects sharing a stacking tag only compete when they modify the same target.
    (allEffects, gameEffectType) => keepHighestPerTag(allEffects.filter(filterByEffectType(gameEffectType)), {
      getTags: (effect) => effect.tags,
      getValue: (effect) => effect.value,
      getGroupKey: (effect) => JSON.stringify([effect.target, effect.subTarget]),
    }),
  ) as GameEffectsByTypeSelector,
}
