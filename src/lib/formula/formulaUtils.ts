/**
 * The standardized Formula shape (see `docs/adr/0015-formulas-for-rule-calculations.md`): a pure
 * function computing one SR4A rule value from a pre-narrowed inputs object. Unlike a `Selector`
 * (`src/integrations/reselect/selectorUtils.ts`), a Formula has no store/state dependency and no
 * memoization — it's a plain function, callable and testable directly with a literal inputs object.
 */
export type Formula<TInputs, TReturn> = (inputs: TInputs) => TReturn

/**
 * Marks a `createFormula` provider as "read this key straight from the outer inputs object"
 * rather than computing it via a nested Formula. Placed in a providers object under the same key
 * name the combiner will receive it as.
 */
export const FormulaInput = Symbol("FormulaInput")

type Provider<TInputs, TValue> = typeof FormulaInput | Formula<TInputs, TValue>

type ResolvedProviders<TInputs, TProviders extends Record<string, Provider<TInputs, unknown>>> = {
  [K in keyof TProviders]: TProviders[K] extends Formula<TInputs, infer TValue>
    ? TValue
    : K extends keyof TInputs
      ? TInputs[K]
      : never
}

/**
 * Builds a Formula whose combiner runs against a named, pre-resolved object rather than the raw
 * inputs directly — mirrors `reselect`'s `createSelector([...inputSelectors], combiner)`
 * composability, without memoization (a Formula has no state reference to memoize against; each
 * call is a fresh, cheap computation). Each provider is either `FormulaInput` (pick that key
 * straight from the outer inputs) or another Formula (computed by calling it with the same outer
 * inputs). Omit `providers` entirely for a Formula with no composition to do — `createFormula(combiner)`
 * then just annotates a plain calculation with the `Formula<TInputs, TReturn>` shape consistently,
 * the same role `createSelector` (no relation) plays for a bare, uncomposed `Selector`.
 *
 * @example
 * const getWoundInterval = createFormula(
 *   { intervalMod: FormulaInput },
 *   ({ intervalMod }: { intervalMod: number }) => Math.max(1, 3 + intervalMod),
 * )
 *
 * const getPublicAwareness = createFormula(
 *   { rating: getPublicAwarenessRating },
 *   ({ rating }: { rating: number }) => ({ rating, ...rankFor(rating) }),
 * )
 */
export function createFormula<TInputs, TReturn>(
  combiner: Formula<TInputs, TReturn>,
): Formula<TInputs, TReturn>
export function createFormula<
  TInputs,
  TProviders extends Record<string, Provider<TInputs, unknown>>,
  TReturn,
>(
  providers: TProviders,
  combiner: (resolved: ResolvedProviders<TInputs, TProviders>) => TReturn,
): Formula<TInputs, TReturn>
export function createFormula(
  providersOrCombiner: Record<string, Provider<unknown, unknown>> | Formula<unknown, unknown>,
  maybeCombiner?: (resolved: Record<string, unknown>) => unknown,
): Formula<unknown, unknown> {
  if (maybeCombiner === undefined) {
    return providersOrCombiner as Formula<unknown, unknown>
  }

  const providers = providersOrCombiner as Record<string, Provider<unknown, unknown>>
  const combiner = maybeCombiner

  return (inputs: unknown) => {
    const resolved: Record<string, unknown> = {}
    for (const key of Object.keys(providers)) {
      const provider = providers[key]
      resolved[key] = provider === FormulaInput
        ? (inputs as Record<string, unknown>)[key]
        : provider(inputs)
    }
    return combiner(resolved)
  }
}
