# Code Organization Cleanup

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Added after running /to-prd. A feature may generate multiple Issues (one per PR slice). -->
> - #??? — scope of this issue/PR

The `system/` / `stores/` / `hooks/` / `lib/` split documented in AGENTS.md ("Key directories") is
followed correctly for *state*: `stores/<feature>/` and `hooks/<feature>/` are consistent, and
`lib/` holds only genuinely generic, non-domain utilities (array/number/JSON helpers, storage,
persistence, errors). The actual drift is that `system/` does not hold all the Shadowrun rules —
a meaningful amount of pure rule-calculation code (cost formulas, availability formulas, essence
multiplier tables, dice-pool math, BP cost tables) has been added next to the component that
happens to consume it, rather than centralized in `system/`. This doc catalogues that drift and
proposes a reorganization.

## Open Questions

- [ ] **Does `components/system/` get renamed?** It collides in name (not purpose) with
      `src/system/` — it's a viewer-UI feature folder (combat/dice/damage/initiative components),
      analogous to `components/runner/` or `components/builder/`, not a duplicate rules home. Worth
      renaming to remove the ambiguity (`components/gameplay/`? `components/mechanics/`?), but it's
      a larger mechanical rename (many import sites) for a purely cosmetic win — decide whether it's
      worth a slice of its own or gets skipped.
- [ ] **Do the fused hooks get split now or left alone?** `useGearBuildPoints`,
      `skillDicePools.ts`, and `useGearAvailabilityIssues`/`getTotalCost` correctly live in
      `hooks/` (they call `useRunnerSelector`), but each wraps a pure formula that could be
      extracted into `system/`. Extracting the formula does **not** imply adding a matching
      `stores/*.selectors.ts` wrapper around it — see the selector-boundary rule under Constraints;
      the hook keeps reading state via its existing selector(s) and calls the `system/` function
      directly in the same body. What's still open is only whether pulling the formula out into its
      own `system/` file is worth doing now or left alone as-is.
- [ ] **Where does `BuilderConfig` land inside `system/`?** It's a single flat table covering
      attributes, skills, qualities, magic, contacts, technomancer, and gear BP/nuyen costs — all
      chargen ruleset numbers. Move it whole to e.g. `system/builderConfig.ts`, or split it per
      domain subfolder (`system/skills/skillBuildCost.ts`, `system/gear/gearBuildCost.ts`, ...) to
      match how the rest of `system/` is already split by feature?
- [ ] **One PR or several?** The slices below are independently shippable (each is a pure
      file-move + import-path update, no behavior change), but touch a lot of files in aggregate.
      Confirm whether to land them as one PR or one-per-slice.

## Constraints

- Pure file moves only in Slices 1–5 below — no behavior change, no new abstractions. Each move is
  mechanical: relocate the file, update every import site, run `yarn fix` and `yarn tsc`.
- Files moved into `system/` must stay framework-agnostic, matching every existing `system/` file
  today — no React imports. `components/system/dicePool/dicePoolData.tsx` is `.tsx` in name only
  (no JSX in the file); it becomes `.ts` on the move.
- `yarn fallow dead-code --format json` must report no new unused exports/files introduced by a
  move — a rename that leaves an orphaned re-export behind would show up there.
- Existing `*.test.ts`/`*.test.tsx` files move with the source file they test, unchanged.
- Follow the existing `system/<feature>/` subfolder convention (`system/gear/`, `system/powers/`,
  `system/dice/`, `system/gameEffects/`) rather than inventing new top-level groupings.
- **No mandatory selector wrapper.** A `system/` function's signature takes plain domain data
  (e.g. `ImplantData`, a `rating: number`) — never `RunnerState`/store state — so it is not a
  selector's counterpart and moving it doesn't create an obligation to also add one. Call sites
  (a hook, a component, or a `stores/*.selectors.ts` body) invoke the `system/` function directly
  with whatever data they already have in scope. Only write a `stores/` selector when it does real
  selection work — composing multiple state slices, applying a store-specific fallback, or needing
  `reselect`/RTK memoization over a derived collection. A selector whose entire body would be
  `return calc(selectX(state))` is a sign to skip the selector and call `calc` directly at the
  point of use instead — the calculator-then-wrapper ceremony this doc must avoid.

## Domain Notes

No new domain terms. This doc doesn't change any `RunnerData` field, rule, or calculation — only
where the existing rule-calculation code lives on disk.

## Reorganization Plan

Each slice is an independent PR-sized unit: relocate the listed file(s), update imports, done. Ordered
roughly by how self-contained each is (no slice depends on an earlier one).

| # | Slice | Files | Destination |
|---|-------|-------|-------------|
| 1 | Gear/license/SIN rule formulas | `components/items/gearUtils.ts`, `components/items/types/implants/implantUtils.ts`, `components/items/types/licenses/licenseUtils.ts`, `components/items/types/licenses/sinUtils.ts` | `system/gear/` |
| 2 | Adept power & contact BP costs | `components/runner/adeptPowers/adeptPowersUtils.ts`, `components/builder/sections/contacts/contactsBuilderUtils.ts` | `system/powers/`, `system/` (contacts has no subfolder today — see Open Questions) |
| 3 | Dice pool math | `components/system/dicePool/dicePoolData.tsx` (→ `.ts`), `components/system/dice/diceUtils.ts` | `system/dice/` |
| 4 | Combat/defense/game-effect data | `components/system/defense/defenseCalculatorData.ts`, `components/system/combat/combatActionData.ts`, `components/system/gameEffects/gameEffectUtils.ts` | `system/` (game-effect one merges into existing `system/gameEffects/`) |
| 5 | Chargen BP cost table | `components/builder/builderConfig.ts` | `system/` — exact shape pending the Open Question above |
| 6 *(optional)* | `components/system/` rename | Everything under `components/system/` (combat, damage, defense, dice, dicePool, gameEffects, initiative, initiativeTracker, sources) | `components/<new-name>/`, name TBD |
| 7 *(optional, larger)* | Split fused hooks | `hooks/builder/buildPoints/useGearBuildPoints.ts`, `hooks/runner/skills/skillDicePools.ts`, `components/builder/sections/gear/gearUtils.ts` (`getTotalCost`, `useGearAvailabilityIssues`) | Pure math half → `system/`; thin store-reading hook stays in `hooks/` |

Slices 1–5 are the "just relocate it" core of this doc. Slices 6 and 7 are listed for completeness
but are open questions above, not committed scope.

## Out of Scope

- Any `stores/`, `hooks/`, or `lib/` reorganization — audited as part of this doc's research and
  found already consistent with AGENTS.md's documented convention. No changes proposed there.
- Fallow-flagged dead code, duplication, or complexity findings — a separate, unrelated cleanup
  concern from file placement; run independently via the `fallow` skill.
- Any change to `RunnerData`, migrations, or rule behavior. This is strictly a "move code to where
  it already claims to live" pass.
- Renaming any domain type or constant — only file location changes; exported names stay the same
  unless a slice's PRD says otherwise.

## Related Features

- None directly — this is a cross-cutting structural cleanup rather than a feature slice. See
  AGENTS.md's "Key directories" section for the convention this doc brings the codebase back into
  line with.
