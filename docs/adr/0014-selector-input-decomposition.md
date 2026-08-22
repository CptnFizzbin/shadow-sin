# Selector input decomposition

**Status:** proposed

**Supersedes:** [ADR-0013](./0013-unify-runner-state-access.md) (deprecated) — see its Postmortem
section for the full account. In short: ADR-0013 tried to unify Runner and entity-relative state
access on a `useRunnerSelector`/`useAttrSelector`/`useMatrixSelector` hook-and-catalog dispatch
layer before the data model could back "one selector reused across Runner and every Entity kind"
with anything real, and the dispatch layer itself kept simplifying away to nothing more than the
`Selectors.<domain>.<fn>` status quo it was meant to replace. It was merged and reverted within the
same day.

`useRunnerSelector`/`useEntitySelector` (or equivalents) remain the intended destination. This ADR
started as the prerequisite step, changing what a selector's *input* looks like so the two things
ADR-0013 got tangled up in — data-model reuse and call-site dispatch — could land separately. It now
also includes `useRunnerSelector` itself (`useEntitySelector` is still future work) — see "Building
`useRunnerSelector` now, without repeating ADR-0013" below for why this doesn't reintroduce
ADR-0013's problem.

## What has to be true before ADR-0013's goal is safe to attempt again

1. **A capability interface has to exist and be structurally reachable before a selector can be
   generalized over it.** `docs/features/0015-entity-interface-decomposition.md` is doing exactly
   this — `EntityWithAttrs`, `EntityWithDamage`, `WithMatrixPresence`, `EntityWithItems` — in
   sequenced, independently-shippable slices (Slice 1, the `kind` discriminant, has already
   shipped: #537). A selector can't be "written once, reused across Runner and every Entity kind"
   when only Runner-shaped data exists to run it against.
2. **A selector's state-dependency has to be separable from its options/filters before its `TState`
   can be widened without touching every call site.** Today, a parameterized selector's "what
   slice of state do I read" and "what key/id/filter am I given" are fused into one curried
   function signature (`selectAttrBase(key)` returns `(state) => number`) or, worse, a positional
   non-object second argument (`selectMatrixTrack(state, system)`). Widening `TState` from
   `RunnerData` to a capability interface, or repointing a state-accessor at a moved field (see
   below), means editing that fused signature everywhere it's produced *and* consumed. Splitting
   the two into a selector's two independent inputs — the state slice(s) it reads, and its options
   object — means only the state-accessor half needs to change later; the options half and the
   combiner logic are untouched.
3. **The specific, near-term forcing case: `RunnerData.gear` → `_data_.items`.** 0015 Slice 5
   (`EntityWithItems` + the `_data_` split, tracked in #534) moves the Runner's item collection off
   `RunnerData.gear` onto `RunnerData._data_.items`. `gearSlice.selectors.ts`'s existing exports
   read `state.gear` directly, inline, in more than a dozen places (`selectAllGear`, every
   `makeSelectByIdOfType` closure, `licenses`, `armor`, ...). Without this pass, that migration
   means touching every one of those call sites simultaneously with the data shape change. With
   this pass, `ItemSelectors`'s state-accessor input is the only thing that needs to change; its
   options handling and combiner logic don't know or care where `gear` lives.

None of the above requires, or attempts, the hook/dispatch layer ADR-0013 built. That stays out of
scope here — see Consequences.

## The standardized shape

Every selector conforms to:

```ts
type Selector<
  TState extends object,
  TReturn,
  TOptions extends object | never = never,
> = [TOptions] extends [never]
  ? (state: TState) => TReturn
  : (state: TState, options: TOptions) => TReturn
```

(`src/integrations/reselect/selectorUtils.ts`.) A selector with no options at all — a raw field
read, e.g. `ProfileSelectors.select` — has `TOptions = never` and drops the second parameter
entirely rather than taking an ignored `undefined`. A selector that needs one or more keys/filters
takes them as a single positional options object, never multiple positional arguments and never
curried:

```ts
const selector = createSelector(
  [
    (state: TState) => /* the piece(s) of state this selector reads */,
    (_state: TState, options: TOptions) => /* the piece(s) of options this selector reads */,
  ],
  (...deps) => /* TReturn */,
)
```

This is `reselect`'s own `createSelector`, not a new wrapper — `Selector<TState, TReturn, TOptions>`
just names the resulting shape consistently. A selector with nothing to derive (a bare property
read) stays a plain function typed against the same `Selector<..., never>` shape rather than being
forced through `createSelector` for no memoization benefit.

**`TState` is a wrapper object naming what it holds — `{ runner: RunnerData }`,
`{ entity: EntityWithAttrs }`, `{ items: ItemCatalog }` — never the bare stateful type passed
directly.** The point is composability: a selector needing more than one stateful source intersects
the wrapper shapes it needs (e.g. a Matrix-relative selector's
`{ runner: RunnerData } & { activeNode: MatrixNodeData }`) instead of inventing a bespoke combined
shape, and a caller assembles the wrapper once (`{ runner: state }`, `{ entity: runner }`,
`{ items: runner.gear }`) rather than every multi-source selector doing it differently.

**There is no named type for any of these wrapper shapes — not shared, not even file-local.** Every
selector spells out the exact fields it needs as an inline object type, right where it's used:
`Selector<{ runner: RunnerData }, TReturn>`, `(state: { entity: EntityWithAttrs }) => ...`. Two
named-type options were tried first and both dropped: a shared cross-file module
(`src/lib/stores/runner/runnerState.ts` exporting `RunnerState`) added an import and a module for a
two-line shape, and hid what a selector actually reads behind a type name a reader had to go look
up; a file-local named interface (`interface RunnerState { runner: RunnerData }` redeclared
per-file) was less indirection but still named something that didn't need a name — every selector
in a file used the exact same shape anyway, so the interface added a level of indirection between
the selector and the fields it reads without adding any information. Repeating
`{ runner: RunnerData }` at each `Selector<...>` is more verbose, but it means a selector's
signature alone says exactly what state it reads — nothing to cross-reference.

**Namespacing.** Each domain's new, standardized selectors live in a `PascalCase` `namespace`
declared in that domain's existing `*Slice.selectors.ts` file (`AttrSelectors`,
`ItemSelectors`, ...), not a new file. A real TS `namespace` — not a plain object — for two
reasons: members routinely need to reference sibling members by bare identifier (every
`ItemSelectors.<Type>.selectById` calls the shared, non-exported `itemOfType` helper declared once
at the `ItemSelectors` level — a plain object can't hold a private helper its nested groupings can
still see without exporting it publicly), and a namespace's members occupy their own scope, so they
can share a name with the legacy top-level export they wrap (`ProfileSelectors.selectLifestyle`
alongside the module-level `selectLifestyle`) without colliding — the wrapper reaches the legacy
implementation through a small `legacy = { ... }` local alias object declared just above the
namespace, capturing what it needs by reference before the namespace's own declarations exist to
shadow it. (`ItemSelectors` is the one file that doesn't use this `legacy` alias — see Consequences
for why.) `@typescript-eslint/no-namespace` and `no-shadow` are both explicitly re-enabled
everywhere outside `*.selectors.ts` — this is a deliberate, narrow exception, not a general
relaxation.

Nested groupings (gear's existing per-item-type `armor`/`implants`/`licenses`/... objects) become
nested namespaces (`ItemSelectors.Armor`, `ItemSelectors.Licenses`, ...) rather than folding the
distinction into a stringly-typed option.

**Purely additive.** Every existing exported selector keeps its name, signature, and behavior
unchanged; nothing calling one has to change. Each one now also carries a `@deprecated` JSDoc tag
naming its namespaced replacement (and `useRunnerSelector`, where that's the intended call path) —
annotation only, not a migration: no call site among the ~145 that currently call
`useRunnerStoreSelector`, nor any that import a legacy selector directly, is touched by this pass.
Migrating a call site is left to whoever next touches that file, guided by the deprecation notice.

## Building `useRunnerSelector` now, without repeating ADR-0013

`useRunnerSelector` (`src/lib/stores/runner/runnerStore.selectors.ts`) is a real piece of the
dispatch layer ADR-0013 tried and failed to build — worth being explicit about why building it now
doesn't reintroduce either of ADR-0013's two problems (see its Postmortem):

- **No dependency on a capability interface that doesn't exist yet.** `useRunnerSelector` only ever
  assembles from `RunnerData` — real today, nothing about it depends on 0015. Its internal
  `assembleRunnerState(runner)` builds `{ runner, entity: runner, items: runner.gear }` in one
  shot: `runner` is `RunnerData` itself, `entity` is `RunnerData` again (already structurally
  satisfying `EntityWithAttrs`, so `AttrSelectors` is served by the same call), and `items` is
  `runner.gear` (satisfying `ItemSelectors`'s `ItemCatalog`). A selector only ever reads the one or
  two fields its own `TState` names; the rest are simply unused. This covers every namespace in this
  pass with one hook, not because a capability interface was generalized over, but because
  `RunnerData` today happens to structurally satisfy all three shapes at once.
- **No catalog/dispatch/`picker` layer.** ADR-0013's hooks took a `picker: (catalog) => Selector<...>`
  indirection whose entire value proposition eroded under review. `useRunnerSelector` takes the
  selector directly — `useRunnerSelector(ProfileSelectors.selectName)`,
  `useRunnerSelector(AttrSelectors.selectValue, { key })`,
  `useRunnerSelector(ItemSelectors.selectById, { itemId })` — with no catalog object, no picker
  function, and no per-domain hook to maintain. It is a thin, single-purpose wrapper around the
  pre-existing `useRunnerStoreSelector` plus one assembly function, not a dispatch mechanism.

`useEntitySelector` remains distinct, future work: it resolves a specific *other* entity — the
nearest one via Context (a drone, a spirit, ADR-0013's `useAttrSelector` need), not the Runner's own
data — which `useRunnerSelector` was never trying to do. It's deliberately not attempted here: it
needs at least one more Entity kind actually implementing a capability trait before "resolve the
nearest entity" is answering a real question instead of a hypothetical one.

## Scope

`src/lib/stores/runner/**` only — the ~20 domain selector files backing `RunnerData`, matching
0015's own scope. `src/lib/stores/builder/**` (a parallel `BuilderState` store, not part of the
Entity decomposition) and the standalone `initiativeTracker`/dice/improvement selectors are
explicitly out of scope; Builder is a planned, separate follow-up once this pattern has proven out
on Runner.

Two stub capability-interface files exist ahead of 0015 landing them for real, under
`src/system/entities/traits/`: `entityBase.ts` (a re-export of the already-shipped `EntityData`),
`entityWithAttrs.ts`, and `entityWithItems.ts`. Only `EntityWithAttrs` is actually used by a
selector in this pass — `AttrSelectors`'s `TState` is the inline `{ entity: EntityWithAttrs }`
rather than `{ runner: RunnerData }`, because `RunnerData.attributes` already structurally
satisfies `EntityWithAttrs` today: a caller passes `{ entity: runner }` and gets a selector that's
already reusable across any future Entity kind implementing the trait, without waiting on any
migration. `EntityWithItems` (the per-item `{ parentId, childIds }` attachment position — not to be
confused with `ItemCatalog`, the bulk collection) is not yet structurally satisfied by anything, so
nothing binds to it yet; it exists purely as a documented preview of the shape 0015 will introduce.

## Considered options

- **Keep selectors curried (`selector(options)(state)`), matching the pre-existing
  `createCurriedSelector` convention.** Rejected for new selectors — a curried selector can't be
  dropped into another selector's `createSelector` input array without first being unwrapped, and
  `reselect`'s own two-positional-argument form (`selector(state, options)`) already composes
  cleanly. Existing curried exports are unaffected and remain valid; this only governs the shape of
  new, namespaced selectors.
- **Plain `const Namespace = { ... }` objects instead of TS `namespace`.** Considered first, and is
  fine wherever a namespace's members don't need to reference each other, a shared private helper,
  or an identically-named legacy export. Rejected as the general convention specifically because
  several domains need exactly that (`ItemSelectors`'s nested type groupings all sharing one
  non-exported `itemOfType` helper; `ProfileSelectors.selectLifestyle` needing the same name as the
  module-level `selectLifestyle` it wraps) and a plain object forces either a self-reference bug or
  a second re-export pass to route around it.
- **Force every selector, including bare field reads, through `createSelector`.** Rejected —
  wrapping a raw property access in `reselect` memoization adds a cache lookup and a closure for a
  case with nothing to memoize. Only selectors with options or multi-input derivations get the full
  `createSelector([...], combiner)` treatment.
- **Migrate call sites to the new namespaces as part of this pass.** Rejected — this is
  specifically the part of ADR-0013 that over-reached before its dependency existed. Namespaces
  exist for future code (and future migrations) to use; nothing currently working is asked to
  change.

## Consequences

- New namespace per `runner/**` domain file: `AttrSelectors`, `BiologySelectors`,
  `ComplexFormsSelectors`, `ContactsSelectors`, `DamageSelectors`, `EdgeSelectors`,
  `HouseRulesSelectors`, `InitiativeSelectors`, `ItemSelectors` (with nested `Armor`, `Credsticks`,
  `Devices`, `FirearmAccessories`, `Firearms`, `Implants`, `Licenses`, `Other`, `Programs`,
  `Sins`, `Software`, `Vehicles`, `Weapons`), `KarmaSelectors`, `MatrixSelectors`,
  `MetaSelectors`, `NuyenSelectors`, `PowersSelectors`, `ProfileSelectors`, `QualitiesSelectors`,
  `SkillsSelectors`, `SpellsSelectors`, `SpiritsSelectors`, `SpriteSelectors`, `TraditionSelectors`.
- `src/integrations/reselect/selectorUtils.ts` gains only `Selector<TState, TReturn, TOptions>`,
  alongside the existing `createCurriedSelector` — no wrapper types live here, or anywhere else.
  `ItemCatalog` is a new export on `src/system/items/itemUtils.ts`, alongside the existing
  `ItemDataRecord`. Every selector spells its `TState` out inline at its own declaration.
- `eslint.config.ts` gains one override block for `src/lib/stores/**/*.selectors.ts` disabling
  `@typescript-eslint/no-namespace` and `no-shadow`.
- Most namespaces wrap their file's legacy exports by delegation
  (`(state) => legacy.selectX(state.runner)`), since `{ runner: RunnerData }` carries the same
  `RunnerData` those exports already expect. `ItemSelectors` is the exception: because its `TState`
  (`{ items: ItemCatalog }`) is deliberately *narrower* than `{ runner: RunnerData }`, it can't call
  the `RunnerData`-shaped legacy exports at all — its selectors reimplement the same small
  filter/lookup logic directly against `ItemCatalog` instead. The duplication is intentional and
  small (a handful of one-line filters plus one shared `itemOfType` helper); the alternative —
  binding `ItemSelectors` to `{ runner: RunnerData }` "for now" — would recreate exactly the
  coupling Slice 5 needs this pass to avoid.
- **Discovered in passing, not fixed here:** `gearSlice.selectors.ts`'s `firearms` grouping
  (`makeSelectByIdOfType(ItemType.firearm)`) is dead — no real `ItemData` ever has
  `itemType: ItemType.firearm`; a Firearm is `itemType: ItemType.weapon` with
  `weaponType: WeaponType.firearm` (`weaponData.ts`). `ItemDataFor<ItemType.firearm>` resolves to
  `never`. `ItemSelectors.Firearms` mirrors the same (non-functional) legacy grouping for structural
  parity and is typed `ItemData | undefined`, not the more specific (and impossible) type, with a
  comment pointing at this. Fixing `ItemType.firearm`'s modeling is out of scope for this pass.
- 0015's own slices are unaffected in sequencing or scope by this ADR — this pass changes selector
  *input* shape only, never the underlying `RunnerData` fields those inputs read.
- `useRunnerSelector` is built (`src/lib/stores/runner/runnerStore.selectors.ts`) — see "Building
  `useRunnerSelector` now, without repeating ADR-0013" above for why it's scoped narrowly enough not
  to need 0015's capability interfaces. `useEntitySelector` is not built here and remains future
  work, attempted once at least one Entity kind actually implements a capability trait — not before.
- Every legacy selector export across `src/lib/stores/runner/**`, plus `useRunnerStoreSelector` and
  the `Selectors` aggregator, now carries `@deprecated` — annotation only, per "Purely additive"
  above; no call site is migrated in this pass.
