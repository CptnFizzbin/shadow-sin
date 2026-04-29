import type { SelectorArray, UnknownMemoizer, weakMapMemoize } from "reselect"
import { createSelector } from "reselect"

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
