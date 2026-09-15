# Application state unifies under one top-level `RootState`

**Status:** proposed — describes the target end-state only; see Sequencing below before starting
any implementation.

Selectors answer "what is needed"; the `useXSelector` hooks answer "from where" — and "from
where" has become its own hard problem. `useRunnerSelector`'s `assembleRunnerState` and
`useEntitySelector`'s `{ entity } as TState` cast (`src/contexts/entity/entityProvider.tsx`) each
assemble their `TState` from a *different* source — a store instance via one Context, an Entity
via another — and each source is free to be missing or wrong independently of the others (e.g.
`useEntitySelector` throws `OutOfContextError` when no `EntityProvider` sits above the caller).
Today there is no single Redux store — there are at least seven independent `configureStore`/
`createCompatStore` instances: `RunnerStore` (one fresh instance *per open Runner*, via
`RunnerDataStore`), `BuilderStore`, `InitiativeTrackerStore`, `DialogCtrl`, `DiceRoller`,
`ImprovementStore`, and `DiceTrayApi` — each with its own Provider shape (`RunnerStoreProvider` vs.
`BuilderStoreProvider`), which keeps multiplying "from where" answers instead of converging them.
We're collapsing the domain-data half of this — Runner and Builder — into one singleton store
with a single `RootState`, while deliberately leaving the ad hoc UI-state stores alone. A single
`RootState` also matches the conventional shape Redux/RTK itself expects — one canonical
`RootState`, one dispatch, one DevTools timeline — a secondary but real benefit.

Note what this does and doesn't fix: it makes "from where" uniform (always a path off one root,
never a different Context/store lookup per hook), but it doesn't remove the assembly *cast*
itself (`{ entity } as TState` and friends) — that's a typing problem, still
[ADR-0014](./0014-selector-input-decomposition.md)'s territory, not this one's.

## Sequencing

This document describes the target topology only — it is **Phase 2**, and depends on a smaller
**Phase 1**: standardizing the assembly interface (the "from where" step) across the *existing*
multiple stores/Contexts, without merging anything yet. Phase 2 (the merge described below)
shouldn't start until Phase 1 has landed — the same staged discipline
[ADR-0014](./0014-selector-input-decomposition.md) and
[0015](../features/0015-entity-interface-decomposition.md) already use elsewhere in this codebase.

### Phase 1 design

`{ runner, entity, items }` already exists today as an unnamed assembly, inlined inside
`useRunnerSelector` (`RunnerSelectorState`, `src/stores/runner/runnerStore.selectors.ts`):

```ts
// current — inline, private to useRunnerSelector
selector({ runner, entity: runner, items: getItemCatalog(runner) } as TState, options)
```

Phase 1 promotes this to a named, exported type and splits its assembly into two hooks that share
it:

```ts
interface EntityScope {
  runner: RunnerData
  entity: EntityData
  items: ItemCatalog
}

function useRunnerScope(): EntityScope       // { runner, entity: runner, items } — today's logic, extracted
function useEntityScope(): EntityScope       // useRunnerScope(), with `entity` overridden from the nearest EntityProvider
```

`useRunnerSelector` is refactored to call `useRunnerScope()` internally instead of duplicating the
object literal. `useEntitySelector` is refactored to call `useEntityScope()` instead of its
current, narrower `{ entity } as TState` cast (`src/contexts/entity/entityProvider.tsx`) — a real
widening, since entity-relative selectors gain access to `runner`/`items` they don't have today.

This requires `EntityScope.entity` (and `EntityProvider`'s Context) to be typed `EntityData`
rather than today's bare `object`. Checked field-by-field against every kind `EntityProvider` can
currently hold, `SpiritData`/`SpriteData` already structurally satisfy `EntityData` as written
(every extra `EntityData` field is optional) — `entityProvider.tsx`'s existing comment claiming
otherwise is stale. Phase 1 makes this nominal, not just structural: `SpiritData`/`SpriteData`
gain explicit `extends EntityData, EntityWithDamage` declarations (`src/system/entities/traits/`).
Both are zero-migration, type-only changes — `EntityWithDamage`'s `damage: { [track: string]:
number }` already matches their existing `damage: EntityDamage<...>` fields, the same conclusion
[0015 Slice 3](../features/0015-entity-interface-decomposition.md) independently reached for these
two kinds.

Explicitly **not** in Phase 1:
- **`EntityWithAttrs` for Spirit/Sprite.** Their attributes are *computed*
  (`calculateSpiritAttributes(force, spiritType)`), never stored — implementing this trait for
  real means a migration to persist them, which [ADR-0014](./0014-selector-input-decomposition.md)
  already routes around via `selectEntityAttr`'s per-`kind` dispatch. Out of scope here; revisit
  only as its own deliberate decision.
- **`EntityWithItems`/`EntityWithQualities` for Spirit/Sprite.** 0015 already decided these don't
  apply to non-Item/Runner kinds ("permanent, unconditional dead weight for anything that isn't
  Item or Runner"). Adding them would reverse a decision already made on purpose, not extend it.

## The shape

```ts
interface RootState {
  cache: {
    savedRunners: Record<UUID, RunnerRef>
  }
  mode: "builder" | "editor" | "viewer"
  current: null | RunnerScope
  builder: null | BuilderState
}

interface RunnerScope {
  runner: RunnerData
  entities: Record<UUID, ItemData>
}
```

(`RunnerScope` here is a distinct type from Phase 1's `EntityScope` above, despite the family
resemblance — `RunnerScope` is a slice of persisted/hydrated `RootState`, `EntityScope` is a
per-render hook-assembly shape for selectors. They aren't meant to merge into one type.)

- **`cache.savedRunners`** is a rebuildable index across every known Runner, local and remote —
  it lets the runner-picker list Runners without fetching each one. It extends the existing
  `RunnerRef` type (`src/lib/persistence/runnerIndex.ts`) with `source: "local" | "remote"`,
  matching the vocabulary `parseRunnerId` already uses. `"remote"` is a type-only placeholder
  today — no remote storage provider exists, and
  none is being built as part of this change. `cache` is named to signal durability semantics:
  it can be dropped and rebuilt from each storage source's own index
  (`RunnerManager.listRunners()`) at any time without user-visible data loss, unlike `current`/
  `builder`. It's still persisted to localStorage as a fast-start mirror, same as it is today.
- **`mode`** replaces the existing `EditorModeContext` (`"builder" | "edit"`,
  `src/contexts/builder/editorMode.tsx`) entirely — that Context and its `IsBuilder`/`IsEdit`
  wrapper components are retired. The three values are genuinely distinct: **Builder** (creating
  a new Runner from scratch), **Viewer** (using a Runner during gameplay), and **Editor** (making
  non-gameplay changes to an existing Runner — today's `/edit/$runnerId` route, which already
  reuses Builder's component tree and stores under the hood).
- **`current`** holds the live Runner in *all three* modes, not just Viewer — Builder and Editor
  both read/write `current.runner`, seeded blank vs. pre-populated. There is exactly one Runner
  slot regardless of what you're doing with it.
- **`entities`** is Items only for now, sourced from `RunnerData._data_.items`
  (`docs/features/0015-entity-interface-decomposition.md`, Slice 5) once that lands. It
  deliberately excludes the Runner itself, even though `RunnerData` structurally satisfies
  `EntityData` (`kind: "runner"`) — reading "every Entity in scope" is `[state.current.runner,
  ...Object.values(state.current.entities)]`, a concat, not a single lookup.
- **`builder`** keeps its current, tiny shape (`{ nuyen: { starting } }`) — Builder/Editor-only
  wizard bookkeeping, not a duplicate of the Runner draft. It's non-null only while `mode` is
  `"builder"` or `"editor"`.

## Persistence becomes mode-aware

Today, Viewer's route (`src/routes/$runnerId.tsx`) calls `runnerManager.save()` on every store
change; Builder/Editor's (`useBuilderStores`) autosaves to a separate draft-recovery localStorage
namespace and only commits to real storage on explicit Finalize, which is what makes Cancel and
Revert (`RunnerEditor`'s `handleCancel`/`handleRevert`) meaningful.

Since `current.runner` is now the same slot in every mode, the subscriber that calls
`runnerManager.save()` must key off `mode`, not off which slot changed: it fires only when
`mode === "viewer"`. While `mode` is `"builder"`/`"editor"`, writes to `current.runner` continue
to go through the existing draft-recovery autosave instead, and only an explicit finalize/save
action commits `current.runner` into real storage. This preserves Cancel/Revert exactly as they
work today.

## Existing call sites are unaffected

`useRunnerStoreSelector`/`useRunnerStoreDispatch` (and the Builder equivalents) keep their
current signatures — callers still pass a `Selector<RunnerData, T>` and get `RunnerData` back.
Only their internals change, to read/dispatch against `globalStore.getState().current.runner`
instead of a per-instance store. None of the ~150 existing call sites need to change. This
mirrors the "purely additive, no call-site migration" discipline
[ADR-0014](./0014-selector-input-decomposition.md) already committed to.
`RunnerStoreProvider`/`BuilderStoreProvider` likely survive as a test-isolation seam (each test
can still provide a locally-constructed store), even though production has exactly one singleton
store for the app's lifetime.

## Out of scope

- **The five ad hoc UI-state stores stay exactly as they are**: `DialogCtrl`, `DiceRoller`/
  `DiceTrayApi`, `ImprovementStore`, `InitiativeTrackerStore`. `AGENTS.md`'s existing "Redux
  Toolkit store patterns" section already draws this line — these are UI/interaction-scoped
  (several are deliberately created-and-discarded per interaction), not domain data, and don't
  belong in `RootState`.
- **Full Entity-kind normalization is out of scope.** `entities` starts Items-only, matching what
  0015 actually tickets today (Slice 5). Spirits, sprites, qualities, spells, complexForms, and
  adeptPowers stay nested inside `RunnerData` for now; each would need its own future,
  independently-shippable slice to move into `entities` — the same staged discipline 0015 already
  uses for its six slices. Moving everything at once, as part of this change, would repeat
  exactly the mistake [ADR-0013](./0013-unify-runner-state-access.md)'s postmortem describes:
  unifying access before the data model could back it. This ADR is topology-only.
- **GM/multi-Runner viewing is out of scope.** `docs/features/0003-gm-game.md` is still
  `Draft`-status and explicitly single-player today, so a singular `current` (one live Runner at
  a time) isn't a conflict — if that feature is ever built, it needs its own design pass on
  whether `current` needs to become a collection.
- **Remote runner storage is out of scope.** `source: "remote"` is reserved typing only.

## Considered options

- **Standardize the assembly interface across the existing multiple stores/Contexts first; merge
  the stores themselves later.** This is the sequencing actually adopted — see Sequencing above —
  not a rejected alternative. It's recorded here because it changes what accepting this ADR means:
  accepting the target shape now, while deferring any implementation of it until Phase 1 lands and
  proves the standardized interface out.
- **Do the full merge immediately, with no standardization prerequisite.** Rejected — this would
  repeat [ADR-0013](./0013-unify-runner-state-access.md)'s exact mistake: unifying access before
  the pattern was proven, merged and reverted the same day. Phase 1 exists specifically to avoid
  finding this out mid-migration instead of before starting.
- **Fold the ad hoc UI-state stores in too**, for a truly complete "one store for everything."
  Rejected — several of them (`DialogCtrl`, `ImprovementStore`) exist specifically to be created
  and discarded per interaction, which doesn't fit a long-lived singleton without inventing reset
  semantics that buy nothing.
- **Normalize every Entity kind into `entities` now**, since the capability was being discussed
  anyway. Rejected for the same reason as the immediate full merge above: doing it before the
  dependent slices (0015) have landed risks discovering, mid-migration, that the shared shape
  doesn't actually fit every kind — better to let 0015 finish proving the pattern on Items first.

## Consequences

- `RunnerDataStore`'s per-mount instantiation (`useMemo(() => new RunnerDataStore(runner),
  [runner])`) goes away; switching Runners becomes "dispatch a load-into-`current` action" against
  the singleton, not "construct a new store." Route loaders need to move from "return data for
  `useLoaderData()`" to "dispatch an action that populates `current`."
- This ADR blocks on [0015 Slice 5](../features/0015-entity-interface-decomposition.md) (`#534`)
  landing first, since `entities` is sourced from `RunnerData._data_.items`.
- This ADR also blocks on Phase 1 (see Sequencing above) landing and proving out the standardized
  assembly interface across the existing stores/Contexts. Nothing in this document (Phase 2)
  should be implemented before that happens.
