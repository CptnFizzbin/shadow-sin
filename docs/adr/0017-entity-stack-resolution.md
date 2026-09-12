# Entity resolution walks a stack, not a single nearest entity

**Status:** proposed

**Extends:** [ADR-0014](./0014-selector-input-decomposition.md) — implemented; this revises only
its `EntityProvider`/`useEntitySelector`/`withTrait` design, not its `Selector<TState, TReturn,
TOptions>` shape, namespacing convention, or `useRunnerSelector`. Builds on
[ADR-0016](./0016-unify-redux-state.md) Phase 1 (also implemented), which named `EntityScope` and
gave `useEntitySelector` access to `runner`/`items` alongside the entity in scope — this ADR adds
`entityStack` to that same type.

Selectors already have more than one capability trait to be entity-relative over —
`EntityWithAttrs` (`AttrSelectors`) and, as of a separate in-flight change, `EntityWithSkills`
(`SkillsSelectors`) — both read via the same `ViewerStateSelectors.selectEntity.withTrait(guard)`
pattern. But `EntityProvider`/`EntityContext` only ever hold **one** entity: nested providers
*shadow* outer ones (standard Context semantics), they don't accumulate. That's fine as long as
exactly one Entity is ever relevant to a test. It stops being fine the moment an Attack Test needs
an Attribute from one Entity and a Skill from a *different* one, simultaneously:

| Scenario | Entities involved | Attribute comes from | Skill comes from |
|---|---|---|---|
| Runner fires a held Pistol | Runner, Pistol | Runner | Runner |
| A Drone fires its mounted Pistol autonomously | Drone, its loaded combat autosoft, Pistol | Drone | the loaded autosoft |
| A rigged-in Runner fires the drone's Pistol | Runner, the drone's loaded autosoft, Pistol | Runner | the loaded autosoft |

(The autosoft's exact shape/naming is being pinned down in a separate change that adds
`EntityWithSkills`; this ADR only needs "some Entity in scope besides the Runner can structurally
answer a Skill lookup" to be true, which it already is.)

A single-slot Context can represent any *one* row's Entity, but not "the Attribute and the Skill
for this one test can legitimately come from two different Entities in scope at once." Widening
`EntityContext` to hold an **ordered stack** of every Entity currently in scope — not just the
nearest — lets each capability lookup (`withTrait(isEntityWithAttrs)`,
`withTrait(isEntityWithSkills)`) search that stack independently and land on whichever Entity
actually implements the trait it needs.

## Decision

**`EntityContext`'s value becomes `EntityData[] | null`** (an ordered stack) instead of
`EntityData | null`.

**`EntityProvider` gains an `isTopLevel?: boolean` prop.** Default behavior (`isTopLevel` absent
or `false`) **appends** its `entity` to the end of whatever stack is already in Context. Passing
**`isTopLevel: true`** clears the ambient stack first, so `entity` becomes the sole, base entry —
for an Entity that starts a genuinely new scope (e.g. a Spirit's own `StatusSheet`, unrelated to
whatever was in scope above it), as opposed to one that should be considered *alongside* what's
already there (a weapon, a loaded autosoft, a rigged-in drone). `RunnerEntityProvider` — the root
provider `RunnerStoreProvider` already mounts — passes `isTopLevel: true`.

**Resolution walks the stack end-to-start** — the most-recently-appended (nearest, most specific)
entity is checked first, falling through toward the base entity. This is a direct generalization
of today's "nested `EntityProvider`s shadow outer ones": with a one-element stack it's identical;
with more than one, "nearest wins" becomes "nearest *match* wins."

**`withTrait(guard)`** (`ViewerStateSelectors.selectEntity.withTrait`) is the only place this walk
is implemented. It now searches `entityStack` instead of checking a single `entity`, returning the
first structurally-matching Entity — same throw as today (`Entity in scope doesn't have the
expected trait: ...`) if **nothing** in the whole stack matches. No existing namespaced selector
(`AttrSelectors`, `SkillsSelectors`, ...) changes — every one of them is already written as
`withTrait(someGuard)`, so they get stack-search for free.

**`withAllTraits(...guards)`** is a new sibling combinator for the rarer case where a single
Entity must satisfy *more than one* trait at once (as opposed to two different lookups
legitimately landing on two different Entities, which is the normal case above). Same end-to-start
walk; an Entity only matches if every guard passes.

**`EntityScope` gains `entityStack: EntityData[]`.** Its existing `entity` field is kept,
`@deprecated`, defined as `entityStack.at(-1)` — every selector still typed against `{ entity: ...
}` keeps working unchanged; `entityStack` + `withTrait`/`withAllTraits` is the path forward for new
and migrated selectors.

**`useRunnerSelector` sets `entityStack: [runner]`,** sourced from `RunnerStoreContext` exactly as
it is today — independent of any ambient `EntityProvider` nesting. It remains the Runner-always
escape hatch (used sparingly); `useEntitySelector`, reading whatever stack `EntityProvider`
nesting has assembled, is the default path for entity-relative reads.

**No renames.** `EntityProvider`, `EntityContext`, and `useEntitySelector` keep their names and
public call-site shapes — the stack is an internal detail of how "the entity/entities in scope"
gets assembled, not something most callers ever see directly.

## Rough interface sketch

```ts
// src/stores/entityScope.ts
export interface EntityScope {
  runner: RunnerData
  entityStack: EntityData[]
  /** @deprecated nearest entity in scope (entityStack.at(-1)) — kept for selectors not yet
   *  migrated to entityStack + withTrait/withAllTraits. */
  entity: EntityData
  items: ItemCatalog
}

export const getEntityScope = (runner: RunnerData, entityStack: EntityData[]): EntityScope => ({
  runner,
  entityStack,
  entity: entityStack.at(-1) ?? runner,
  items: getItemCatalog(runner),
})

export const getRunnerScope = (runner: RunnerData): EntityScope =>
  getEntityScope(runner, [runner])

// src/contexts/entity/entityProvider.tsx
interface EntityProviderProps extends PropsWithChildren {
  entity: EntityData
  /** Clears the ambient entity stack before adding `entity`, instead of appending to it. */
  isTopLevel?: boolean
}
// EntityContext: createContext<EntityData[] | null>(null)

// src/stores/runner/viewerSelector.ts
withTrait: <T extends object>(guard: (e: object) => e is T) =>
  Selector<{ entityStack: object[] }, T>          // was: Selector<{ entity: object }, T>

withAllTraits: <T extends object>(...guards: ((e: object) => e is T)[]) =>
  Selector<{ entityStack: object[] }, T>          // new
```

## Considered options

- **An explicit stack argument, passed by the caller, instead of ambient Context** (mirroring
  ADR-0014's `useMatrixSelector`, whose caller already knows the specific `MatrixNodeData` it
  needs). Rejected — the ambient, nested-provider model is exactly how `EntityProvider` already
  works and how call sites already compose it (`RunnerEntityProvider` at the root, a weapon's or
  drone's own provider nested inside); making every attack-pool hook thread an explicit array
  through instead would be a much larger, unrelated call-site migration for no behavioral gain.
- **Caller-tagged roles** (`{ entity, role: "attribute" | "skill" }`) instead of structural
  matching. Rejected — it invents a new "role" vocabulary the codebase doesn't otherwise have, and
  duck-typed capability traits (`isEntityWithAttrs`, `isEntityWithSkills`, ...) already exist and
  already answer "can this Entity fill this role" without a second, parallel labeling scheme.
- **Reset-by-default, opt-in append** (an `append` prop on `EntityProvider`, defaulting to
  false/reset). Considered first as the more strictly backward-compatible reading, since it would
  make today's exact single-entity-Context behavior the unmarked default. Rejected in favor of the
  opposite — append-by-default with `isTopLevel` opting out — because appending is what nearly
  every real call site wants (a weapon, a loaded autosoft, a rigged-in drone all want to be
  considered *alongside* whatever's already in scope), while a hard reset is the rarer case
  (a Spirit's `StatusSheet` starting a wholly new scope) and reads more clearly as the one that
  should have to say so.
- **A single lookup requiring multiple traits at once, as the normal case** (i.e. no separate
  `withTrait`/`withAllTraits` split — every lookup takes one-or-more guards). Rejected — the
  motivating scenarios all have the Attribute-provider and the Skill-provider as two *different*
  Entities in the same stack, which is exactly what two independent `withTrait` calls already
  express; folding both into one multi-guard call would work against the normal case to serve the
  rare one. `withAllTraits` stays a separate, explicitly-named escape hatch instead.
- **Making every entity-relative selector's `TState` read `entityStack` directly**, instead of
  keeping `withTrait`/`withAllTraits` as the sole touch point. Rejected — `AttrSelectors`,
  `SkillsSelectors`, and every future namespace would need rewriting to do their own stack walk,
  repeating the same logic per file; `withTrait` already centralizes exactly this once, and every
  existing `Selector<{ entity: ... }, ...>` declaration is untouched by this change.
- **Merging `useRunnerSelector`'s Redux-store read into the same `entityStack`/Context
  mechanism `useEntitySelector` uses** (so both hooks assemble `EntityScope` from one source).
  Rejected — `useRunnerSelector` has to keep meaning "the Runner's own state," unconditionally,
  even from deep inside an `EntityProvider` subtree that's deliberately scoped to something else
  entirely (a Spirit's `StatusSheet`); it stays sourced from `RunnerStoreContext`, independent of
  `EntityContext`, and only *shares the resulting `EntityScope` type* with `useEntitySelector` —
  not the assembly path.

## Consequences

- `EntityContext`'s stored value changes from `EntityData | null` to `EntityData[] | null`;
  `useEntityContext` throws the same `OutOfContextError` when the Context is missing entirely
  (`null`), not when the stack is merely empty — every mounted `EntityProvider` always appends at
  least its own entity, so a non-null stack is never empty in practice.
- `EntityProvider` gains `isTopLevel`; `RunnerEntityProvider` is updated to pass it.
- `EntityScope` gains `entityStack`; its `entity` field becomes `@deprecated` but unchanged in
  meaning and value (`entityStack.at(-1)`) — zero migration required for any current caller.
- `ViewerStateSelectors.selectEntity.withTrait` is rewritten internally to walk `entityStack`
  end-to-start; `withAllTraits` is added alongside it. No other selector file
  (`AttrSelectors`, `SkillsSelectors`, ...) changes.
- `entityProvider.test.tsx`'s existing "resolves to the nearest EntityProvider, not an outer one"
  case continues to pass unchanged (a two-element stack's most-recent entry still wins first in
  the end-to-start walk); new tests are needed for: an actual multi-entity stack where two
  different `withTrait` calls resolve to two different Entities, `isTopLevel` clearing an ambient
  stack, `withTrait` throwing when *nothing* in a non-empty stack matches, and `withAllTraits`.
- `docs/adr/0014-selector-input-decomposition.md`'s `Status: proposed` header is stale — it's
  implemented — but correcting that is a separate, unrelated fix, not part of this change.

## Out of scope

- **Actually rewiring any call site to build a real multi-entity stack.** `useActiveSkillDiceGroup`
  (`src/hooks/system/dicePool/useDiceGroup.ts`) still calls `useRunnerSelector(SkillsSelectors...)`
  unconditionally today, even though `SkillsSelectors` is already entity-relative — switching it
  (and the rest of the Attack Calculator) to `useEntitySelector`, and mounting the
  `EntityProvider`s that put a Drone/autosoft/rigged-in-drone stack in scope in the first place,
  is future work this ADR only makes possible.
- **The Autosoft/`EntityWithSkills` capability's own shape, rules, and rating formulas** — being
  designed and implemented separately; this ADR only assumes some non-Runner Entity can
  structurally answer a Skill-shaped lookup, which is already true.
- **Rigging rules themselves** (which attributes a jumped-in Runner does or doesn't inherit from
  the drone) — a game-rules question for whoever builds that feature's stack-construction call
  site, not something the resolution mechanism needs an opinion on.
