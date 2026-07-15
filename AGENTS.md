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
yarn fix          # Runs all "*:fix" scripts (npm-run-all) — auto-fix lint/format steps
yarn lint         # Runs all lint tasks (eslint checks via npm-run-all)
yarn eslint       # Run ESLint against src (check or write via :lint/:fix variants)
yarn tsc          # TypeScript type check via tsgo (@typescript/native-preview), no emit
yarn fallow       # Run Fallow codebase analysis (dead code, duplication, complexity)
```

## Architecture

Runner state (`RunnerData`) lives in a Redux Toolkit store — not React state or Context values directly. Each domain
(`attributes`, `biology`, `karma`, `skills`, etc., under `src/stores/runner/<domain>/`) follows a three-file pattern:
`*Slice.actions.ts` (RTK `createAction`/`createAsyncThunk`), `*Slice.ts` (RTK `createReducer`), and
`*Slice.selectors.ts` (plain selector functions). `src/stores/runner/runnerStore.reducer.ts` combines them with RTK's
`combineReducers`. A store instance is created per runner (`RunnerDataStore`, `src/components/runner/sheet/runnerDataStore.ts`)
and provided through React context via `RunnerStoreProvider`. Components subscribe reactively via
`useRunnerStoreSelector(selector)` (`src/stores/runner/runnerStore.selectors.ts`) and dispatch via
`useRunnerStoreDispatch()` (`src/stores/runner/runnerStore.dispatch.ts`) — never read `store.state`/`store.get()`
directly in a component (see "Redux Toolkit store patterns" below). The Builder flow mirrors this with its own
`BuilderState` store (`src/stores/builder/`).

The `$runnerId.tsx` route subscribes to store changes via `store.subscribe()` and immediately persists to
`runnerManager.save()` on every update (no dedicated persistence component).

The root domain type is `RunnerData` — see `docs/adr/0001-runner-data-not-character-sheet.md` for the
`character` → `runner` rename; the old naming deliberately survives only in the migration subsystem and
localStorage key literals.

### Key directories

- `src/system/` — All domain types; `RunnerData` is the root, in `runnerData.ts`
- `src/system/gear/` — Gear sub-types keyed by `ItemType` enum
- `src/system/magic/` — Magic sub-types: `spellData.ts`, `adeptPowerData.ts`, `complexFormData.ts`,
  `spriteData.ts`, `traditionData.ts`, etc.
- `src/system/gameEffects/` — `GameEffectData` and related types; effects attach to gear items via
  `ItemData.effects`
- `src/system/attributeKey.ts` — `AttributeKey` enum + `PhysicalAttributes`, `MentalAttributes`,
  `SpecialAttributes` grouping constants
- `src/system/karma/improvements/` — Post-chargen advancement: `ImprovementStore` stages `ImprovementEntry` objects
  (attribute/skill raises, new skills, spells, etc.) plus cap and cost helpers; staged via the Spend Karma dialog
  (`src/components/runner/karma/`) and applied to `karma.log` on save — see `docs/features/0010-spend-karma.md`
- `src/system/dice/` — `DiceRoller`; paired with `src/components/dice/` (`DiceTrayApi`) for the in-app dice tray
- `src/data/fixtures/` — Static runner fixtures; `artemis.ts` is the primary example
- `src/data/migrations/` — Schema migration steps (`CharacterMigration<TInput, TOutput>`, from `characterMigration.ts`)
- `src/lib/storage/` — Pluggable persistence layer (`IStorageProvider` + `StorageManager`)
- `src/runner/runnerManager.ts` — `RunnerManager`: loads, saves, migrates runners via `StorageManager`
- `src/components/runner/` — Runner sheet (Viewer) UI components; `runnerStoreProvider.tsx` provides the
  per-runner `RunnerStore` via context
- `src/components/builder/` — Character creation/edit form (Builder; store-based)
- `src/components/items/` — Generic gear infrastructure (see **Gear item forms & dialogs** below)
- `src/routes/` — TanStack file-based routes
- `src/integrations/` — Cross-cutting integration glue: `reduxToolkit/` (`createCompatStore`, `useSelector`),
  `mui/`, `reselect/`, and TanStack Query/Form/Router/Pacer/Devtools setup
- `src/components/ui/` — Reusable UI primitives (see `docs/ui/` for examples, including `Dialog` and `Prototype`)
- `testUtils/` — Shared test helpers; `storage/memoryStorage.ts` implements `Storage` for unit tests
- `e2e/` — Playwright end-to-end specs (`playwright.config.ts` at repo root); visiting `/` seeds `localStorage`
  with the Artemis fixture (`#/data/fixtures/artemis.ts`) for tests to build on
- `docs/adr/` — Architecture Decision Records, including `0001-runner-data-not-character-sheet.md`
- `docs/features/` — Feature design docs (see `CONTRIBUTING.md` for the lifecycle)

### Routing

File-based routing via TanStack Router. **Never edit `src/routeTree.gen.ts`** — it is auto-generated by the Vite plugin
on `yarn dev`/`yarn build`. Add new routes by creating files under `src/routes/`.

### Gear item forms & dialogs

Each gear type follows a consistent three-layer pattern:

1. **`useXxxForm` hook** (`forms/useXxxForm.tsx`) — wraps `useAppForm` with type-specific default values and maps the
   flat form state back to the typed `XxxData`. Generic items use `useItemForm` directly.

2. **`XxxFormFields` component** (`forms/xxxFormFields.tsx`) — renders the fields for the form using
   `withFieldGroup`. Type-specific fields (e.g. weapon damage, firearm type) sit alongside the shared availability,
   source, description, and effects groups.

3. **`XxxFormDialog` component** (`dialogs/xxxFormDialog.tsx`) — combines the hook and fields into a
   `<Dialog>`, passing a `GearSubmitMeta` (`submitAction: "acquire" | "purchase" | "save"`) to `onSubmit` so the
   caller can decide whether to withdraw nuyen.

Each type's files live under `src/components/items/types/<type>/` (e.g. `types/weapons/forms/useWeaponForm.tsx`,
`types/weapons/forms/weaponFormFields.tsx`, `types/weapons/dialogs/weaponFormDialog.tsx`). Supporting utilities in
`src/components/items/`:

- `gearSubmitMeta.ts` — the shared `GearSubmitMeta` type
- `gearHooks.ts` — `useGearByType()`, `useGearFilter()`, `searchGear()` reactive helpers
- `card/gearItemCard.tsx` — shared display card used across gear list views
- `availability/availabilityChip.tsx` — `AvailabilityChip` for restricted/forbidden badges

**Adding a new item type** — create `types/myItem/forms/useMyItemForm.tsx`, `types/myItem/forms/myItemFormFields.tsx`,
and `types/myItem/dialogs/myItemFormDialog.tsx` following the weapons or implants examples.

## Character migrations

Migrations live in `src/data/migrations/` and are registered in `src/data/migrations.ts`. The shared
`CharacterMigration<TInput, TOutput>` type lives in `src/data/characterMigration.ts` — the `character` naming was
deliberately kept here through the `character` → `runner` rename (see `docs/adr/0001-runner-data-not-character-sheet.md`)
since renaming the type would have forced an edit into every migration file.

**Never edit an existing migration file.** Once a migration has been committed it may already have run against real
character data in user storage. Changing its logic would cause different behaviour on a re-run and could corrupt or
silently mis-migrate characters.

- **Schema changes always require a new migration** — when a `RunnerData` field is added, renamed, or removed,
  create a new migration file with a date-prefixed name (e.g. `YYYYMMDD_describeChange.ts`) and register it at the
  bottom of `migrations.ts`.
- **Earlier migrations may reference the old field name** — migrations that run before the rename migration can still
  reference the old field name because they operate on pre-rename data. Update them to handle *both* the old and new
  field names (e.g. `draft.oldField ?? draft.newField`) so they stay correct for runners that were already partially
  migrated.
- **New migration IDs must sort after all existing IDs** — migrations are applied in ascending string order by `id`.
  Using an ISO date prefix (without separators, e.g. `"20260510"`) keeps ordering unambiguous.
- **Add a matching `*.test.ts`** file for every new migration to document and verify the before/after shapes.

## Conventions

- **Path alias**: `#/` → `src/` (configured in `tsconfig.json` + `vite-tsconfig-paths`)
- **Path alias**: `#testUtils/*` → `testUtils/` (configured in `tsconfig.json`; use in unit tests)
- **`src/routeTree.gen.ts`** is auto-generated by the Vite plugin and must not be edited. Exclude it from formatter/lint
  runs (it's regenerated on dev/build).
- **All local imports must include the file extension** (`.ts` or `.tsx`):
  ```ts
  // ✅
  import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
  // ❌
  import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider"
  ```
- New client-side environment variables go in `src/env.ts` via `@t3-oss/env-core` with a `VITE_` prefix; import as
  `import { env } from "#/env.ts"`. A separate `env.node.ts` at the repo root covers Node-side tooling env vars.
- `babel-plugin-react-compiler` is active — avoid manual `useMemo`/`useCallback` unless the compiler can't handle the
  case.
- **Zod schemas**: pair runtime-validated data types with a `{TypeName}Schema` constant using
  `satisfies z.ZodType<Type>`:
  ```ts
  export const AdeptPowerDataSchema = z.object({ ... }) satisfies z.ZodType<AdeptPowerData>
  ```

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
controls, rearranged sections), **always include at least one screenshot** of the affected area in your PR or summary.
Take the screenshot after the dev server is running (`yarn dev`) and the change is visible in the browser. Capture the
smallest region that clearly shows the new state. Attach the image as part of your response or PR description so
reviewers can quickly verify the visual result without running the app locally. Do not include screenshots in the git
commit

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
  `useDialog<TReturn, TProps>((ctrl, props) => <FooDialog ctrl={ctrl} {...props} />)` and returns `{ open, dialog }`.
  There is no provider and no global registry — the caller must render the returned `dialog` node once, typically right
  next to whatever trigger calls `open(props)`:
  ```tsx
  const { open, dialog } = useAddKarmaDialog()

  return (
    <>
      <Button onClick={() => open()}>Add Karma</Button>
      {dialog}
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
- Do not commit or push — leave that to the user

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

Single-context repo — `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Other skills

`.agents/skills/` also has: `fallow` (codebase health, above), `prototype` (throwaway UI/logic prototypes — see
`docs/ui/prototype.md` for the `Prototype` component it produces), `grill-me` / `grill-with-docs` (interrogate a plan
before committing to it), `handoff` (conversation compaction), `to-issues` / `to-prd` (turn a plan into GitHub Issues
or a feature PRD), and `write-a-skill` (authoring new skills).
