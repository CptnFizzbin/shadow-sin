import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { useRunnerState } from "#/state/runnerState.ts"

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
export function useRunnerSelector<TReturn>(
  selector: Selector<EntityScope, TReturn>,
): TReturn
export function useRunnerSelector<TReturn, TOptions extends object>(
  selector: Selector<EntityScope, TReturn, TOptions>,
  options: TOptions,
): TReturn
export function useRunnerSelector<TReturn, TOptions extends object>(
  selector: (state: EntityScope, options?: TOptions) => TReturn,
  optionsOrCompare?: TOptions | ((prev: TReturn, next: TReturn) => boolean),
): TReturn {
  const isCompareArg = typeof optionsOrCompare === "function"
  const options = isCompareArg ? undefined : optionsOrCompare

  return useRunnerState((state) => {
    return selector({ ...state, entity: state.runner }, options)
  })
}
