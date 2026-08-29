import { useRunnerStoreContext } from "#/contexts/runner/runnerStore.context.ts"
import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"

export interface RunnerSelectorState {
  runner: RunnerData
  entity: RunnerData
  items: ItemCatalog
}

/**
 * The standardized way to read `RunnerData` in a component — assembles whatever `TState` a
 * namespaced selector (`ProfileSelectors.selectName`, `AttrSelectors.selectValue`,
 * `ItemSelectors.selectById`, ...) declares and applies it, so call sites just pass the selector
 * (and its options, if it takes any):
 *
 * @example
 * const name = useRunnerSelector(ProfileSelectors.selectName)
 * const base = useRunnerSelector(SkillsSelectors.selectValue, { skillName: SkillKey.pistols })
 * const system = useRunnerSelector(AttrSelectors.selectValue, { key: AttributeKey.system })
 * const armor = useRunnerSelector(ItemSelectors.selectById, { itemId })
 */
export function useRunnerSelector<TState extends RunnerSelectorState, TReturn>(
  selector: Selector<TState, TReturn>,
  compare?: (prev: TReturn, next: TReturn) => boolean,
): TReturn
export function useRunnerSelector<TState extends RunnerSelectorState, TReturn, TOptions extends object>(
  selector: Selector<TState, TReturn, TOptions>,
  options: TOptions,
  compare?: (prev: TReturn, next: TReturn) => boolean,
): TReturn
export function useRunnerSelector<TState extends RunnerSelectorState, TReturn, TOptions extends object>(
  selector: (state: TState, options?: TOptions) => TReturn,
  optionsOrCompare?: TOptions | ((prev: TReturn, next: TReturn) => boolean),
  compare?: (prev: TReturn, next: TReturn) => boolean,
): TReturn {
  const isCompareArg = typeof optionsOrCompare === "function"
  const options = isCompareArg ? undefined : optionsOrCompare
  const resolvedCompare = isCompareArg ? optionsOrCompare : compare

  return useSelector(
    useRunnerStoreContext(),
    (runner) => selector(
      {
        runner,
        entity: runner,
        items: getItemCatalog(runner),
      } as TState,
      options,
    ),
    { compare: resolvedCompare },
  )
}
