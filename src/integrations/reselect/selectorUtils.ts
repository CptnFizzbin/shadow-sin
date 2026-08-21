import type { SelectorArray, UnknownMemoizer, weakMapMemoize } from "reselect"
import { createSelector } from "reselect"

/**
 * The standardized selector shape (see `docs/adr/0014-selector-input-decomposition.md`): every
 * selector takes the stateful shape it reads from as `TState`, plus an optional `TOptions` object
 * carrying whatever filters/keys/ids it needs (`itemId`, `attrKey`, ...). `TOptions` defaults to
 * `never` for a selector that needs no options at all, in which case the second parameter drops
 * out of the call signature entirely rather than being `undefined`-typed.
 *
 * This is a thin, `reselect`-agnostic type alias, not a replacement for `reselect`'s own
 * `Selector` — namespaced selectors (`AttrSelectors.selectValue`, `ItemSelectors.selectById`, ...)
 * are still built with `createSelector([...inputs], combiner)`, this just names the resulting
 * shape consistently for annotation.
 */
export type Selector<
  TState extends object,
  TReturn,
  TOptions extends object | never = never,
> = [TOptions] extends [never]
  ? (state: TState) => TReturn
  : (state: TState, options: TOptions) => TReturn

const currySelector = <
  State,
  Result,
  Params extends readonly unknown[],
  AdditionalFields,
>(
  selector: ((state: State, ...args: Params) => Result) & AdditionalFields,
) => {
  const curriedSelector = (...args: Params) => {
    return (state: State) => {
      return selector(state, ...args)
    }
  }
  return Object.assign(curriedSelector, selector)
}

export const createCurriedSelector = <
  InputSelectors extends SelectorArray,
  Result,
  OverrideMemoizeFunction extends UnknownMemoizer = typeof weakMapMemoize,
  OverrideArgsMemoizeFunction extends UnknownMemoizer = typeof weakMapMemoize,
>(
  ...args: Parameters<
    typeof createSelector<
      InputSelectors,
      Result,
      OverrideMemoizeFunction,
      OverrideArgsMemoizeFunction
    >
  >
) => {
  return currySelector(createSelector(...args))
}
