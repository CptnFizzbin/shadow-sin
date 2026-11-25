import type { AidSource } from "#data/dicePool/aidSource.ts"

import { AidDiceFormulas } from "./aidDiceFormulas.ts"
import type { DiceGroup } from "./diceGroup.tsx"

const NO_GROUPS: DiceGroup[] = []

/**
 * The Dice Groups `aid` adds to a pool: one bonus group per source, named after it, then a
 * "Teamwork limit" penalty taking back the Teamwork dice beyond `teamworkLimit` (the leader's
 * rating for the test's skill). None when no aid is given.
 *
 * @example
 * const selectActiveSkillAidGroups = createMemoizedSelector(
 *   SelectorOptions.aid,
 *   SkillsSelectors.selectRating,
 *   aidDiceGroups,
 * )
 */
export const aidDiceGroups = (aid: AidSource[] | undefined, teamworkLimit: number): DiceGroup[] => {
  if (!aid?.length) return NO_GROUPS

  const { contributions, teamworkExcess } = AidDiceFormulas.getAidDice({ sources: aid, teamworkLimit })
  const groups = contributions.map(({ source, dice }): DiceGroup => ({
    name: `Aid: ${source.name}`,
    size: dice,
    type: "bonus",
  }))

  return teamworkExcess > 0
    ? [...groups, { name: "Teamwork limit", size: -teamworkExcess, type: "penalty" }]
    : groups
}
