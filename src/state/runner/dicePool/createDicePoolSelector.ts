import type { GetStateFromSelectors } from "reselect"
import { createSelector as createReselectSelector } from "reselect"

import type { DiceGroup, DiceGroupList } from "#rules/dicePool/diceGroup.tsx"
import { flattenDiceGroups } from "#rules/dicePool/diceGroup.tsx"
import type { DicePoolData } from "#rules/dicePool/dicePoolData.tsx"
import { getPoolSize } from "#rules/dicePool/dicePoolData.tsx"
import { findOverriddenByTag } from "#rules/gameEffects/effectTagStacking.ts"
import type { ComboSelectorOptions, Selector } from "#state/reselect/selectorUtils.ts"
import { DamageSelectors } from "#state/runner/damage/damage.selector.ts"
import { SpellsSelectors } from "#state/runner/spells/spells.selector.ts"

/**
 * A selector for one or more Dice Groups — `(state)` or `(state, options)`. Its parameters stay
 * `any` here only so each group's own state and options types survive for `GetStateFromSelectors`
 * and `ComboSelectorOptions` to infer the pool's.
 */
type DiceGroupSelector = (state: any, ...params: any[]) => DiceGroupList // eslint-disable-line @typescript-eslint/no-explicit-any -- see comment above

type GlobalModState = Parameters<typeof DamageSelectors.DiceGroups.selectWoundMod>[0]
  & Parameters<typeof SpellsSelectors.DiceGroups.selectSustainingPenalty>[0]

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
  /** When `true`, the pool gets no Sustaining group even if the Runner is sustaining spells. */
  excludeSustainingPenalty?: boolean
}

/**
 * Builds a selector for a dice pool made of `groups`, followed by the global modifiers: the Wound
 * Modifier unless `excludeWoundMod` is set (as every Resistance Test does), and the Sustaining
 * penalty unless `excludeSustainingPenalty` is set (as a pool someone else rolls does). Of the
 * groups sharing a stacking tag, only the largest counts; the others are kept, with `overriddenBy`
 * saying why. This is the one place the global modifiers are added: Dice Group selectors must not
 * add them themselves.
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
): Selector<GetStateFromSelectors<TGroups> & GlobalModState, DicePoolData, ComboSelectorOptions<TGroups>> {
  const groupSelectors: DiceGroupSelector[] = [...config.groups]

  if (!config.excludeWoundMod) {
    groupSelectors.push(DamageSelectors.DiceGroups.selectWoundMod)
  }
  if (!config.excludeSustainingPenalty) {
    groupSelectors.push(SpellsSelectors.DiceGroups.selectSustainingPenalty)
  }

  return createReselectSelector(
    groupSelectors,
    (...resolvedGroups: DiceGroupList[]): DicePoolData => {
      // Groups from effects sharing a stacking tag (e.g. two foci) don't stack: only the largest counts,
      // and the rest stay listed as overridden so the Player can see why they don't.
      const flatGroups = flattenDiceGroups(resolvedGroups)
      const overridden = findOverriddenByTag(flatGroups, {
        getTags: (group) => group.tags,
        getValue: (group) => group.size,
      })
      const groups = flatGroups.map((group): DiceGroup => {
        const override = overridden.get(group)
        return override
          ? { ...group, overriddenBy: { name: override.by.name, value: override.by.size, tag: override.tag } }
          : group
      })
      return { ...config, groups, size: getPoolSize(groups) }
    },
  )
}
