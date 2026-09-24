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

- Runner state lives in a Redux Toolkit store, not in React state or Context values — see `src/state/AGENTS.md`.
- The root domain type is `RunnerData`. The older `character` naming deliberately survives only in the migration
  subsystem and localStorage key literals — see `docs/adr/0001-runner-data-not-character-sheet.md`.
- **Never edit `src/routeTree.gen.ts`** — the TanStack Router Vite plugin regenerates it on `yarn dev`/`yarn build`.

## Directory-specific instructions

Rules that only apply to one part of the tree live in an `AGENTS.md` next to that code (each with a sibling
`CLAUDE.md` that imports it). Read the one for the area you're changing:

| File | Covers |
|---|---|
| `src/state/AGENTS.md` | The Redux store: shape, writes, ad hoc stores |
| `src/data/AGENTS.md` | Runner schema migrations |
| `src/routes/AGENTS.md` | File-based routing |
| `src/components/AGENTS.md` | React components: reading state, MUI, dialogs and forms |
| `src/components/entities/items/AGENTS.md` | Gear item types |

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
- Formatting is ESLint + @stylistic: 2-space indentation, double quotes for JS/TS strings. Run `yarn fix` after
  changes.

## Testing conventions

Unit tests (Vitest) follow the **Arrange / Act / Assert** pattern with labelled comment blocks, and suites opt into
`describe.concurrent` only when every test is self-contained. Read the full rules in `.agents/guidelines/testing.md`
before writing or editing a test:

@.agents/guidelines/testing.md

## Code comments

Every comment is one of three styles — **Documentation** (`/**` JSDoc: the contract, no history or internals),
**Explanation** (inline `//`: *why* the code exists, not what it does), or **Task** (`// TODO:` / `// FIXME:`: specific
outstanding work). Read the full rules and examples in `.agents/guidelines/comments.md` before writing or editing a
comment:

@.agents/guidelines/comments.md

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

- **Issue tracker:** GitHub Issues on `CptnFizzbin/shadow-sin` — see `.agents/guidelines/issue-tracker.md`.
- **Triage labels:** `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix` — see
  `.agents/guidelines/triage-labels.md`.
- **Domain docs:** single-context repo (`CONTEXT.md` and `docs/adr/` at the root) — see `.agents/guidelines/domain.md`.
- **Skills:** `.agents/skills/CLAUDE.md` indexes every skill in `.agents/skills/`.
