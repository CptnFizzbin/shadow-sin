import type { FocusData } from "#data/items/magicalData.ts"
import { isRunnerWithBiology } from "#data/runner/runnerTraits.ts"
import type { DiceGroup } from "#rules/dicePool/diceGroup.tsx"
import { getAvailableSustainingFoci } from "#rules/magic/focusRules.ts"
import { getSustainingFocus, sustainingPenalty } from "#rules/magic/spellSustaining.ts"
import { createMemoizedSelector } from "#state/reselect/selectorUtils.ts"
import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { SelectorOptions } from "#state/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#state/runner/viewerSelector.ts"

const NO_GROUPS: DiceGroup[] = []
const NO_FOCI: FocusData[] = []

export namespace SpellsSelectors {
  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.spells,
  )

  export const selectById = createMemoizedSelector(
    selectAll,
    SelectorOptions.spellId,
    (spells, spellId) => spells.find((spell) => spell.id === spellId),
  )

  /** The Sustaining Foci free to hold the Spell at `spellId`, including one already holding it. */
  export const selectAvailableSustainingFoci = createMemoizedSelector(
    selectAll,
    selectById,
    ItemSelectors.Foci.selectAll,
    (spells, spell, foci) => (spell ? getAvailableSustainingFoci(foci, spells, spell) : NO_FOCI),
  )

  /** The Sustaining Focus holding the Spell at `spellId`, or `undefined` while its caster sustains it. */
  export const selectSustainingFocus = createMemoizedSelector(
    selectById,
    ItemSelectors.Foci.selectAll,
    (spell, foci) => (spell?.sustained ? getSustainingFocus(spell, foci) : undefined),
  )

  /** The Dice Groups spells contribute to a dice pool. See `createDicePoolSelector`. */
  export namespace DiceGroups {
    /** The penalty for the spells the entity in scope is sustaining, or none while it sustains none. */
    export const selectSustainingPenalty = createMemoizedSelector(
      ViewerStateSelectors.selectEntity,
      selectAll,
      ItemSelectors.Foci.selectAll,
      (entity, spells, foci): DiceGroup[] => {
        // Spells belong to the Runner, so an Agent or other entity in scope never takes the penalty.
        if (!isRunnerWithBiology(entity)) return NO_GROUPS
        const penalty = sustainingPenalty(spells, foci)
        return penalty === 0 ? NO_GROUPS : [{ name: "Sustaining", size: penalty, type: "penalty" }]
      },
    )
  }
}
