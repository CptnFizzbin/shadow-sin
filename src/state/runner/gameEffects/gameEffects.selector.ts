import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { PowersSelectors } from "#/state/runner/powers/powers.selector.ts"
import { QualitiesSelectors } from "#/state/runner/qualities/qualities.selector.ts"
import { SpellsSelectors } from "#/state/runner/spells/spells.selector.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import type { SourcedGameEffect } from "#/system/formulas/ratings/ratingFormulas.ts"
import type { GameEffectData } from "#/system/model/gameEffects/gameEffectData.ts"

// Read directly rather than through `ComplexFormsSelectors.selectAll`: that module imports
// `AttrSelectors`, which reads this namespace, and the cycle would break at module load.
const selectComplexForms = createMemoizedSelector(
  ViewerStateSelectors.selectRunner,
  (runner) => runner.complexForms,
)

export namespace SourcedGameEffectSelectors {
  /**
   * Every active GameEffect — from Qualities, equipped Items, Spells, Complex Forms, and Powers —
   * paired with the name of its source, so a rating can show where each modifier came from.
   */
  export const selectAll = createMemoizedSelector(
    QualitiesSelectors.selectAll,
    ItemSelectors.selectEquipped,
    SpellsSelectors.selectAll,
    selectComplexForms,
    PowersSelectors.selectAll,
    (qualities, equippedItems, spells, complexForms, powers): SourcedGameEffect[] =>
      [...qualities, ...equippedItems, ...spells, ...complexForms, ...powers]
        .flatMap((source: { name: string, effects?: GameEffectData[] }) =>
          (source.effects ?? []).map((effect) => ({ sourceName: source.name, effect }))),
  )
}
