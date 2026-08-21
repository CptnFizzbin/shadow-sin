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
is the prerequisite step, not a replacement of that ambition: it changes what a selector's *input*
looks like, so that the two things ADR-0013 got tangled up in — data-model reuse and call-site
dispatch — can each land on their own, in the right order, once there's something real underneath
each one.

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

**`TState` is the bare stateful type a selector actually reads** — `RunnerData` for every
Runner-domain selector, `ItemCatalog` for `ItemSelectors` — not a named wrapper object. A wrapper
shape (`{ runner: RunnerData }`, `{ items: ItemCatalog }`) was tried first, on the theory that a
selector needing more than one stateful source could intersect named wrapper interfaces instead of
inventing a bespoke combined shape. It was dropped: nothing in this pass actually combines two
stateful sources, so the wrapper objects bought speculative composability at the cost of a `.runner`/
`.items` indirection on every single selector body, for a need that was purely hypothetical here. If
a selector genuinely needs more than one stateful source later (e.g. a Matrix-relative selector
needing both `RunnerData` and the active `MatrixNodeData`), that's the point to reach for a wrapper
shape — a plain intersection type at that one call site, not a project-wide default.

The one exception is `AttrSelectors`, whose `TState` is `AttrState` (`{ entity: EntityWithAttrs }`,
declared locally in `attributesSlice.selectors.ts`) rather than bare `RunnerData` — see Scope below
for why that wrapper earns its keep today, unlike the general case above.

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

**Purely additive.** Every existing exported selector stays exactly as it is — same name, same
signature, same call sites. The namespace is new code alongside it, not a replacement; nothing
outside the touched `*.selectors.ts` files changes in this pass.

## Scope

`src/lib/stores/runner/**` only — the ~20 domain selector files backing `RunnerData`, matching
0015's own scope. `src/lib/stores/builder/**` (a parallel `BuilderState` store, not part of the
Entity decomposition) and the standalone `initiativeTracker`/dice/improvement selectors are
explicitly out of scope; Builder is a planned, separate follow-up once this pattern has proven out
on Runner.

Two stub capability-interface files exist ahead of 0015 landing them for real, under
`src/system/entities/traits/`: `entityBase.ts` (a re-export of the already-shipped `EntityData`),
`entityWithAttrs.ts`, and `entityWithItems.ts`. Only `EntityWithAttrs` is actually used by a
selector in this pass — `AttrSelectors`'s `TState` is `AttrState` (`{ entity: EntityWithAttrs }`,
declared locally in `attributesSlice.selectors.ts`) rather than bare `RunnerData`, because
`RunnerData.attributes` already structurally satisfies `EntityWithAttrs` today: a caller passes
`{ entity: runner }` and gets a selector that's already reusable across any future Entity kind
implementing the trait, without waiting on any migration. This is the one place the wrapper-object
approach has a real, exercised payoff right now (see "The standardized shape" above for why it isn't
the default elsewhere) — it isn't a shared generic since exactly one domain needs it today; if a
second domain needs the same shape with a different capability interface, that's the point to
extract one. `EntityWithItems` (the per-item `{ parentId, childIds }` attachment position — not to
be confused with `ItemCatalog`, the bulk collection) is not yet structurally satisfied by anything,
so nothing binds to it yet; it exists purely as a documented preview of the shape 0015 will
introduce.

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
  `SkillsSelectors`, `SpellsSelectors`, `SpiritsSelectors`, `SpritesSelectors`, `TraditionSelectors`.
- `src/integrations/reselect/selectorUtils.ts` gains `Selector<TState, TReturn, TOptions>`,
  alongside the existing `createCurriedSelector` — nothing else; no shared wrapper types live here.
  `ItemCatalog` is a new export on `src/system/items/itemUtils.ts`, alongside the existing
  `ItemDataRecord`. `AttrState` is local to `attributesSlice.selectors.ts` (see Scope above for why
  it exists and isn't a shared generic).
- `eslint.config.ts` gains one override block for `src/lib/stores/**/*.selectors.ts` disabling
  `@typescript-eslint/no-namespace` and `no-shadow`.
- Most namespaces wrap their file's legacy exports by plain delegation (`(state) => legacy.selectX(state)`),
  since `TState` is bare `RunnerData`, exactly what those exports already expect. `ItemSelectors` is
  the exception: because its `TState` (`ItemCatalog`) is deliberately *narrower* than `RunnerData`,
  it can't call the `RunnerData`-shaped legacy exports at all — its selectors reimplement the same
  small filter/lookup logic directly against `ItemCatalog` instead. The duplication is intentional
  and small (a handful of one-line filters plus one shared `itemOfType` helper); the alternative —
  binding `ItemSelectors` to `RunnerData` "for now" — would recreate exactly the coupling Slice 5
  needs this pass to avoid.
- **Discovered in passing, not fixed here:** `gearSlice.selectors.ts`'s `firearms` grouping
  (`makeSelectByIdOfType(ItemType.firearm)`) is dead — no real `ItemData` ever has
  `itemType: ItemType.firearm`; a Firearm is `itemType: ItemType.weapon` with
  `weaponType: WeaponType.firearm` (`weaponData.ts`). `ItemDataFor<ItemType.firearm>` resolves to
  `never`. `ItemSelectors.Firearms` mirrors the same (non-functional) legacy grouping for structural
  parity and is typed `ItemData | undefined`, not the more specific (and impossible) type, with a
  comment pointing at this. Fixing `ItemType.firearm`'s modeling is out of scope for this pass.
- 0015's own slices are unaffected in sequencing or scope by this ADR — this pass changes selector
  *input* shape only, never the underlying `RunnerData` fields those inputs read.
- `useRunnerSelector`/`useEntitySelector` are not built here. They remain future work, to be
  attempted again once enough of 0015's capability interfaces are real and enough domains have
  gone through this input-decomposition pass that the dispatch layer would have real cross-entity
  reuse to offer — not before.
