import { createSelector as createReselectSelector } from "reselect"

import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { flattenDiceGroups } from "#/components/system/dicePool/diceGroup.tsx"
import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { getPoolSize } from "#/components/system/dicePool/dicePoolData.tsx"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

/** Describes a dice pool for {@link createDicePoolSelector} to build. */
export interface DicePoolSelectorOptions<
  TInput extends object,
  TOptions extends object | never = never,
> {
  id: string
  label: string
  /** The Dice Group selectors whose groups make up the pool, in order. */
  groups: Selector<TInput, DiceGroupList, TOptions>[]
  /** When `true`, the pool gets no Wound group even if the Runner is wounded. */
  excludeWoundMod?: boolean
}

/**
 * Builds a selector for a dice pool made of `groups`, followed by the Wound Modifier unless
 * `excludeWoundMod` is set (as every Resistance Test does). This is the one place the Wound
 * Modifier is added: Dice Group selectors must not add it themselves.
 *
 * @example
 * const selectSpellcastingTest = createDicePoolSelector({
 *   id: "magic.spellcasting",
 *   label: "Spellcasting",
 *   groups: [
 *     injectOption(AttrSelectors.DiceGroups.selectAttr, { attr: AttributeKey.magic }),
 *     injectOption(SkillsSelectors.DiceGroups.selectSkill, { skill: SkillKey.spellcasting }),
 *   ],
 * })
 */
export function createDicePoolSelector<
  TInput extends { runner: RunnerData, entity: object },
  TOptions extends object | never = never,
>(config: DicePoolSelectorOptions<TInput, TOptions>): Selector<TInput, DicePoolData, TOptions> {
  const groupSelectors = [...config.groups]

  if (!config.excludeWoundMod) {
    groupSelectors.push(DamageSelectors.DiceGroups.selectWoundMod)
  }

  // @ts-expect-error - TS isn't able to resolve the nested types properly
  return createReselectSelector(
    groupSelectors,
    (...resolvedGroups: DiceGroupList[]): DicePoolData => {
      const groups = flattenDiceGroups(resolvedGroups)
      return { ...config, groups, size: getPoolSize(groups) }
    },
  )
}
