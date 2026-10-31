import type { Combiner, GetParamsFromSelectors, GetStateFromSelectors, SelectorArray } from "reselect"
import { createSelector as createReselectSelector } from "reselect"

import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import type { DicePoolConfig, DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { getPoolSize } from "#/components/system/dicePool/dicePoolData.tsx"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"

type WoundModState = Parameters<typeof DamageSelectors.selectWoundMod>[0]

type DicePoolSelectorOptions<TInputs extends SelectorArray> =
  GetParamsFromSelectors<TInputs> extends [infer TOptions]
    ? TOptions extends object
      ? TOptions
      : never
    : never

/**
 * Builds a selector that compiles a {@link DicePoolConfig} into {@link DicePoolData}. Takes the
 * same arguments as `createMemoizedSelector`, except the combiner returns the pool's config.
 *
 * This is the one place the wound modifier is applied: the compiled pool gets a single Wound
 * penalty group for the in-scope Entity's current wound modifier, unless the config sets
 * `excludeWoundMod`. Dice group selectors and hooks must not add one themselves.
 *
 * @example
 * const selectStandardTest = createDicePoolSelector(
 *   selectAttrTest,
 *   selectSkillTest,
 *   (attrGroups, skillGroups): DicePoolConfig => ({
 *     id: "standardTest",
 *     label: "Standard Test",
 *     groups: [...attrGroups, ...skillGroups],
 *   }),
 * )
 */
export function createDicePoolSelector<TInputs extends SelectorArray>(
  ...args: [...TInputs, Combiner<TInputs, DicePoolConfig>]
): Selector<GetStateFromSelectors<TInputs> & WoundModState, DicePoolData, DicePoolSelectorOptions<TInputs>> {
  const selectConfig = createReselectSelector(...args)

  // Same escape hatch as `createMemoizedSelector`: reselect's rest-tuple param shape is equivalent
  // to our single-options-object `Selector` shape, but TypeScript can't prove it for generic
  // `TInputs`.
  return createReselectSelector(
    [selectConfig, DamageSelectors.selectWoundMod],
    (config: DicePoolConfig, woundMod: number): DicePoolData => {
      const groups: DiceGroup[] = config.excludeWoundMod || woundMod === 0
        ? config.groups
        : [...config.groups, { name: "Wound", size: -woundMod, type: "penalty" }]

      return { ...config, groups, size: getPoolSize(groups) }
    },
  ) as any // eslint-disable-line @typescript-eslint/no-explicit-any -- see comment above
}
