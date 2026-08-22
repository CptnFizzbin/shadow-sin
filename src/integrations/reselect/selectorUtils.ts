import type { SelectorArray, UnknownMemoizer, weakMapMemoize } from "reselect"
import { createSelector as createMemoizedSelector } from "reselect"

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
  TState,
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
    typeof createMemoizedSelector<
      InputSelectors,
      Result,
      OverrideMemoizeFunction,
      OverrideArgsMemoizeFunction
    >
  >
) => {
  return currySelector(createMemoizedSelector(...args))
}

/**
 * Builds a `(state, options) => value` accessor for `key` of `TOptions`, for use as a reselect
 * input selector. Naming the whole `TOptions` shape up front (rather than just the value type)
 * makes each `Options.*` entry self-documenting at the call site: `selectorOption<{ track:
 * DamageTrackKey }>("track")` shows the key and its type together.
 */
export function selectorOption<TOptions extends object>(key: keyof TOptions & string) {
  // Explicit type args disable inference for the rest of a call, but there's no other inferred
  // parameter here for that rule to break — unlike `injectOption` below, where `TOptions` is
  // inferred rather than given — so this can stay a single call instead of a curried one.
  return (_state: unknown, options: TOptions): TOptions[keyof TOptions] => options[key]
}

export { createMemoizedSelector }

export function createSelector<TState, TReturn, TOption extends object | never = never>(selector: Selector<TState, TReturn, TOption>): Selector<TState, TReturn, TOption> {
  return selector
}

/** The options a selector still needs after `TInjected`'s keys are pre-filled. */
type RemainingOptions<TOptions extends object, TInjected extends object> =
  Omit<TOptions, keyof TInjected> extends infer TRemaining
    ? keyof TRemaining extends never
      // `never` rather than `{}` so the resulting `Selector` collapses back to the single-argument
      // call signature instead of requiring an empty options object at every call site.
      ? never
      : TRemaining
    : never

/**
 * `Omit<TOptions, keyof TInjected> & TInjected` is structurally identical to `TOptions` by
 * construction — `TInjected` is constrained to `Partial<TOptions>` below — but TypeScript can't
 * verify that algebraically for generic `TOptions`/`TInjected`. Names the one unavoidable escape
 * hatch as a single, documented `any` rather than chaining `as unknown as T` at the call site (see
 * AGENTS.md § Type assertions).
 */
type MergedOptions = any // eslint-disable-line @typescript-eslint/no-explicit-any -- see comment above

/**
 * Partially applies a subset of a selector's `TOptions`, freezing them at `injectedOptions` and
 * returning a selector that only needs whatever options weren't injected (see `forAttr` in
 * `attributesSlice.selectors.ts` for a call site that injects every option, collapsing the result
 * down to a plain `(state) => TReturn`).
 */
export function injectOption<
  TState,
  TReturn,
  TOptions extends object,
  TInjected extends Partial<TOptions>,
>(
  selector: (state: TState, options: TOptions) => TReturn,
  injectedOptions: TInjected,
): Selector<TState, TReturn, RemainingOptions<TOptions, TInjected>> {
  return ((state: TState, options: Omit<TOptions, keyof TInjected>) =>
    selector(state, { ...options, ...injectedOptions } as MergedOptions)) as Selector<
    TState, TReturn, RemainingOptions<TOptions, TInjected>
  >
}
