import type { GetStateFromSelectors } from "reselect"
import { createSelector as createReselectSelector } from "reselect"

import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { flattenDiceGroups } from "#/components/system/dicePool/diceGroup.tsx"
import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { getPoolSize } from "#/components/system/dicePool/dicePoolData.tsx"
import type { ComboSelectorOptions, Selector } from "#/integrations/reselect/selectorUtils.ts"
import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"

/**
 * A selector for one or more Dice Groups — `(state)` or `(state, options)`. Its parameters stay
 * `any` here only so each group's own state and options types survive for `GetStateFromSelectors`
 * and `ComboSelectorOptions` to infer the pool's.
 */
type DiceGroupSelector = (state: any, ...params: any[]) => DiceGroupList // eslint-disable-line @typescript-eslint/no-explicit-any -- see comment above

type WoundModState = Parameters<typeof DamageSelectors.DiceGroups.selectWoundMod>[0]

/** Describes a dice pool for {@link createDicePoolSelector} to build. */
export interface DicePoolSelectorOptions<TGroups extends DiceGroupSelector[]> {
  id: string
  label: string
  /**
   * The Dice Group selectors whose groups make up the pool, in order. Spread as `[...TGroups]` so
   * it's inferred as a mutable tuple: reselect can't merge a `readonly` tuple's parameters.
   */
  groups: [...TGroups]
  /** When `true`, the pool gets no Wound group even if the Runner is wounded. */
  excludeWoundMod?: boolean
}

/**
 * Builds a selector for a dice pool made of `groups`, followed by the Wound Modifier unless
 * `excludeWoundMod` is set (as every Resistance Test does). This is the one place the Wound
 * Modifier is added: Dice Group selectors must not add it themselves.
 *
 * The pool selector's state and options are inferred from `groups`: it takes every field any
 * group selector reads.
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
export function createDicePoolSelector<TGroups extends DiceGroupSelector[]>(
  config: DicePoolSelectorOptions<TGroups>,
): Selector<GetStateFromSelectors<TGroups> & WoundModState, DicePoolData, ComboSelectorOptions<TGroups>> {
  const groupSelectors: DiceGroupSelector[] = [...config.groups]

  if (!config.excludeWoundMod) {
    groupSelectors.push(DamageSelectors.DiceGroups.selectWoundMod)
  }

  return createReselectSelector(
    groupSelectors,
    (...resolvedGroups: DiceGroupList[]): DicePoolData => {
      const groups = flattenDiceGroups(resolvedGroups)
      return { ...config, groups, size: getPoolSize(groups) }
    },
  )
}
