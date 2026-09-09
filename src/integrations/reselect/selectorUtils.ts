import type { Combiner, GetParamsFromSelectors, GetStateFromSelectors, SelectorArray } from "reselect"
import { createSelector as createReselectSelector } from "reselect"

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
 *
 * The trailing `& { readonly __selectorBrand?: never }` never exists at runtime and never narrows
 * what's assignable to this type (the property is optional) — it exists purely to stop this alias
 * from collapsing to a "bare" function type. A generic helper (`createSelector`, `withTrait`, ...)
 * that returns a bare `(state) => TReturn` and is then passed inline into another generic call
 * (e.g. `createMemoizedSelector(someHelper(...), combiner)`) can leave TypeScript's instantiation
 * of that inner generic unresolved at the point the outer call needs to read its shape, silently
 * widening the combiner's inferred parameter types to `any`. Intersecting with an object type forces
 * eager resolution instead.
 */
export type Selector<
  TState,
  TReturn,
  TOptions extends object | never = never,
> = ([TOptions] extends [never]
  ? (state: TState) => TReturn
  : (state: TState, options: TOptions) => TReturn) & { readonly __selectorBrand?: never }

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

/**
 * The merged `TOptions` for a `reselect` input-selector array, built from `reselect`'s own
 * `GetParamsFromSelectors` (the merged tail parameters every input selector agrees on) rather than
 * by pattern-matching each input against our `Selector` type directly — `reselect`'s own inference
 * already resolves each input selector's state/param types correctly; re-deriving that from the
 * (collapsing) `Selector` alias is unreliable, since e.g. a single-argument `(state) => TReturn` is
 * assignable to the wider `(state, options) => TReturn` shape (TS allows a function to ignore
 * trailing parameters it's given), which would make every input look like it takes `TOptions`.
 */
type ComboSelectorOptions<TInputs extends SelectorArray> =
  GetParamsFromSelectors<TInputs> extends [infer TOptions]
    ? TOptions extends object
      ? TOptions
      : never
    : never

/**
 * `createMemoizedSelector` typed against this file's own `Selector<TState, TReturn, TOptions>`
 * shape instead of `reselect`'s own (which exposes the merged input params as a positional rest
 * tuple rather than a single `options` object) — use this wherever the result is annotated with,
 * or composed into, `Selector<...>` (e.g. `AttrSelectors.selectAll`'s combiner needing its input's
 * real type rather than `unknown`/`any`).
 */
export function createMemoizedSelector<
  TInputs extends SelectorArray,
  TReturn,
>(
  ...args: [...TInputs, Combiner<TInputs, TReturn>]
): Selector<GetStateFromSelectors<TInputs>, TReturn, ComboSelectorOptions<TInputs>> {
  // `reselect`'s inferred rest-tuple param shape (`...params: ArrayTail<MergeParameters<TInputs>>`)
  // is structurally equivalent to our single-`options`-object `Selector` shape by construction —
  // every input selector built with this file's helpers takes at most one options object — but
  // TypeScript can't verify that algebraically for generic `TInputs`.
  return createReselectSelector(...args) as any // eslint-disable-line @typescript-eslint/no-explicit-any -- see comment
  // above
}

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
