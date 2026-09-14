# Top-Level Directory Restructuring

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Added after running /to-prd. A feature may generate multiple Issues (one per PR slice). -->
> - #??? — scope of this issue/PR

`src/` has grown enough top-level folders, and enough same-named-but-different folders, that
finding the right home for a file (or finding an existing one) now takes real search effort. This
doc catalogues the specific collisions and inconsistencies found, defines one container per
concept, and lays out a slice-by-slice move plan. It follows directly from
[`0016-code-organization-cleanup.md`](./0016-code-organization-cleanup.md) (which fixed *what goes
in `system/`*) and its "Out of Scope" note, which already flagged this as a follow-up: *"a larger
restructuring later — breaking up `components/runner/` and promoting its per-domain subfolders
(and `components/system/`'s) up a level."* This doc is that restructuring, extended to every
top-level container, not just `components/`.

## Concrete problems found

- **The card tier hierarchy is split across 4 unrelated-looking siblings.** `entityCard/`
  (50 files), `itemCard/` (6), `powerCard/` (2), `spiritCard/` (1) are a designed tier hierarchy
  (`docs/adr/0010-entity-card-composition.md`), but sit as four separate top-level
  `components/` folders — `powerCard/` and `spiritCard/` are effectively invisible next to
  `runner/` (176 files) and `items/` (129 files).
- **"dice" names six unrelated things**: `system/dice/` (the `DiceRoller` store), `components/dice/`
  (the Dice Tray UI), `components/system/dice/` (`dieFace`/`diceResult` rendering primitives),
  `components/system/dicePool/` (dice-pool display), plus matching `hooks/system/dice/`,
  `hooks/system/dicePool/`, and `stores/runner/dicePool/`. Nothing in the name says which is which.
- **"items" vs "gear" in `system/` has no rule.** `system/gear/` holds typed sub-data
  (`weaponData.ts`, `armorData.ts`, ...); `system/items/` is a near-empty sibling holding only
  `itemUtils.ts` + `addItemSelection.ts`; `itemData.ts`/`itemType.ts` sit loose at `system/` root.
  Three homes, no obvious rule for a new file — and CONTEXT.md already settled which name wins:
  **Item** is the code identifier, **Gear** is UI-copy-only (route labels, "Add Gear"), and a
  rename of the remaining Gear-named code identifiers to Item-prefixed equivalents is already
  planned there. `system/gear/` is exactly that remaining Gear-named identifier.
- **`components/helpers/` is a vague catch-all** for `attackCalculator/` and `defenseCalculator/`
  — both combat mechanics UI, conceptual siblings of `components/system/combat/`, but not
  discoverable by searching "combat" or anything else meaningful.
- **`components/system/` will collide with the new top-level `system` concept** once this doc's
  container names are in place — same failure mode as the "dice" collision above, one level up.
- **Five ad hoc singleton stores** (`DiceRoller`, `DialogCtrl`, `ImprovementStore`, `DiceTrayApi`,
  `InitiativeTrackerStore` — the same four/five AGENTS.md's "Redux Toolkit store patterns" section
  names as one family) are scattered across `system/`, `components/`, and `stores/` with no
  consistent rule for which.
- **`lib/` mixes two different things**: genuine generic utilities (`arrayUtils.ts`,
  `numberUtils.ts`, ...) alongside `lib/persistence/` and `lib/storage/`, which are full
  subsystems (load/save/migrate, a pluggable storage abstraction), not helper functions.
- **`components/runner/<domain>/` and `components/builder/sections/<domain>/` mirror each other
  by name** (`attributes`, `biology`, `contacts`, `finances`, `gear`/`gearPage`, `karma`,
  `profile`, `qualities`, `skills`) but live under two different parents, so the two halves of one
  domain's UI aren't found together.
- **Business logic and display code are mixed inside the same folder** for every ad hoc singleton
  store — `DiceRoller`/`DiceTrayApi`/`ImprovementStore`/`InitiativeTrackerStore`/`DialogCtrl`'s
  actual store/selector/state files sit in the same folder as the dialogs and display components
  that consume them, instead of the state-vs-UI split every other container already draws.

## Container definitions

One top-level `src/` container per concept, each internally organized by feature/domain
subfolder (never flattened into a single bag of files):

| Container | Holds | Replaces |
|---|---|---|
| `routes/` | TanStack file-based routes | *(unchanged)* |
| `system/` | Domain types (`models`) and pure rule calculations (`formulas`, per ADR-0015) | *(unchanged scope, per 0016)* |
| `state/` | Redux Toolkit slices: `<domain>/<slice>.actions.ts` / `.state.ts` / `.selector.ts` | `stores/` |
| `contexts/` | React Context definitions + Providers: `<domain>/<name>.context.ts` / `<name>.provider.tsx` | `contexts/` (reshaped) |
| `hooks/` | Custom React hooks, including Context accessor hooks | `hooks/` (absorbs contexts' accessor hooks — see Open Questions) |
| `utils/` | Generic, non-domain helper functions (`arrayUtils`, `numberUtils`, `errors/`, ...) | `lib/` (utility half) |
| `services/` | Cohesive subsystems and business logic: persistence (`RunnerManager`), storage, plus every ad hoc singleton store's actual store/selector/state code | `lib/` (persistence/storage half) + the non-display half of five stores currently in `system/`/`components/`/`stores/` |
| `data/` | Fixtures, migrations, `applyMigrations` | *(unchanged — stays top-level)* |
| `integrations/` | Third-party adapter/wrapper code (Redux compat store, MUI, TanStack) | *(unchanged — stays top-level)* |
| `components/` | UI, one folder per domain, `ui/` for cross-domain shared primitives | `components/` (reshaped) |

Ad hoc singleton stores split along the same line as everything else: **business logic
(the store, its selectors, its state shape) goes in `services/<feature>/`; display code (dialogs,
panels, cards) stays in `components/<feature>/`.** This applies regardless of how many features
consume a store — being reached from several unrelated callers doesn't make something belong in a
shared container, as long as every caller goes through one feature-owned hook rather than the
store's internals directly; the hook (which stays in `hooks/<feature>/`) is the real public
surface, not the store's shape. Ad hoc *contexts* follow the plainer version of the same rule:
colocate with the one feature that owns them.

| Store/context | Consumers | Verdict |
|---|---|---|
| `DialogCtrl` | `items/`, `karma`, `magician/spirits`, `skills`, `combat`, `defenseCalculator`, `ui/dialog` itself — a reusable primitive many independent dialogs construct their own instance from, not one singleton behind one hook | Business logic → `services/dialog/`. Display (`Dialog`, `ControlledDialog`) stays in `components/ui/dialog/`; `useDialog`/`useDialogCtrl` stay in `hooks/ui/dialog/` |
| `DiceRoller` + `DiceTrayApi` | `attackCalculator`, `licenseCheck`, builder's nuyen section, dice tray — but only ever through `useDiceRoller()`, never `DiceRoller`'s `.selectors`/`.state` directly | One service — both stores' logic merges into `services/dice/`. `useDiceRoller` stays in `hooks/dice/`; the Dice Tray display (dialog, header, inputs, results) stays in `components/dice/` |
| `ImprovementStore` | Spend Karma dialog only | Business logic → `services/improvements/`. Display stays in `components/karma/` |
| `InitiativeTrackerStore` | Initiative Tracker feature only | Business logic → `services/initiativeTracker/`. Display stays in `components/initiativeTracker/` |
| `contexts/entity/entityProvider.tsx` | Cross-cutting (ADR-0016 Phase 1 builds on it directly) | Shared — stays in `contexts/` |
| `contexts/items/addItemDialogContext.ts`, `contexts/improvements/spendKarmaDialogContext.tsx`, `contexts/dice/diceTrayContext.ts`, `contexts/ui/prototypeContext.ts` | Single feature each | Adhoc — colocate with their components |

## `components/` domain unification

Per-domain shape:

```
src/components/<domain>/<subcomponent>+/
  *                        — shared files, used regardless of mode
  builder/ | viewer/ | editor/  — mode-specific files, only where a domain's UI actually diverges
```

Domains where Runner (`components/runner/<domain>/`) and Builder
(`components/builder/sections/<domain>/`) already mirror each other by name unify into one
`components/<domain>/` tree: `attributes`, `biology`, `contacts`, `finances`, `items` (absorbing
`gearPage`, the existing `items/`, and `system/gear/`'s display-adjacent pieces — **item**, not
gear, per CONTEXT.md's Item entry), `karma` (absorbing `improvements/`'s display, which is a
karma-spend mechanism, not its own domain — `ImprovementStore` itself peels off to
`services/improvements/`, per the ad hoc table above), `profile`, `qualities`, `skills`.

Runner-only domains promote from `components/runner/<domain>/` straight to `components/<domain>/`
with no mode split needed: `magician`, `matrix`, `quickPanel`, `reputation`, `technomancer`,
`header`, `nav`, `licenseCheck`, `exportImport`, `sheet`.

Builder-only domains promote from `components/builder/sections/<domain>/` the same way:
`resources`, `summary`, `alerts`, `buildPoints`, `nav`.

`components/system/`'s subfolders (`combat`, `damage`, `dicePool`, `gameEffects`, `initiative`,
`initiativeTracker`, `sources`) promote to top-level `components/` the same way as
`components/helpers/`'s (`attackCalculator`, `defenseCalculator`) — this retires both
`components/system/` and `components/helpers/` and resolves the `system`-naming collision for
free. `initiativeTracker/`'s display promotes with the rest; `InitiativeTrackerStore` itself
peels off to `services/initiativeTracker/`, per the ad hoc table above.

The card tier hierarchy (`entityCard`, `itemCard`, `powerCard`, `spiritCard`) nests under
`components/cards/` rather than promoting further — it's one designed hierarchy (ADR-0010), not
several domains, and its own internal architecture (flat `elements/` folder, no per-tier
ownership) is explicitly out of scope for this doc to touch.

## Constraints

- Every move in Slices 1–N below is mechanical — `git mv` + import fix + `yarn fix` + `yarn tsc` +
  `yarn fallow dead-code --format json` — no behavior change, no new abstractions, matching 0016's
  discipline for its own Slices 1–3.
- `state/` renaming should not race ADR-0016 (`unify-redux-state`). That ADR's Phase 1 (assembly
  interface standardization) hasn't landed yet, and Phase 2 (the `RootState` merge) is gated on
  it. Rename `stores/<domain>/` → `state/<domain>/` and the file suffixes now (mechanical, no
  shape change), but don't try to pre-guess Phase 2's `state/current/` + `state/builder/` shape —
  that's a second, later move once ADR-0016 Phase 2 actually lands.
- `*Slice.actions.ts` → `<slice>.actions.ts`, `*Slice.ts` → `<slice>.state.ts`,
  `*Slice.selectors.ts` → `<slice>.selector.ts` (singular, per this doc's naming).
- The card hierarchy's internal architecture (ADR-0010) is unchanged — only its physical location
  moves. ADR-0010's no-import-cycle rule is about module dependencies, not directory nesting, so
  nesting under `components/cards/` doesn't conflict with it.
- Existing `*.test.ts`/`*.test.tsx` files move with the source file they test, unchanged.

## Domain Notes

No new domain terms. This doc executes a rename CONTEXT.md's **Item** entry already calls for:
Item is the code identifier, Gear is UI-copy-only, and "a rename of the remaining Gear-named code
identifiers to `Item`-prefixed equivalents is planned." Folding `system/gear/` into `system/items/`
and `components/gear/`-shaped folders into `components/items/` is that rename, scoped to
directories — see Out of Scope for what it deliberately doesn't touch.

## Open Questions

- [ ] **Where does a Context's accessor hook live?** `contexts/<domain>/` now holds only
      `<name>.context.ts` + `<name>.provider.tsx` (per this doc's Container definitions). Does the
      matching accessor hook (e.g. `useRunnerStore`) join the existing `hooks/<domain>/` tree, or
      get a third file back in `contexts/<domain>/`? Leaning toward `hooks/`, since that tree
      already exists and already groups hooks by the same feature names as `components/`.
- [ ] **PR slicing order.** 0016 used one PR per slice with no cross-slice dependency; this doc's
      slices mostly share that property (card nesting, dice renaming, items/gear consolidation,
      helpers retirement are independent), but the `components/` domain unification is large
      enough it likely needs its own multi-PR breakdown per domain, not one PR for all of it.
- [ ] **Exact per-domain file membership for the `components/` unification.** This doc names the
      domains that unify and where they promote to, but doesn't enumerate every file — that's
      PRD-Issue-level detail once slicing is agreed.

## Out of Scope

- **ADR-0016's actual `RootState` merge.** This doc only renames/relocates the existing
  `stores/<domain>/` slices; it does not implement Phase 1 or Phase 2 of that ADR.
- **The five ad hoc stores' behavior or lifecycle.** Classified for *location* only (see table
  above) — none of them change shape, get merged into `RootState`, or gain/lose reducer logic.
- **Any change to `RunnerData`, migrations, or rule behavior.** Same discipline as 0016: this is
  strictly "move code to where it now claims to live."
- **Renaming any exported type, component, hook, or store**, beyond what following folders to
  their new names mechanically requires. File location changes only, unless a slice's own PRD
  Issue says otherwise (e.g. a `*Slice.ts` file becoming `*.state.ts` is a file rename, not an
  export rename).
- **Renaming the persisted `RunnerData.gear` field.** CONTEXT.md's Item entry explicitly calls
  this out as "a heavier, separate decision needing a migration ... not yet decided whether it's
  in scope" — unaffected by this doc regardless of what any slice renames a folder to.
- **The card hierarchy's internal architecture** (ADR-0010's elements/tiers design) — nesting
  location only.
- **Fallow-flagged dead code, duplication, or complexity** — separate, unrelated cleanup; run via
  the `fallow` skill independently.

## Related Features

- `CONTEXT.md`'s **Item** glossary entry — already calls for the Gear→Item code-identifier rename
  this doc's `items/` folders execute, and already carves the persisted `RunnerData.gear` field
  out of that rename's scope.
- [`0016-code-organization-cleanup.md`](./0016-code-organization-cleanup.md) — the direct
  predecessor; its "Out of Scope" note is what this doc follows up on.
- [`docs/adr/0010-entity-card-composition.md`](../adr/0010-entity-card-composition.md) — governs
  the card hierarchy this doc relocates but does not redesign.
- [`docs/adr/0015-formulas-for-rule-calculations.md`](../adr/0015-formulas-for-rule-calculations.md) —
  governs what belongs in `system/` (unchanged scope here).
- [`docs/adr/0016-unify-redux-state.md`](../adr/0016-unify-redux-state.md) — this doc's `state/`
  rename must not race its Phase 1/Phase 2 sequencing.
- AGENTS.md's "Key directories" and "Redux Toolkit store patterns" sections — describe the
  convention this doc's container definitions supersede.
