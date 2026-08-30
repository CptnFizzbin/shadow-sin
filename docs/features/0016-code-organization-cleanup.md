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

How each slice reshapes what it moves is governed by
[`docs/adr/0015-formulas-for-rule-calculations.md`](../adr/0015-formulas-for-rule-calculations.md),
adopted after this doc's original audit surfaced the problem it resolves: extracted rule logic
becomes a **Formula** (`XxxFormulas.get*`, `system/`), reached only through a matching **Selector**
(`XxxSelectors.select*`) — never called directly by a hook or component.

## Open Questions

- [x] **Does `components/system/` get renamed?** Resolved: out of scope for this doc — see Out of
      Scope below. The naming collision with `src/system/` stands for now.
- [ ] **Do the fused hooks get split now or left alone?** Partially resolved — the Build Points
      portion (`useGearBuildPoints`, `useGearTotalCost`, `getTotalCost`) is folded into Slice 4
      below. `hooks/runner/skills/skillDicePools.ts` and
      `components/builder/sections/gear/gearUtils.ts`'s `useGearAvailabilityIssues` remain open —
      see Slice 5.
- [x] **Where does `BuilderConfig` land inside `system/`?** Resolved: not a flat file, not split
      per existing domain subfolder. `BuilderConfig` and every BP-cost formula that reads it —
      regardless of what it's pricing (gear, an Adept Power, a Contact) — form their own domain,
      `pointBuy`, mirrored across all three layers: `system/builder/pointBuy/`,
      `stores/builder/pointBuy/`, `components/builder/pointBuy/`. See Slice 4.
- [x] **One PR or several?** Resolved: several — one PR per slice below, per the repo's normal
      feature-doc → PRD-Issue → PR lifecycle.

## Constraints

- Slices 1–3 are pure file moves — no behavior change, no new abstractions. Each is mechanical:
  relocate the file, update every import site, run `yarn fix` and `yarn tsc`. Slice 4 (point-buy)
  is not purely mechanical — see its own note in the Reorganization Plan.
- Files moved into `system/` must stay framework-agnostic, matching every existing `system/` file
  today — no React imports. `components/system/dicePool/dicePoolData.tsx` is `.tsx` in name only
  (no JSX in the file); it becomes `.ts` on the move.
- `yarn fallow dead-code --format json` must report no new unused exports/files introduced by a
  move — a rename that leaves an orphaned re-export behind would show up there.
- Existing `*.test.ts`/`*.test.tsx` files move with the source file they test, unchanged; every new
  Formula introduced by Slice 4 needs its own new test.
- Follow the existing `system/<feature>/` subfolder convention (`system/gear/`, `system/powers/`,
  `system/dice/`, `system/gameEffects/`, and now `system/builder/pointBuy/`) rather than inventing
  new top-level groupings.
- **A Formula is always reached through a Selector** — see ADR-0015. A slice that extracts a
  calculation but leaves a hook calling it directly (the way `useGearBuildPoints` does today) isn't
  finished by the file move alone; Slice 4 covers giving that calculation a real `stores/builder/
  pointBuy/` Selector to be reached through instead.

## Domain Notes

No new domain terms. `pointBuy` names a source-tree domain after the existing **Build Points (BP)**
glossary term (`CONTEXT.md`) — it doesn't introduce a new concept, just a home for BP-cost
calculations that were previously scattered per-subject.

## Reorganization Plan

Each slice below is its own PR. Slices 1–3 have no dependency on one another; Slice 4 is the one
non-mechanical unit of work; Slice 5 stays optional/open per the Open Questions above.

| # | Slice | Files | Destination |
|---|-------|-------|-------------|
| 1 | Gear/license/SIN rule formulas | `components/items/gearUtils.ts`, `components/items/types/implants/implantUtils.ts`, `components/items/types/licenses/licenseUtils.ts`, `components/items/types/licenses/sinUtils.ts` | `system/gear/` |
| 2 | Dice pool math | `components/system/dicePool/dicePoolData.tsx` (→ `.ts`), `components/system/dice/diceUtils.ts` | `system/dice/` |
| 3 | Combat/defense/game-effect data | `components/system/defense/defenseCalculatorData.ts`, `components/system/combat/combatActionData.ts`, `components/system/gameEffects/gameEffectUtils.ts` | `system/` (game-effect one merges into existing `system/gameEffects/`) |
| 4 | **Point-buy (BP) cost economy** | `components/builder/builderConfig.ts`; `components/runner/adeptPowers/adeptPowersUtils.ts`'s `getAdeptPowerBpCost` (`isAdept` stays — it's an Awakening predicate, not a BP formula, and moves to `system/powers/` instead); `components/builder/sections/contacts/contactsBuilderUtils.ts`'s `getContactBpCost`; `hooks/builder/buildPoints/useGearBuildPoints.ts` (`useGearBuildPoints`, `useGearTotalCost`) and `components/builder/sections/gear/gearUtils.ts`'s `getTotalCost` | `system/builder/pointBuy/` (Formulas) + new `stores/builder/pointBuy/` (Selectors reaching them) + `components/builder/pointBuy/` (UI, existing BP display components folded in — exact membership TBD when this slice is scoped) |
| 5 *(optional, open)* | Split remaining fused hooks | `hooks/runner/skills/skillDicePools.ts`; `components/builder/sections/gear/gearUtils.ts`'s `useGearAvailabilityIssues` | Pure math half → `system/`, reached through a new/existing Selector per ADR-0015; thin hook stays in `hooks/` |

## Out of Scope

- **`components/system/` rename.** Leaning toward a larger restructuring later — breaking up
  `components/runner/` and promoting its per-domain subfolders (and `components/system/`'s) up a
  level, rather than a same-shape rename — but that's a bigger, separate pass. Recorded here so the
  direction isn't lost; not designed or scoped by this doc.
- Any other `stores/`, `hooks/`, or `lib/` reorganization beyond Slice 4's new `stores/builder/
  pointBuy/` — audited as part of this doc's research and found already consistent with AGENTS.md's
  documented convention.
- Fallow-flagged dead code, duplication, or complexity findings — a separate, unrelated cleanup
  concern from file placement; run independently via the `fallow` skill.
- Any change to `RunnerData`, migrations, or rule behavior. This is strictly a "move code to where
  it already claims to live" pass — Slice 4's new Selectors read existing `BuilderState` fields,
  they don't add any.
- Renaming any domain type or constant — only file location changes; exported names stay the same
  unless a slice's PRD says otherwise.

## Related Features

- [`docs/adr/0015-formulas-for-rule-calculations.md`](../adr/0015-formulas-for-rule-calculations.md) —
  governs how every slice above reshapes what it moves (Formula/Selector split, naming, the
  always-reached-through-a-Selector rule). This doc's original audit is what surfaced the problem
  that ADR resolves.
- AGENTS.md's "Key directories" section — the convention this doc brings the codebase back into
  line with.
