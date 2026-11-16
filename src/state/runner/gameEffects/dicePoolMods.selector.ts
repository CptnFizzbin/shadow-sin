import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { isRunnerWithBiology } from "#/system/model/runnerTraits.ts"

import { SourcedGameEffectSelectors } from "./gameEffects.selector.ts"

const NO_GROUPS: DiceGroup[] = []

export namespace DicePoolModSelectors {
  /**
   * One bonus Dice Group per active `dicePoolMod` GameEffect that targets `poolId`, named after its
   * source. An effect with a `subTarget` only applies when the pool is rolled for that same
   * `poolSubTarget` (a spell category, spirit type, or weapon id); one without applies to every
   * roll of the pool.
   */
  export const selectGroups = createMemoizedSelector(
    ViewerStateSelectors.selectEntity,
    SourcedGameEffectSelectors.selectAll,
    SelectorOptions.poolId,
    SelectorOptions.poolSubTarget,
    (entity, sourcedEffects, poolId, poolSubTarget): DiceGroup[] => {
      // GameEffects belong to the Runner, so they only modify the Runner's own dice pools.
      if (!isRunnerWithBiology(entity)) return NO_GROUPS

      const groups = sourcedEffects
        .filter(({ effect }) => effect.type === GameEffectType.dicePoolMod
          && effect.target === poolId
          && (effect.subTarget === undefined || effect.subTarget === poolSubTarget))
        .map(({ sourceName, effect }): DiceGroup => ({ name: sourceName, size: effect.value, type: "bonus" }))

      return groups.length > 0 ? groups : NO_GROUPS
    },
  )
}
