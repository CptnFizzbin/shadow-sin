import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import { sustainingPenalty } from "#/system/formulas/magic/spellSustaining.ts"
import { isRunnerWithBiology } from "#/system/model/runnerTraits.ts"

const NO_GROUPS: DiceGroup[] = []

export namespace SpellsSelectors {
  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.spells,
  )

  /** The Dice Groups spells contribute to a dice pool. See `createDicePoolSelector`. */
  export namespace DiceGroups {
    /** The penalty for the spells the entity in scope is sustaining, or none while it sustains none. */
    export const selectSustainingPenalty = createMemoizedSelector(
      ViewerStateSelectors.selectEntity,
      selectAll,
      (entity, spells): DiceGroup[] => {
        // Spells belong to the Runner, so an Agent or other entity in scope never takes the penalty.
        if (!isRunnerWithBiology(entity)) return NO_GROUPS
        const penalty = sustainingPenalty(spells)
        return penalty === 0 ? NO_GROUPS : [{ name: "Sustaining", size: penalty, type: "penalty" }]
      },
    )
  }
}
