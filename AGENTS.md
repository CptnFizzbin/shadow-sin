# AGENTS.md — ShadowSIN

A **Shadowrun 4th Edition character sheet** SPA: React 19 + TanStack Router + Redux Toolkit + MUI v9.

This file holds the rules and conventions that rarely change. For anything that moves with the code — file
locations, store and hook names, directory layout — follow the pointers below to the current source of truth
rather than relying on memory or older copies of this file.

## Where to look

| For | Look at |
|---|---|
| Domain terms (Runner, Item vs Gear, Viewer/Builder/Editor, ...) | [`CONTEXT.md`](./CONTEXT.md) — use its terms consistently in code, comments, and docs |
| How features, Issues, and ADRs relate | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |
| Where a file belongs in `src/` | `docs/features/0017-top-level-directory-restructuring.md` → "Container definitions" |
| Why the code is shaped the way it is | `docs/adr/` — read the ADRs touching the area you're working in |
| In-progress feature designs | `docs/features/` |
| Available scripts | `package.json` → `scripts` |
| UI primitive usage (dialogs, prototypes, ...) | `docs/ui/` |
| Agent skills | `.agents/skills/CLAUDE.md` (index; skills are vendored and pinned in `skills-lock.json`) |
| Existing code patterns | The code itself — find a sibling that does what you need (e.g. the weapons item type) and follow it |

## Commands

The scripts you'll need most (full list in `package.json`):

```bash
yarn dev      # dev server on :3000
yarn test     # Vitest unit tests (run once)
yarn fix      # auto-fix lint/format and type-check — must pass before a change is complete
yarn fallow   # codebase health analysis (see "Fallow" below)
```

## Architecture principles

- Runner state lives in a Redux Toolkit store, not in React state or Context values. The store's shape, how it's
  created, and its selector/dispatch hooks are defined under `src/state/` (see `docs/adr/0016-unify-redux-state.md`).
- Components read state reactively through a selector hook and write through dispatched actions, so every write goes
  through the domain reducers. Never read a store snapshot (`getState()` or equivalent) in a component — it won't
  re-render when the state changes.
- Store instances are stable — never re-create one on every render.
- Small ad hoc UI stores wrap `configureStore` via the compat-store helper in `src/integrations/reduxToolkit/`; read
  them with that folder's `useSelector(store, selector)`. `@tanstack/react-store`'s `useSelector` is only for
  `@tanstack/react-form`'s own internal form stores — never for ours.
- The root domain type is `RunnerData`. The older `character` naming deliberately survives only in the migration
  subsystem and localStorage key literals — see `docs/adr/0001-runner-data-not-character-sheet.md`.
- File-based routing via TanStack Router. **Never edit `src/routeTree.gen.ts`** — the Vite plugin regenerates it on
  `yarn dev`/`yarn build`. Add routes by creating files under `src/routes/`.

## Character migrations

Migrations are registered in `src/data/migrations.ts`; `src/data/applyMigrations.ts` decides which ones run (every
migration whose `timestamp` is newer than the runner's `_meta_.sinVersion`, in ascending order). Read both before
adding one.

**Never edit an existing migration file.** Once committed, it may already have run against real character data in
user storage; changing its logic would behave differently on a re-run and could corrupt or silently mis-migrate
characters.

- **Schema changes always require a new migration** — whenever a `RunnerData` field is added, renamed, or removed.
- **Naming:** `<date>_<seq>_describeChange.ts`, where `<date>` is the current UTC date as `YYYYMMDD`
  (`date -u +%Y%m%d`) and `<seq>` is a two-digit counter for that day starting at `00` (e.g. `20260824_00_addFoo.ts`).
  Register it at the bottom of `migrations.ts`.
- **Timestamp:** set `timestamp` to the actual creation instant as an ISO 8601 string with a UTC offset (e.g.
  `"2026-08-24T15:30:00Z"`). It must sort after every existing migration — `migrations.ts` throws at import time
  otherwise, and CI (`migration-timestamps`) rejects a timestamp that isn't newer than the base branch's latest, since
  such a migration would never run for already-migrated runners.
- **Every migration must be idempotent** — runners from the pre-timestamp versioning scheme can re-run every
  registered migration once. Guard with a shape check (`??=`, or return early once the migrated shape is detected).
- **Don't re-check `_meta_.sinVersion` inside `up`** — `applyMigrations` already only calls `up` when it's pending.
- **Earlier migrations may see either field name** — when a migration renames a field, update earlier migrations to
  handle both (`draft.oldField ?? draft.newField`) so partially migrated runners stay correct.
- **Add a matching `*.test.ts`** for every new migration, documenting the before/after shapes.

## Conventions

- **Path aliases**: `#/` → `src/`, `#testUtils/*` → `testUtils/` (in unit tests). Use `#/` instead of parent-relative
  (`../`) imports — ESLint enforces this. Sibling-relative (`./`) imports within a directory are fine.
- **All local imports include the file extension** (`.ts` or `.tsx`):
  ```ts
  // ✅
  import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
  // ❌
  import { useRunnerSelector } from "#/state/runner/runnerStore.selectors"
  ```
- New client-side environment variables go in `src/env.ts` via `@t3-oss/env-core` with a `VITE_` prefix; import as
  `import { env } from "#/env.ts"`. `env.node.ts` at the repo root covers Node-side tooling env vars.
- React Compiler is active — avoid manual `useMemo`/`useCallback` unless the compiler can't handle the case (e.g.
  keeping a store instance stable).
- **Zod schemas**: pair runtime-validated data types with a `{TypeName}Schema` constant using
  `satisfies z.ZodType<Type>`:
  ```ts
  export const AdeptPowerDataSchema = z.object({ ... }) satisfies z.ZodType<AdeptPowerData>
  ```
- **Don't fabricate rulebook page citations.** A comment citing a specific page (e.g. `SR4A p.163`) is a claim that
  the page was checked — an invented one is worse than no citation at all.
- Use descriptive identifiers (`characterHealth`, not `hp`; `damageThreshold`, not `dt`). Short names are fine only for
  well-known conventions (`id`, `ok`, `vs`) or tiny local scopes.
- One React component per `.tsx` file — including small internal helpers.
- Functional components as a named exported const with an explicit props interface
  (`export const Header: FC<Props> = ({ ... }) => { ... }`). No class components or default anonymous exports.
- Formatting is ESLint + @stylistic: 2-space indentation, double quotes for JS/TS strings. Run `yarn fix` after
  changes.

## Testing conventions

Unit tests use the **Arrange / Act / Assert** (AAA) pattern, with three labelled comment blocks in each test body:

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

Suites run sequentially unless a `describe` opts in with `describe.concurrent(...)`. Opt in when every test inside
(including nested `describe`s, which inherit it) builds its own state in its own `// Arrange` step — not from a `let`
that a `beforeEach` reassigns, or a module-level singleton the tests mutate. Do **not** mark a suite concurrent when
it:

- Renders via `@testing-library/react` (`render`/`renderHook`) — those tests share and tear down the single
  `document`, so interleaved tests corrupt each other's DOM.
- Uses `vi.useFakeTimers()`/`vi.setSystemTime()` — fake timers are one global mock shared by the whole file.
- Tests a module-level singleton where the tests intentionally chain off each other's mutations.

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

## MUI

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

This applies to every MUI component: `Stack`, `Paper`, `Typography`, `Button`, `TextField`, `Chip`, etc. When in
doubt, omit the prop and let the theme do the work.

`colorSchemeSelector: "data"` is active, so palette callbacks like `(t) => t.palette.background.paper` return static hex
values that won't respond to color-scheme changes. Use CSS variable strings instead:
`"var(--mui-palette-background-paper)"`, and channel variables for opacity tints:
`"rgba(var(--mui-palette-error-mainChannel) / 0.15)"`.

## Dialogs and forms

- New dialogs use a `use*Dialog` hook built on `useDialog`, which returns `{ open, outlet }`. There is no provider or
  global registry — render the returned `outlet` once, next to whatever calls `open(props)`. Keep the returned object
  named rather than destructuring it:
  ```tsx
  const addKarmaDialog = useAddKarmaDialog()

  return (
    <>
      <Button onClick={() => addKarmaDialog.open()}>Add Karma</Button>
      {addKarmaDialog.outlet}
    </>
  )
  ```
  Because dialogs render at the caller's real tree position, React context propagates normally. See
  `docs/ui/dialog.md` for the `Dialog`/`ControlledDialog` components and confirmation prompts, and
  `docs/adr/0004-dialog-api-goes-local-only.md` for the rationale.
- `useDialog` remounts its content fresh on every `open(props)` call, so each open gets a brand-new form.
- TanStack Form's `defaultValues` are frozen at first mount — the form doesn't reset when props change. For a
  hand-rolled dialog that doesn't go through `useDialog`, add `key={item?.id ?? "new"}` to the dialog element so it
  remounts when the target item changes.
- Wire submit buttons as `onClick={() => form.handleSubmit()}`, not `onClick={form.handleSubmit}`, to avoid
  forwarding the click event.
- Gear item types each follow a three-layer pattern — a `useXxxForm` hook, an `XxxFormFields` component, and an
  `XxxFormDialog` — with the acquire/purchase/save submit decision centralised in the shared item form dialog. When
  adding a type, copy the structure of an existing one (e.g. weapons: `useWeaponForm`, `WeaponFormFields`,
  `WeaponFormDialog`).

## UI changes

Whenever a task changes the visual appearance or layout of a component (new UI, updated styles, added controls,
rearranged sections), **always include screenshots** of the affected area, captured in **both** a desktop viewport and
a Pixel 8 viewport (412×915, as used by Chrome DevTools device emulation). Take them with the dev server running
(`yarn dev`) and the change visible, capturing the smallest region that clearly shows the new state. Do not include
screenshots in the git commit.

Screenshots only need to reach the reviewer in chat, not the PR — send the actual image files back in your response (not
a description of them, and not an offer to attach them if wanted) so they render inline for the user
immediately. GitHub tooling generally has no way to upload binary image data into a PR comment (no attachment- or
asset-upload endpoint, and GitHub strips `data:` URIs from rendered comment markdown), so don't try to embed them
there.

Instead, put a link to the chat session in the PR description (or a comment) so reviewers who weren't in the
session can find the screenshots. Most sessions expose this as a session URL alongside your other instructions —
use that; if none is available, say in the PR that screenshots were shared in the originating chat session and are
not attached here.

## Fallow (codebase health)

Use the `fallow` skill (`.agents/skills/fallow/SKILL.md` has the full command reference) to audit dead code,
duplication, and complexity. After making code changes, run `yarn fallow dead-code --format json` to verify that no
unused exports, files, or types were introduced or left behind. When applying auto-fixes, run `yarn fallow fix
--dry-run --format json` first, then `yarn fallow fix --yes --format json` (`--yes` is required in non-TTY agent
environments). When open GitHub issues reference Fallow findings, run `yarn fallow` to check whether the current
change resolves them.

## Version control

- The default branch is `origin/shadowrun-4e` — **not** `origin/main`
- Do not commit or push — leave that to the user (this applies to local/interactive sessions; a remote session with
  its own push/PR instructions follows those instead)
- **Remote environment PR workflow**: when running in a remote environment and opening a pull request, after
  pushing, request a review from `@CptnFizzbin` and mark the PR as ready for review (not left as draft)

## Agent skills

- **Issue tracker:** GitHub Issues on `CptnFizzbin/shadow-sin` — see `docs/agents/issue-tracker.md`.
- **Triage labels:** `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix` — see
  `docs/agents/triage-labels.md`.
- **Domain docs:** single-context repo (`CONTEXT.md` and `docs/adr/` at the root) — see `docs/agents/domain.md`.
- **Skills:** `.agents/skills/CLAUDE.md` indexes every skill in `.agents/skills/`.
