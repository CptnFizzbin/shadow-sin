# AGENTS.md — ShadowSIN

A **Shadowrun 4th Edition character sheet**

> **Domain language:** See [`CONTEXT.md`](./CONTEXT.md) for the canonical glossary of all
> domain terms, relationships, and flagged ambiguities. Use those terms consistently in code,
> comments, and docs. Open design problems are tracked in `docs/features/`.
>
> **Contribution workflow:** See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for how features,
> GitHub Issues, and ADRs relate to each other.

SPA: React 19 + TanStack Router + Redux Toolkit + MUI v9.

## Commands

```bash
yarn dev          # dev server on :3000
yarn build        # production build
yarn preview      # preview production build locally
yarn test         # alias for yarn test:unit (Vitest, run once)
yarn test:unit    # Vitest unit tests (run once)
yarn test:unit:ui # Vitest with browser UI
yarn test:all     # unit + e2e in parallel
yarn test:e2e     # Playwright end-to-end tests
yarn test:e2e:ui  # Playwright with browser UI
yarn fix          # Runs all "*:fix" scripts (npm-run-all2) — auto-fix lint/format steps
yarn lint         # Runs all lint tasks (eslint checks via npm-run-all2)
yarn eslint       # Run ESLint against src (check or write via :lint/:fix variants)
yarn tsc          # TypeScript type check (no emit; runs tsgo --noEmit via @typescript/native-preview)
yarn fallow       # Run Fallow codebase analysis (dead code, duplication, complexity)
```

## Architecture

Runner state (`RunnerData`) lives in a Redux Toolkit store — not React state or Context values directly. Each domain
(`attributes`, `biology`, `karma`, `skills`, etc., under `src/stores/runner/<domain>/`) follows a three-file pattern:
`*Slice.actions.ts` (RTK `createAction`/`createAsyncThunk`), `*Slice.ts` (RTK `createReducer`), and
`*Slice.selectors.ts` (plain selector functions). `src/stores/runner/runnerStore.reducer.ts` combines them with RTK's
`combineReducers`. A store instance is created per runner (`RunnerDataStore`, `src/components/runner/sheet/runnerDataStore.ts`)
and provided through React context via `RunnerStoreProvider` (context in `src/contexts/runner/runnerStore.context.ts`).
Components subscribe reactively via `useRunnerStoreSelector(selector)` (`src/stores/runner/runnerStore.selectors.ts`)
and dispatch via `useRunnerStoreDispatch()` (`src/stores/runner/runnerStore.dispatch.ts`) — never read
`store.state`/`store.get()` directly in a component (see "Redux Toolkit store patterns" below). The Builder flow
mirrors this with its own `BuilderState` store (`src/stores/builder/`).

The `$runnerId.tsx` route subscribes to store changes via `store.subscribe()` and immediately persists to
`runnerManager.save()` on every update (no dedicated persistence component).

The root domain type is `RunnerData` — see `docs/adr/0001-runner-data-not-character-sheet.md` for the
`character` → `runner` rename; the old naming deliberately survives only in the migration subsystem and
localStorage key literals.

### Key directories

- `src/system/` — All domain types (`RunnerData` is the root, in `runnerData.ts`)
- `src/system/gear/` — Gear sub-types keyed by `ItemType` enum
- `src/system/magic/` — Magic sub-types: `spellData.ts`, `adeptPowerData.ts`, `complexFormData.ts`,
  `spriteData.ts`, `traditionData.ts`, etc.
- `src/system/gameEffects/` — `GameEffectData` and related types; effects attach to gear items via
  `ItemData.effects`
- `src/system/dice/` — `DiceRoller` store; paired with `src/components/dice/` (`DiceTrayApi`) for the dice tray UI
- `src/system/attributeKey.ts` — `AttributeKey` enum + `PhysicalAttributes`, `MentalAttributes`,
  `SpecialAttributes` grouping constants
- `src/system/karma/improvements/` — Karma-spend staging: `ImprovementStore` stages `ImprovementEntry` objects
  (attribute/skill raises, new skills, Qualities, Initiation/Submersion grades, etc.) plus cap and cost helpers;
  staged via the Spend Karma dialog (`src/components/runner/karma/`) and applied to `karma.log` on save — costs
  come from `ImprovementsConfig` (`src/components/improvements/improvementsConfig.ts`); see
  `docs/features/0010-spend-karma.md`
- `src/data/fixtures/` — Static runner fixtures (`artemis.ts`, `hexen.ts`)
- `src/data/migrations/` — Runner schema migration steps, registered in `src/data/migrations.ts`; shared
  `CharacterMigration<TInput, TOutput>` type lives in `src/data/characterMigration.ts` (name kept deliberately, see
  `CONTEXT.md`)
- `src/lib/` — Non-UI application code, split into:
  - `src/hooks/<feature>/` — Custom React hooks (`useXyz`), grouped by the same feature names as
    `src/components/`
  - `src/stores/<feature>/` — Redux Toolkit store slices (see "Architecture" above)
  - `src/contexts/<feature>/` — `createContext` definitions, kept together with their Provider component and
    accessor hook in one file per context
  - `src/lib/persistence/` — `RunnerManager`: loads, saves, migrates runners via `StorageManager` (plus `runnerId.ts`,
    `runnerIndex.ts`, `runnerLoadError.ts`); its context, `runnerManagerContext.tsx`, lives in
    `src/contexts/runner/`
  - `src/lib/storage/` — Pluggable persistence layer (`IStorageProvider` + `StorageManager`)
  - Generic utilities at the `src/lib/` root (`arrayUtils.ts`, `numberUtils.ts`, etc.) and `src/lib/errors/`
- `src/components/runner/` — Viewer (play-time) UI components; `runnerStoreProvider.tsx`
  (`src/components/runner/sheet/`) provides the per-runner `RunnerStore` via context
- `src/components/builder/` — Character creation/edit form (Builder; store-based); `builderStoreProvider.tsx`
  provides the builder store (`useBuilderStores` hook lives in `src/hooks/builder/useBuilderStores.ts`)
- `src/components/items/` — Generic item ("gear") infrastructure (see **Gear item forms & dialogs** below)
- `src/routes/` — TanStack file-based routes
- `src/integrations/` — Third-party integration wrappers: `reduxToolkit/` (`createCompatStore`, `useSelector`),
  `mui/`, `reselect/`, and the `tanstackDevtools/`, `tanstackForm/`, `tanstackPacer/`, `tanstackQuery/`,
  `tanstackRouter/` subdirs
- `src/components/ui/` — Reusable UI primitives (see `docs/ui/` for examples), including
  `src/components/ui/prototype/` for switching between in-progress UI variants (see `docs/ui/prototype.md` and the
  `.agents/skills/prototype/` skill). `Prototype` takes an explicit `versions: { key, name }[]` prop — selection is
  resolved via context at render time (not by walking the JSX tree), so `Prototype.Item version="key"` works from
  any depth, including inside components that only render later (e.g. one item per row in a `.map()`)
- `testUtils/` — Shared test helpers; `storage/memoryStorage.ts` implements `Storage` for unit tests
- `e2e/` — Playwright end-to-end specs (`playwright.config.ts` at repo root); visiting `/` seeds `localStorage`
  with the Artemis fixture (`#/data/fixtures/artemis.ts`) for tests to build on
- `docs/adr/` — Architecture Decision Records, including `0001-runner-data-not-character-sheet.md`
- `docs/features/` — Feature design docs (see `CONTRIBUTING.md` for the lifecycle)
- `env.node.ts` — Node-side env validation, alongside `src/env.ts` for client-side env vars

### Routing

File-based routing via TanStack Router. **Never edit `src/routeTree.gen.ts`** — it is auto-generated by the Vite plugin
on `yarn dev`/`yarn build`. Add new routes by creating files under `src/routes/`.

### Gear item forms & dialogs

Each item type lives under `src/components/items/types/<type>/` (`weapons`, `armor`, `implants`, `devices`,
`vehicles`, `licenses`) and follows a consistent three-layer pattern:

1. **`useXxxForm` hook** (`src/hooks/items/types/<type>/forms/useXxxForm.tsx`) — wraps `useAppForm` with
   type-specific default values and maps the flat form state back to the typed `XxxData`. Generic items use
   `useItemForm` (`src/hooks/items/forms/useItemForm.tsx`) directly.

2. **`XxxFormFields` component** (`src/components/items/types/<type>/forms/xxxFormFields.tsx`) — renders the fields
   for the form using `withFieldGroup`. Type-specific fields (e.g. weapon damage, firearm type) sit alongside the
   shared availability, source, description, and effects groups.

3. **`XxxFormDialog` component** (`src/components/items/types/<type>/dialogs/xxxFormDialog.tsx`) — combines the hook
   and fields into a `<Dialog>`, passing a `GearSubmitMeta` (`submitAction: "acquire" | "purchase" | "save"`) to
   `onSubmit`. Submit logic (the acquire / purchase / save decision) lives in
   `src/components/items/dialogs/itemFormDialog.tsx` — in builder context or edit mode it calls `onSave` directly; in
   viewer create mode it also withdraws nuyen on "purchase".

Each type's hook lives under `src/hooks/items/types/<type>/forms/` (e.g. `useWeaponForm.tsx`), while its fields
and dialog components stay under `src/components/items/types/<type>/` (e.g. `types/weapons/forms/weaponFormFields.tsx`,
`types/weapons/dialogs/weaponFormDialog.tsx`). Supporting utilities in `src/components/items/`:

- `dialogs/itemFormDialog.tsx` — centralises the builder-vs-viewer submit logic (see above)
- `gearSubmitMeta.ts` — the shared `GearSubmitMeta` type
- `card/gearItemCard.tsx` — shared display card used across gear list views
- `availability/availabilityChip.tsx` — `AvailabilityChip` for restricted/forbidden badges

Supporting hooks in `src/hooks/items/`:

- `gearHooks.ts` — `useGearByType()`, `useGearFilter()`, `searchGear()` reactive helpers

**Adding a new item type** — create `src/hooks/items/types/myItem/forms/useMyItemForm.tsx`,
`src/components/items/types/myItem/forms/myItemFormFields.tsx`, and
`src/components/items/types/myItem/dialogs/myItemFormDialog.tsx` following the weapons or implants examples.

## Character migrations

Migrations live in `src/data/migrations/` and are registered in `src/data/migrations.ts`. The shared
`CharacterMigration<TData>` type lives in `src/data/characterMigration.ts` — the `character` naming was
deliberately kept here through the `character` → `runner` rename (see `docs/adr/0001-runner-data-not-character-sheet.md`)
since renaming the type would have forced an edit into every migration file.

Migrations are timestamp-based. Each migration carries a `timestamp` — an ISO 8601 string set to its creation date
— instead of a sequential number. A `RunnerData`'s migration state is `_meta_.appVersion`: the **app version**
(`src/data/appVersion.ts`'s `APP_VERSION`, baked in at build time from the latest commit on the default branch, or
from the dev server's start time under `yarn dev`) as of the runner's most recent successful migration run.
`applyMigrations` (`src/data/applyMigrations.ts`) is the only place that decides whether a migration needs to run:
it filters the registered list down to `migration.timestamp > _meta_.appVersion` and only calls `up` on that
subset, in ascending `timestamp` order. Individual migrations don't check `_meta_` themselves — that would just
duplicate the same comparison in every file — they're plain, self-contained transforms. After running any pending
migrations, `_meta_.appVersion` is stamped to the live `APP_VERSION` and synced back to storage; a load that runs no
migrations leaves `_meta_.appVersion` untouched. Runners still carrying the old `_meta_.version` integer (from
before migrations moved to timestamps, capped at 32 — the last version registered under that scheme) are handled by
`resolveRunnerAppVersion`: a runner at version 32 (the common case — every runner opened since that version shipped
lands there) resolves directly to that migration's own timestamp, so it re-runs nothing; any other legacy version
(rare) is treated as fully unmigrated, so every registered migration re-runs once. That fallback is safe only
because every migration is idempotent — see the idempotency rule below.

**A CI check (`migration-timestamps` in `.github/workflows/ci.yml`) enforces that every new migration's `timestamp`
is newer than the base branch's latest commit** — see `.github/scripts/check-migration-timestamps.ts`. This is what
makes a new migration actually run once the app is deployed: a runner whose `_meta_.appVersion` is already at or
past the migration's `timestamp` would otherwise skip it forever (`migration.timestamp > _meta_.appVersion` would
never be true for that runner). It also guarantees that once a PR merges, the resulting build's `APP_VERSION` (the
new latest commit) is newer than every migration it introduced, so a runner's `_meta_.appVersion` never needs to
exceed the live app version to be considered fully migrated.

**Never edit an existing migration file.** Once a migration has been committed it may already have run against real
character data in user storage. Changing its logic would cause different behaviour on a re-run and could corrupt or
silently mis-migrate characters.

- **Schema changes always require a new migration** — when a `RunnerData` field is added, renamed, or removed,
  create a new migration file named `<date>_<seq>_describeChange.ts`, where `<date>` is the current UTC date
  formatted `YYYYMMDD` (e.g. `date -u +%Y%m%d`) and `<seq>` is a zero-padded two-digit counter starting at `00` for
  the first migration created that day, `01` for a second one the same day, and so on — for example
  `20260824_00_addFoo.ts`. Register it at the bottom of `migrations.ts`, and set `timestamp` on the migration object
  to the actual creation instant as an ISO 8601 string with a UTC offset (e.g. `"2026-08-24T15:30:00Z"`) — `<seq>`
  only disambiguates same-day filenames; it isn't part of the timestamp itself.
- **Earlier migrations may reference the old field name** — migrations that run before the rename migration can still
  reference the old field name because they operate on pre-rename data. Update them to handle *both* the old and new
  field names (e.g. `draft.oldField ?? draft.newField`) so they stay correct for runners that were already partially
  migrated.
- **New migration timestamps must sort after all existing ones** — migrations are applied in ascending `timestamp`
  order; the timestamp-prefixed file name keeps directory listings in the same order. `migrations.ts` throws at
  import time if a migration's `timestamp` doesn't sort strictly after the one declared before it.
- **Don't re-check `_meta_.appVersion` inside `up`** — `applyMigrations` already guarantees `up` is only called when
  the migration is actually pending.
- **Every migration must be idempotent** — a runner still carrying the legacy `_meta_.version` scheme re-runs *every*
  registered migration once (see above), so `up` must be a no-op the second time it's applied to data it's already
  transformed. Guard with a shape check (e.g. `??=`, or `continue`/`return` once the "already migrated" shape is
  detected) rather than assuming `up` only ever runs once per runner.
- **Add a matching `*.test.ts`** file for every new migration to document and verify the before/after shapes.

## Conventions

- **Path alias**: `#/` → `src/` (configured in `tsconfig.json` + `vite-tsconfig-paths`)
- **Path alias**: `#testUtils/*` → `testUtils/` (configured in `tsconfig.json`; use in unit tests)
- **`src/routeTree.gen.ts`** is auto-generated by the Vite plugin and must not be edited. Exclude it from formatter/lint
  runs (it's regenerated on dev/build).
- **All local imports must include the file extension** (`.ts` or `.tsx`):
  ```ts
  // ✅
  import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
  // ❌
  import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors"
  ```
- New client-side environment variables go in `src/env.ts` via `@t3-oss/env-core` with a `VITE_` prefix; import as
  `import { env } from "#/env.ts"`. A separate `env.node.ts` at the repo root covers Node-side tooling env vars.
- React Compiler is active (via `@vitejs/plugin-react-swc`'s `reactCompiler` transform) — avoid manual
  `useMemo`/`useCallback` unless the compiler can't handle the case.
- **Zod schemas**: pair runtime-validated data types with a `{TypeName}Schema` constant using
  `satisfies z.ZodType<Type>`:
  ```ts
  export const AdeptPowerDataSchema = z.object({ ... }) satisfies z.ZodType<AdeptPowerData>
  ```

- **Don't fabricate rulebook page citations.** A comment citing a specific page (e.g. `SR4A p.163`) is a claim that
  the page was checked, not a stylistic flourish — an invented one is worse than no citation at all.

- Quick verification workflow: after making code changes run `yarn fix` (this runs all project :fix scripts via
  `npm-run-all2`) to ensure formatting, linting, and types are clean before pushing.

## Testing conventions

Unit tests use the **Arrange / Act / Assert** (AAA) pattern. Each test body must have three labelled comment blocks:

```ts
it("does something", () => {
  // Arrange
  const sheet = makeSheet(...)

  // Act
  const { result } = renderHook(() => useMyHook(), { wrapper: makeWrapper(sheet) })

  // Assert
  expect(result.current).toBe(expected)
})
```

### Concurrent test execution

Vitest's `sequence.concurrent` defaults to `false` (`vite.config.ts`), so suites run sequentially unless a
`describe` block explicitly opts in with `describe.concurrent(...)`. Prefer opting a suite in when every `it`
inside it (including nested `describe`s, which inherit the parent's concurrency) is self-contained — each test
builds its own state in its own `// Arrange` step, per the AAA convention above, rather than reading a `let`
variable a `beforeEach` reassigns (a shared closure variable races across concurrently-running tests) or a
module-level singleton the tests mutate. `#/components/dice/diceTrayApi.test.ts` and `#/data/migrations.test.ts`
show the `beforeEach`-to-inline-Arrange refactor this requires.

Do **not** mark a suite concurrent when it:

- Renders via `@testing-library/react` (`render`/`renderHook`) — those tests query and tear down (`cleanup()`,
  `testUtils/renderUtils.tsx`) the single shared `document`, so interleaved tests corrupt each other's DOM.
- Uses `vi.useFakeTimers()`/`vi.setSystemTime()` — fake timers are a single global mock shared by every test in
  the file.
- Tests a module-level singleton where the test bodies intentionally chain off each other's mutations (e.g.
  `openOverlayTracker.test.ts`) rather than each arranging independent state.

## Code comments

Every comment in the codebase is one of three styles — **Documentation**, **Explanation**, or **Task**. Comments
that don't fit any style (or that mix them) should be rewritten or removed.

**Documentation** comments describe a class, function, or field

- MUST be `/**` JSDoc block immediately above the declaration
- MUST NOT refer to old versions of the code (no "used to be", "previously", "renamed from", "legacy" framing) —
  document what the code *is*, not its history. History belongs in commit messages, ADRs, or migration files.
- MUST NOT include implementation details — describe the contract (what it's for, inputs/outputs, invariants
  callers can rely on), not how the body is written internally. If the implementation changes, the doc shouldn't
  need to.
- SHOULD include a usage example when the usage isn't self-evident from the signature alone.

```ts
// ✅ — describes the contract, no history, no internals
/** Returns the karma cost to raise `skill` from its current rating to `targetRating`. */
export const skillRaiseCost = (skill: ActiveSkill, targetRating: number): number => { ... }

// ❌ — refers to an old version of the code
/** Computes the raise cost. Replaces the old flat-rate formula from before the karma rework. */

// ❌ — implementation detail instead of contract
/** Loops over each rating band and sums the per-band cost. */
```

**Explanation** comments describe a line or block of code:

- MUST use an inline `//` above or beside it
- MUST NOT explain what the code does — if the code needs a line-by-line narration, prefer making the code clearer
  (better names, extracted helper) over commenting it.
- MUST explain *why* the code is there and what problem it fixed — the non-obvious reason the line exists in the
  form it does.
- SHOULD reference a GitHub issue when one exists.

```ts
// ✅ — explains why, references the issue
// Round half-away-from-zero: SR4A rules round karma costs up, and Math.round rounds
// .5 toward +Infinity which breaks negative adjustments. See #123.
const cost = roundHalfAwayFromZero(rawCost)

// ❌ — narrates what the line does
// Round the cost to the nearest integer
const cost = roundHalfAwayFromZero(rawCost)
```

**Task** comments (`// TODO` / `// FIXME`) flag outstanding work or a known defect at the line they sit on:

- MUST use an inline `// TODO:` (planned work not yet done) or `// FIXME:` (known defect in code that already
  ships) prefix, above or beside the line it concerns.
- MUST state what's outstanding, specifically enough that someone other than the author could act on it without
  asking. "TODO: fix this" isn't specific enough.
- SHOULD reference a GitHub issue when the task is non-trivial enough to track independently of the comment itself.
- MUST NOT be used to narrate finished work, or as a substitute for an Explanation comment justifying why the
  current code is correct as written — a Task comment marks something that still needs doing, not something that's
  done and merely worth knowing about.

```ts
// ✅ — specific about what's outstanding, references the issue
// TODO: apply GameEffects to attribute values once #145 lands
export const selectValue = selectBase

// ✅ — flags a known defect, not just a stylistic gripe
// FIXME: doesn't account for leap years — see #211
const daysUntil = (date: Date) => Math.floor((date.getTime() - Date.now()) / MS_PER_DAY)

// ❌ — too vague to act on
// TODO: fix this later
```

**Exemptions** — these don't need to fit any style:

- The `// Arrange` / `// Act` / `// Assert` labels required by "Testing conventions" above — they're structural
  section labels, not documentation or explanation.
- Tool directives such as `// eslint-disable-next-line` or `// @ts-expect-error` — they instruct tooling, not
  readers.

## Type assertions

**Never use `as unknown as T`** (the double type assertion pattern). This two-step cast bypasses TypeScript's structural
checks entirely and hides real type incompatibilities.

- If two types are structurally compatible, a single `as T` assertion is enough.
- If a function or component needs to accept many concrete subtypes (e.g. `ArmorData`, `WeaponData`), export a shared
  alias using `any` in a targeted type position and document it:
  ```ts
  // ✅ — one explicit any in a named alias; no assertion at call sites
  export type AnyItemForm = AppFieldExtendedReactFormApi<any, …, GearSubmitMeta, any, any>

  // ❌ — hides the incompatibility
  form={form as unknown as ItemForm}
  ```

## MUI style props

Only specify MUI style props, variants, and layout values when **explicitly deviating from the theme defaults**. Do not
pass props that merely repeat a default — if the theme already sets `gap`, `padding`, `fontSize`, `variant`,
`size`, `color`, etc., omitting the prop produces the same result and keeps the code easier to read.

```tsx
// ✅ — no padding/gap props; theme defaults apply
<Stack>…</Stack>

// ✅ — intentionally overrides the default gap for a tighter list
<Stack gap={0.5}>…</Stack>

// ❌ — just repeats the theme default, adds noise
<Stack gap={2} variant="outlined">…</Stack>
```

This rule applies to every MUI component: `Stack`, `Paper`, `Typography`, `Button`, `TextField`, `Chip`, etc. When in
doubt, omit the prop and let the theme do the work.

## UI changes

Whenever a task involves changes to the visual appearance or layout of a component (new UI, updated styles, added
controls, rearranged sections), **always include screenshots** of the affected area, captured in **both** a desktop
viewport and a Pixel 8 viewport (412×915, as used by Chrome DevTools device emulation). Take the screenshots after
the dev server is running (`yarn dev`) and the change is visible in the browser. Capture the smallest region that
clearly shows the new state in each viewport. Do not include screenshots in the git commit.

Screenshots only need to reach the reviewer in chat, not the PR — send the actual image files back in your response
(not a description of them, and not an offer to attach them if wanted) so they render inline for the user
immediately. GitHub tooling generally has no way to upload binary image data into a PR comment (no attachment- or
asset-upload endpoint, and GitHub strips `data:` URIs from rendered comment markdown), so don't try to embed them
there.

Instead, put a link to the chat session in the PR description (or a comment) so reviewers who weren't in the
session can find the screenshots. Most sessions expose this as a session URL alongside your other instructions —
use that; if none is available, say in the PR that screenshots were shared in the originating chat session and are
not attached here.

- Don't use short or ambiguous variable names. Prefer descriptive identifiers (for example `characterHealth` instead of
  `hp`, `damageThreshold` instead of `dt`). Short names are acceptable only for well-known conventions (`id`, `ok`,
  `vs`) or in tiny local scopes where a longer name reduces clarity.
- One React component per `.tsx` file. Every component — including small internal helpers — must have its own file. Do *
  *not** define a second named component in the same file, even if it is only used by the component in that file.
- Prefer functional React components using a named exported const with an explicit props interface (e.g.
  `export const Header: FC<Props> = ({ ... }) => { ... }`). Avoid class components and default anonymous exports.

## Formatting and tooling

- ESLint + @stylistic for formatting. 2 spaces indentation, double quotes for JS/TS strings.
- Use the `#/` alias instead of parent-relative (`../`) paths — ESLint auto-enforces this via
  `@dword-design/import-alias/prefer-alias`. Sibling-relative (`./`) imports within the same directory are also
  permitted.
- After making changes, verify with `yarn fix` (auto-fix lint/format). Must pass before a change is complete.

## Redux Toolkit store patterns

Stores (`RunnerStore`, `BuilderStore`, `DiceRoller`, `DialogCtrl`, `ImprovementStore`, `DiceTrayApi`) are
`configureStore` instances, created via `createCompatStore` (`src/integrations/reduxToolkit/compatStore.ts`) — a thin
wrapper exposing `get`/`state`/`setState`/`subscribe` alongside `dispatch`/`getState`. Domain stores (`RunnerStore`,
`BuilderStore`) back it with a combined reducer (dispatchable actions/`createAsyncThunk` thunks); ad hoc UI-state
stores (`DiceRoller`, `DialogCtrl`, etc.) omit the reducer and are only ever written through `setState`.

- **Store objects are stable** — do not re-create store instances on every render. Use `useMemo` or module-level
  singletons.
- **Reactivity requires `useSelector`** — reading directly off a store instance (e.g. `store.state.foo` or
  `store.get()`) gives a snapshot and will not trigger re-renders. Always use
  `useSelector(store, selector)` (`src/integrations/reduxToolkit/useSelector.ts`) for reactive reads:
  ```ts
  // ✅ reactive
  const max = useSelector(edgeStore, (state) => state.max)

  // ❌ snapshot only — stale after first render
  const max = edgeStore.state.max
  ```
- For the `RunnerStore`/`BuilderStore` domain stores specifically, prefer `useRunnerStoreSelector`/
  `useBuilderStoreSelector` (which wrap the same hook) over reaching into `store` directly, and dispatch through
  `useRunnerStoreDispatch()`/`useBuilderStoreDispatch()` rather than calling `store.setState()` — that keeps writes
  going through the domain reducers instead of bypassing them.
- `@tanstack/react-store`'s `useSelector` is scoped to reading `@tanstack/react-form`'s own internal form stores
  (`form.store`, `form.baseStore`, a field group's `.store`) — never for our own stores.

## MUI v9 CSS variables

- `colorSchemeSelector: "data"` is active. Palette callbacks like `(t) => t.palette.background.paper` return static hex
  values, not CSS variables — they will not respond to theme/color-scheme changes.
- Use CSS variable strings directly for theme-responsive styles: `"var(--mui-palette-background-paper)"`.
- For opacity tints use channel variables: `"rgba(var(--mui-palette-error-mainChannel) / 0.15)"`.

## Dialog patterns

- Prefer the `useDialog<TReturn, TProps>(render)` + `use*Dialog` hook pattern for new dialogs: the hook calls
  `useDialog<TReturn, TProps>((ctrl, props) => <FooDialog ctrl={ctrl} {...props} />)` and returns `{ open, outlet }`.
  There is no provider and no global registry — the caller must render the returned `outlet` node once, typically right
  next to whatever trigger calls `open(props)`:
  ```tsx
  const { open, outlet } = useAddKarmaDialog()

  return (
    <>
      <Button onClick={() => open()}>Add Karma</Button>
      {outlet}
    </>
  )
  ```
  Because dialogs render at the caller's real tree position, React context (including
  `RunnerStoreProvider`) propagates normally with no special provider scoping to get right. See `useAddKarmaDialog`
  and `useWeaponFormDialog` for minimal examples.
- `useDialog` remounts its rendered content fresh on every `open(props)` call (an internal key bump), matching the old
  `DialogApi` behavior of a brand-new instance per call — see the "TanStack Form" note below for why this matters.
- Use `useConfirmDialog()` from `#/components/ui/dialog/confirmDialog.tsx` for confirmation prompts before destructive
  actions — it returns `{ confirm, dialog }`; render `dialog` alongside the trigger the same as any other `use*Dialog`
  hook.
- Use the compound `Dialog` component from `#/components/ui/dialog/dialog.tsx` for all new dialogs — it enforces
  consistent sizing. Reach for `ControlledDialog` (wires `ctrl` automatically) for the common case, or
  `useDialogProps(ctrl)` spread onto raw `Dialog` when you need more manual control over `onClose`/`onClosed`. See
  `docs/ui/dialog.md` for examples.
- See `docs/adr/0004-dialog-api-goes-local-only.md` for why the old `DialogApi`/`DialogApiProvider` pattern was
  removed.

## TanStack Form

- `defaultValues` are frozen at first mount — the form does not reset when props change. `useDialog`-based dialogs
  remount fresh on every `open(props)` call, so this is a non-issue for them. It only matters for hand-rolled inline
  `useState` dialogs that don't go through `useDialog` (e.g. `SpiritList`) — add `key={item?.id ?? "new"}` to the
  dialog element so it remounts (and re-initializes the form) when the target item changes.
- When the form's `onSubmit` is wired to a button, wrap it: `onClick={() => form.handleSubmit()}` rather than
  `onClick={form.handleSubmit}` to avoid forwarding the click event.

## Version control

- The default branch is `origin/shadowrun-4e` — **not** `origin/main`
- Do not commit or push — leave that to the user (this applies to local/interactive sessions; a remote session with
  its own push/PR instructions follows those instead)
- **Remote environment PR workflow**: when running in a remote environment and opening a pull request, after
  pushing, request a review from `@CptnFizzbin` and mark the PR as ready for review (not left as draft)

## Fallow (codebase health)

Use the `fallow` skill to audit dead code, duplication, and complexity. Use the provided skill to run the full suite of
checks and auto-fixes, then review the JSON output for any issues that need attention. Always run the dead code check
after making changes to verify that no unused exports, files, or types were introduced or left behind.

```bash
# Full health report
yarn fallow --format json

# Dead code only (unused exports, files, types)
yarn fallow dead-code --format json

# Code duplication
yarn fallow dupes --format json

# Complexity hotspots
yarn fallow health --format json

# Preview what auto-fix would remove, then apply
yarn fallow fix --dry-run --format json
yarn fallow fix --yes --format json
```

- **Always `--dry-run` before `fix`**, then `fix --yes` to apply (required in non-TTY agent environments)
- **Always run `yarn fallow dead-code --format json` after making code changes** to verify that no dead code, unused
  exports, or unused types were introduced or left behind.
- When the issues list reports open GitHub issues referencing Fallow findings, run `yarn fallow` to verify whether those
  findings have been resolved by the current change
- See `.agents/skills/fallow/SKILL.md` for the full command reference

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `CptnFizzbin/shadow-sin`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See
`docs/agents/triage-labels.md`.

### Domain docs

Single-context repo — `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`. `docs/adr/`
currently holds 4 ADRs, notably `0001-runner-data-not-character-sheet.md` (the `Character`→`Runner` rename this
document assumes). Open design problems for in-progress features live in `docs/features/`.

### Skills inventory

`.agents/skills/` — `fallow` (dead code/duplication/complexity audit, above), `prototype` (switchable in-app UI
variants — see `docs/ui/prototype.md`), `grill-me` / `grill-with-docs` (Socratic design review before committing to
a plan), `handoff` (conversation compaction), `to-issues` / `to-prd` (turn a plan into GitHub Issues or a feature
PRD), `write-a-skill` (authoring new skills), `setup-matt-pocock-skills` (wires up `docs/agents/`).
