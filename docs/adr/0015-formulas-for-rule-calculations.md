# Formulas: pure rule calculations extracted from Selector combiners

**Status:** proposed

**Related:** [ADR-0014](./0014-selector-input-decomposition.md) (proposed) — this ADR applies the
same `XxxSelectors`/namespace convention one layer down, to the calculation logic a Selector's
combiner runs, and assumes ADR-0014's `Selector<TState, TReturn, TOptions>` shape as context.
Also see [`docs/features/0016-code-organization-cleanup.md`](../features/0016-code-organization-cleanup.md),
whose audit of `system/` vs `components/` surfaced the problem this ADR resolves.

`system/` is meant to hold every Shadowrun rule, but a meaningful share of rule-calculation code
had ended up somewhere else instead — partly orphaned in `components/` next to the UI that happens
to consume it (0016's original finding), and partly baked directly into `stores/*.selectors.ts`
`createMemoizedSelector` chains. The second case is the harder one: `DamageSelectors.selectWoundInterval`,
`selectWoundIntervalModifier`, and `ReputationSelectors.selectPublicAwarenessRating` (among others)
have their actual SR4A formulas — `Math.max(1, 3 + intervalMod)`, `8 + Math.ceil(attr / 2)`,
`Math.floor((streetCred + notoriety + modifier) / 3)`, and a hardcoded Public Awareness rank
table — written as the last argument to `createMemoizedSelector`, entangled with reselect's own
composition (each combiner depends on other selectors as inputs). A naive move-to-`system/` risked
solving the filing problem by creating a worse one: a `system/` calculator function that every
Selector then wraps in a thin pass-through, doubling the surface area of every single derived
value for no reason beyond satisfying a directory convention.

## Decision

**Formula** (see `CONTEXT.md`) names the extracted concept: a pure function in `system/`, grouped
into a `Xxx`**`Formulas`** namespace with `get*` methods — `DamageFormulas.getWoundMod`,
`AttrFormulas.getValue`, `ReputationFormulas.getLedgerAdjustedValue` — mirroring ADR-0014's
`XxxSelectors`/`select*` namespaces one for one. A Selector passes a Formula **by reference** as
its `createMemoizedSelector` combiner:

```ts
export const selectWoundInterval = createMemoizedSelector(
  selectWoundIntervalModifier,
  DamageFormulas.getWoundInterval, // was an inline arrow function; now a named, tested Formula
)
```

No new indirection layer is introduced — the "wrapper" a Selector needed anyway (reselect's own
combiner slot) *is* the Formula reference. This is what avoids the calculator-then-wrapper ceremony
a naive extraction would have produced.

The Selector/Formula split follows one rule of thumb: **a Selector collects, a Formula decides.** A
Selector reads state and gathers whatever primitives, entity traits, or arrays a calculation needs
— and stops there, never interpreting what it gathers. A Formula takes those collected inputs and
computes what the SR4A rule actually says, *including resolving an array itself* — filtering,
matching a predicate, summing — rather than requiring the Selector to pre-reduce it first. A raw
`ledger` array or an items/Qualities list to walk for matching GameEffects is therefore a legitimate
Formula input, as long as the Selector's own job stopped at picking which array, never at
interpreting its contents. The one thing a Formula never takes is the whole `RunnerData`/`EntityData`
union to walk internally — every array it receives is one the Selector already picked out, never the
full domain object it came from. A Formula returns a primitive by default, or a structured object
when the SR4A rule itself is structured (a fixed rank table is rule content, same as the arithmetic
feeding it).

## Considered Options

- **Extract each combiner into a `system/` function, keep the Selector wrapping it in a new arrow
  function.** Rejected — this is exactly the ceremony that prompted the question. Passing the
  Formula by reference costs nothing extra and eliminates it.
- **Let a Formula accept the whole `RunnerData`/`EntityData` and walk into it itself** (what
  `selectWoundIntervalModifier`'s combiner already does today, informally). Rejected — it hides a
  Formula's real dependencies behind an opaque parameter, lets them grow silently over time, and
  blurs exactly the line (state access vs. calculation) that makes a Formula unit-testable without
  a Redux store in the first place.
- **A `<subject>Formula` suffix on each function name** (`woundIntervalFormula`, `attrFormula`)
  instead of a shared namespace. Considered first; superseded in favor of matching ADR-0014's
  `XxxSelectors` namespace convention exactly, so Formulas and the Selectors that call them read as
  one consistent system rather than two different naming schemes for parallel concepts.

## Consequences

- New `system/<feature>/xxxFormulas.ts` files land as `docs/features/0016-code-organization-cleanup.md`'s
  slices are implemented; that doc's scope grows to include extracting Formula bodies out of
  `stores/*.selectors.ts` combiners, not just relocating orphaned `components/` utility files as
  originally catalogued — it needs a follow-up pass reflecting this ADR before its slices are
  turned into PRD Issues.
- Existing combiners like `selectWoundInterval`, `selectWoundIntervalModifier`,
  `selectPublicAwarenessRating`, and `selectPublicAwareness` get their formula bodies extracted
  into a named, independently unit-tested Formula and passed by reference; the Selector's own
  signature and every call site are unaffected. For `selectWoundIntervalModifier` specifically,
  this means the *whole* combiner body moves, GameEffect walking included — see below.
- `CONTEXT.md` gains the **Formula** term, cross-referenced from **Selector** — see `CONTEXT.md`
  for the full definition and worked examples.
- `GameEffect` accumulation (walking equipped items/Qualities for matching effects) and ledger
  summation move into `system/` as Formulas — `DamageFormulas.getWoundIntervalModifier({ qualities,
  items, track })`, `ReputationFormulas.getLedgerAdjustedValue({ base, ledger, stat })` — rather
  than staying Selector work as this ADR originally concluded. The Selector's job shrinks to
  picking which array (`entity.qualities`, `getItemCatalog(runner)`, `runner.reputation.ledger`)
  and handing it to the Formula; interpreting that array's contents is rule logic, so it belongs in
  `system/` like every other formula in this ADR.
