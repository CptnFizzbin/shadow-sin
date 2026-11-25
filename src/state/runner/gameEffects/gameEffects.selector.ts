import type { GameEffectData } from "#/data/gameEffects/gameEffectData.ts"
import { getItemGameEffects, itemEffectsApply } from "#/rules/gameEffects/gameEffectUtils.ts"
import { spellEffectsApply } from "#/rules/magic/spellSustaining.ts"
import type { SourcedGameEffect } from "#/rules/ratings/ratingFormulas.ts"
import { createMemoizedSelector } from "#/state/reselect/selectorUtils.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { PowersSelectors } from "#/state/runner/powers/powers.selector.ts"
import { QualitiesSelectors } from "#/state/runner/qualities/qualities.selector.ts"
import { SpellsSelectors } from "#/state/runner/spells/spells.selector.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"

// Read directly rather than through `ComplexFormsSelectors.selectAll`: that module imports
// `AttrSelectors`, which reads this namespace, and the cycle would break at module load.
const selectComplexForms = createMemoizedSelector(
  ViewerStateSelectors.selectRunner,
  (runner) => runner.complexForms,
)

export namespace SourcedGameEffectSelectors {
  /**
   * Every active GameEffect — from Qualities, Items whose effects apply, Spells whose effects apply, Complex Forms, and Powers —
   * paired with the name of its source, so a rating can show where each modifier came from.
   */
  export const selectAll = createMemoizedSelector(
    QualitiesSelectors.selectAll,
    ItemSelectors.selectAll,
    SpellsSelectors.selectAll,
    selectComplexForms,
    PowersSelectors.selectAll,
    (qualities, items, spells, complexForms, powers): SourcedGameEffect[] =>
      [
        ...qualities,
        ...Object.values(items)
          .filter(itemEffectsApply)
          .map((item) => ({ name: item.name, effects: getItemGameEffects(item) })),
        ...spells.filter(spellEffectsApply),
        ...complexForms,
        ...powers,
      ]
        .flatMap((source: { name: string, effects?: GameEffectData[] }) =>
          (source.effects ?? []).map((effect) => ({ sourceName: source.name, effect }))),
  )
}
