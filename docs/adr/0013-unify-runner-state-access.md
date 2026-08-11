# Runner and entity state access unify on Selector Catalogs

**Status:** proposed

Components had two live ways to read `RunnerData`: calling `useRunnerStoreSelector(Selectors.<domain>.<fn>)`
directly (152 call sites), or one of ~36 custom hooks that wrapped the same call with derived logic on top.
Neither path was wrong on its own, but nothing said which to reach for, and the ambiguity was sharpest for
values that need to resolve relative to a different owning entity (e.g. a running Agent's Response/Signal
coming from whichever `MatrixNode` currently hosts it, per `docs/adr/0012-matrix-entity-model.md`) — exactly
where `AttributesProvider`/`useAttrValue` had already forked into a second, Context-based resolution
mechanism alongside plain selectors, without either doc acknowledging the other.

We're consolidating on one rule: **every value derived from state has exactly one implementation, always a
Selector**, and **all reads go through a namespaced catalog hook** — `useRunnerSelector` for `RunnerData`,
plus sibling hooks (below) for state shapes `RunnerData` can't represent on its own. Each hook's callback
receives a namespaced catalog mirroring the existing `Selectors.<domain>` split (e.g. `attributes`, `damage`)
and picks the value it needs — either by calling a namespace with a key (`item(itemId)`) or reading a bare
property for values that don't need one (`damage.woundMod`). A Selector may be reachable from more than one
namespace when it genuinely has more than one natural home (a wound modifier is both a Damage concept and a
Modifier concept) — always the same underlying function, never reimplemented per namespace.

## The catalog mechanism

A catalog is a **static tree of `Selector<TState, TData>` functions** — built once, not reconstructed per
render, and never closes over state at construction time. `TState` is whatever shape a given domain actually
needs; it does not have to be `RunnerData`.

The hook's job, and *only* the hook's job, is to produce a `TState` value and apply it to whichever selector
the caller's `picker` returns:

```ts
function useXSelector<T>(
  /* ...whatever inputs this hook needs to build TState... */
  picker: (catalog: XSelectorCatalog) => Selector<TState, T>,
  compare?: (prev: T, next: T) => boolean,
): T {
  const state = /* build TState */
  return useSomeUnderlyingSelectorHook((_) => picker(catalog)(state), compare)
}
```

Because the picker's return value can itself be a function, this covers parameterized/curried lookups for
free — `karmaCaps.activeSkill` is `(skill: SkillKey) => Selector<RunnerData, ActiveSkillCapFacets>`; the hook
applies `RunnerData` to it once, and callers get back `(skill) => Facets` with no `state` argument in sight,
suitable for a per-row lookup in a list without a `useRunnerSelector` call per row. Call sites don't change
shape depending on how many facets a namespace exposes.

This makes the catalog itself cheap to build (it's just object/function references, no computation), and lets
`reselect`-memoized selectors keep their own memoization regardless of how many times the surrounding catalog
object gets constructed — only the one selector the picker actually selects gets invoked.

### `useRunnerSelector` — `TState = RunnerData`

The primary hook. `TState` comes from the Runner's store via `useRunnerStoreSelector`. Every namespace here
answers questions **about the Runner, unconditionally** — see the `attributes` namespace below for why that
matters.

```ts
export interface RunnerSelectorCatalog {
  attributes: /* ... */
  damage: /* ... */
  item: /* ... */
  karmaCaps: /* ... */
  magicAdvancement: /* ... */
  modifiers: /* ... */
  skills: /* ... */
  // + one namespace per #509–#517 as they land
}

const system = useRunnerSelector(({ attributes }) => attributes.forAttr(AttributeKey.system).value)
const physicalDamage = useRunnerSelector(({ damage }) => damage.track(DamageTrackKey.physical))
const woundMod = useRunnerSelector(({ damage }) => damage.woundMod)
const effectiveArmor = useRunnerSelector(({ item }) => item.armor.effective)
```

### `useAttrSelector` — `TState = AttributesContextValue`, nearest provider

Attribute values don't always belong to the Runner — a drone-mounted weapon's dice pool needs the *drone's*
attributes and autosofts, not the pilot's. `AttributesProvider` already exists for exactly this ("swap the
attribute source from the runner to a device, agent, spirit, sprite, or other entity" — see its doc comment)
and nested providers already shadow outer ones, standard Context semantics. `useAttrSelector` is the
sanctioned way to read whichever `AttributesProvider` is nearest in the tree, entity-agnostic by design:

```ts
const droneAgility = useAttrSelector(({ forAttr }) => forAttr(AttributeKey.agility).value)
```

`attrSelectorsCatalog` — the catalog `useAttrSelector` picks from — is a static tree of
`Selector<AttributesContextValue, TData>`. It has exactly one implementation, reused (not reimplemented) by
`useRunnerSelector`'s `attributes` namespace below.

### `RunnerSelectorCatalog.attributes` — the same catalog, Runner-pinned

`useRunnerSelector` needs attribute access too, but it must mean *the Runner's own*, regardless of whatever
`AttributesProvider` nesting exists around the calling component — mixing "nearest entity" and "always the
Runner" under namespaces of the same hook would just relocate the original ambiguity this ADR exists to kill.

Rather than reimplementing attribute facet logic a second time, `useRunnerSelector`'s `attributes` namespace
applies the *same* `attrSelectorsCatalog` tree against a `RunnerData → AttributesContextValue` converter (the
same derivation `RunnerAttributesProvider` already does — `selectAttributes` + metatype/awakening `infos`) via
a contramap: given `convert: RunnerData → AttributesContextValue` and `selector: Selector<AttributesContextValue, T>`,
`(state) => selector(convert(state))` is a `Selector<RunnerData, T>`. One selector tree, two converters
(nearest-Context vs. Runner-derived-from-state), zero duplicated facet logic. `RunnerAttributesProvider` and
`AttributesProvider`'s mounting are unchanged by this — they remain exactly what makes "nearest falls through
to the Runner" work by default for anything not nested under a more specific entity provider.

(Note: composing the converter across every leaf of a catalog tree needs hand-written glue where a namespace
mixes true selector leaves with nested factories, like `forAttr`'s `(key) => {...}` — a fully generic
recursive catalog-mapper can't structurally tell a curried-lookup factory apart from a leaf selector without
type-level help. Hand-write the composition per namespace; only build a generic mapper if a second namespace
needs the identical pattern.)

### `useMatrixSelector` — `TState = { runner: RunnerData, activeNode: MatrixNodeData }`, explicit argument

Matrix-node-relative values (e.g. a damage track hosted on whichever `MatrixNode` a Program/Agent is currently
running on, per ADR-0012) are entity-relative like `attributes`, but the entity in question isn't ambient the
way "nearest provider in the render tree" is — whoever needs a Matrix-relative value already knows which node
it's asking about (e.g. a Matrix action panel), so there's no benefit to threading it through Context. This
hook takes the active node as an explicit, **required** argument instead:

```ts
function useMatrixSelector<T>(
  activeNode: MatrixNodeData,
  picker: (catalog: MatrixSelectorCatalog) => Selector<{ runner: RunnerData; activeNode: MatrixNodeData }, T>,
  compare?: (prev: T, next: T) => boolean,
): T
```

`RunnerSelectorCatalog.damage` only ever has `RunnerData` in scope, so Matrix-relative damage does **not**
live there — it lives in a new `matrix.catalog.ts` read through `useMatrixSelector`. `RunnerSelectorCatalog.damage`
stays exactly `{ woundMod, track }` (callable by `DamageTrackKey`, physical/stun only), pure `RunnerData`, no
Matrix awareness.

This is a distinct concept from `RunnerSelectorCatalog.matrix` (game-state session bookkeeping — known nodes,
active node id, active programs; #516), which stays under `useRunnerSelector` since it's plain `RunnerData`.
In fact the two compose: `RunnerSelectorCatalog.matrix`'s `activeNode` facet is precisely what supplies the
`MatrixNodeData` argument `useMatrixSelector` needs.

## Considered options

- **Document a rule for when to use a hook vs. a raw selector call, keep both as coequal options.**
  Rejected — every real case the rule was tested against resolved to "selector," so a nuanced rule was
  overhead for a decision that was never actually close.
- **A general entity-relative Context (`EntityContext`) resolving any hosting entity by id, for every
  domain.** Considered and rejected — `attribute`'s "nearest provider" need (drones, spirits, sprites) and
  `damage`'s Matrix-node need turned out to have different shapes once both were concrete: the former is
  genuinely ambient (a nested subtree, resolved via render-tree position), the latter is genuinely explicit
  (the caller already knows which node). A single general mechanism would have forced one of them into the
  wrong shape. Each gets its own hook with a `TState` fit to what it actually needs, sharing only the
  `Selector<TState, TData>`-catalog convention, not a shared resolution mechanism.
- **Catalogs eagerly compute values, closing over `TState` at construction time (`build*Catalog(state)`).**
  Considered, was the initial convention for `item`/`karmaCaps`/`magicAdvancement`/`modifiers`/`skills`;
  superseded by the static-tree-of-selectors approach above. Eager construction reconstructs every namespace's
  values on every render regardless of what a caller actually picks, and duplicates the `Selector<TState,T>`
  concept already used by the 152 pre-existing `Selectors.<domain>.<fn>` call sites this ADR is consolidating.
  Deferred application costs one extra level of currying at catalog-definition sites (not call sites) in
  exchange for cheaper catalogs and one fewer concept.
- **A lint rule flagging pure-selector wrapper hooks.** Rejected in favor of `@deprecated` + manual
  migration — the project doesn't run custom ESLint rules today, and a JSDoc deprecation is enough friction
  to stop new instances without standing up new tooling.

## Consequences

- Every existing catalog (`item`, `karmaCaps`, `magicAdvancement`, `modifiers`, `skills`, plus `attributes`
  and `damage`) converts to the static-tree-of-selectors shape — factories stop taking/closing over `state`
  and become plain objects of `Selector<RunnerData, T>` (or a factory returning one, for curried lookups).
  `attributes` is the one exception that can't be a pure zero-arg/module-static tree, since deriving its
  `AttributesContextValue` needs `state` (or Context) — accepted as a narrow, single-namespace cost.
- `AttributesProvider`'s existing Context is retained and gains a sanctioned direct consumer,
  `useAttrSelector`, alongside `useRunnerSelector`'s Runner-pinned `attributes` namespace;
  `useAttrValue`/`useAttrInfo`/`useAllAttrInfos` remain `@deprecated` in favor of one or the other depending
  on whether the call site wants "the Runner" or "the nearest entity." `RunnerAttributesProvider` keeps
  populating the Context from `RunnerData` exactly as it does today.
- Existing pure-`RunnerData`-derivation hooks (`useGameEffects`, `useWoundModifier`, `useRunnerTabs`,
  `useNetWorth`, the `useRunnerArmor` family, `useVisibleSections`, the gear/adeptPowers/complexForms/sprites
  hooks, etc. — roughly 30 files) are migration candidates: deprecate each as its `useRunnerSelector` catalog
  equivalent lands, remove once callers move over.
- Hooks that need something a Selector structurally can't express — a different store (`useSpendKarmaSummary`
  reads `ImprovementStore`), a form library (`useLanguageSkillForm`), the router or Builder/Viewer context
  (`useOpenItemDetails`), or local component state (`useLicenseCheckState`) — are unaffected and stay
  ordinary hooks. This decision only touches hooks/selectors that read `RunnerData` or entity-relative state,
  directly or transitively.
- Selector composition and memoization (`reselect`, `createCurriedSelector`) are unchanged — catalog entries
  are still ordinary Selectors underneath; only the call-site ergonomic changes.
- Test coverage: `useRunnerSelector`, `useAttrSelector`, and `useMatrixSelector` each need end-to-end coverage
  of "picker returns a Selector, the hook applies `TState` to it" — the contract, not just individual catalog
  entries. A prior pass deleted `runnerSelector.test.tsx` and `attribute.selectors.test.ts` without
  replacement; both need an equivalent restored, extended to cover all three hooks.
