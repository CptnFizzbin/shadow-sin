# Top-Level Directory Restructuring

> **Status:** Implemented
>
> **GitHub Issues / PRs:**
> - [#614](https://github.com/CptnFizzbin/shadow-sin/pull/614) — the mechanical renames/moves this
>   doc describes (all containers, all phases).
> - Follow-up PR (branch `claude/component-file-reorganization-xvb941`) — the two non-mechanical
>   items #614 deferred: splitting `attributeCatalog.ts`/`itemUtils.ts` into `model/`/`formulas/`
>   halves, and splitting the shared `runner/`, `builder/`, `entity/`, and `runnerManager`
>   contexts into `.context.ts` + `.provider.tsx` (with their accessor hooks moved to
>   `hooks/<domain>/`).

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
- **21 of `system/`'s own files sit loose at its root** with no rule for which stay there and
  which get a domain folder — `contactData.ts`, `metatypeData.ts`, and `qualityData.ts` have no
  home even though `contacts`, `biology`, and `qualities` are already established domain names one
  layer up, in `state/` and `components/`.
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

## `system/` file-level reorganization

`system/` already sorts most of its content into `<domain>/` subfolders, but 21 files still sit
loose at `system/` root with no rule for which stay there and which don't. Sorting them the same
way as everything else:

| Destination | Absorbs |
|---|---|
| `attributes/` *(existing)* | `attributeInfo.ts`, `attributeKey.ts`, `movementData.ts` (a Body/Quickness-derived stat table, same category as `attributeInfo.ts`) |
| `items/` *(existing, absorbing `gear/`)* | `itemData.ts`, `itemType.ts`, `availabilityInfo.ts` (the Item legality/rating term) |
| `magic/` *(existing)* | `awakeningType.ts` |
| `entities/` *(existing)* | `entityData.ts`, `entityKind.ts`, `damageTrackKey.ts` (pairs with `entities/traits/entityWithDamage.ts`) |
| `contacts/` **(new)** | `contactData.ts`, `favourData.ts` (a Contact-legwork mechanic) |
| `finances/` **(new)** | `lifestyleType.ts`, `loanData.ts` |
| `biology/` **(new)** | `metatypeData.ts` |
| `qualities/` **(new)** | `qualityData.ts` |

The four new folders match domain names that already exist one layer up (`state/runner/biology/`,
`.../contacts/`, `.../qualities/`; `components/finances/`) — `system/` was the one layer still
missing them.

Three files stay loose at `system/` root, deliberately:

- `runnerData.ts`, `runnerData.factory.ts`, `runnerTraits.ts` — `RunnerData` is "the root domain
  type" (AGENTS.md); nesting it inside a domain folder would bury the one type everything else in
  `system/` ultimately composes into.
- `sourceData.ts`, `systemValues.ts` — genuinely cross-domain primitives (every domain's data
  carries a `SourceData` citation) rather than something one domain subfolder could own without
  every other domain reaching across into it.

### `model/` vs `formulas/` split

`system/<domain>/` splits one level further, by kind before domain:
`system/model/<domain>/` and `system/formulas/<domain>/`. The split rule:

- **`model/`** — interfaces, types, Zod schemas, enums, static registries/catalogs of data,
  type-guard/predicate functions, and a type's own factory function (e.g. `runnerData.factory.ts`
  stays beside `runnerData.ts` — now both under `model/`, still loose at its root per the exception
  above).
- **`formulas/`** — functions whose job is computing a derived SR4A rule value: the `XxxFormulas`
  namespaces ADR-0015 already establishes, plus the pre-ADR-0015 loose calculation functions
  everywhere else that haven't been wrapped in that convention yet (unchanged by this doc — see
  Out of Scope).

Most files sort cleanly by their existing role — `weaponData.ts`, `qualityData.ts`, every enum
(`entityKind.ts`, `improvementType.ts`, `gameEffectType.ts`), and `entities/traits/*.ts` are
`model/`; `aiAttrFormulas.ts`, `encumbranceUtils.ts`'s three calculators, and
`improvements/improvementUtils.ts`'s cost/apply functions are `formulas/`. Three complications
found while checking, worth flagging rather than papering over:

- **A few files mix both kinds and need an actual split, not just a move**:
  `attributes/attributeCatalog.ts` (catalog *types* + `attrValue`/`attrMin` compute functions) and
  `items/itemUtils.ts` (`ItemCatalog`/`AnyItemData` *types* + the `toItemCatalogTree` transform).
  Splitting these is a small, mechanical extraction (same discipline as 0016's own Slices), not a
  behavior change — but it's not a pure file move either, so it should be called out as its own
  PRD Issue step rather than bundled silently into a bulk relocation. **Done** in the follow-up to
  #614: `attributeCatalog.ts` kept its catalog types and factory; `attrValue`/`attrMin`/`attrMax`/
  `attrNaturalMax`/`attrAugmentedMax` moved to `formulas/attributes/attributeFormulas.ts`.
  `itemUtils.ts` kept its types, `itemIsType` guard, and the filtering `ItemUtils` namespace;
  `toItemCatalogTree` moved to `formulas/items/itemCatalogTree.ts`.
- **`karma/improvements/improvementSelectors.ts` is neither** — it's a Selector namespace
  (`ImprovementsSelectors`, built with `createSelector` against `ImprovementsState`), not a type or
  a rule calculation. It's misfiled in `system/` today; it belongs in `services/improvements/`
  alongside `ImprovementStore`, per the ad hoc-store table above, not in `model/` or `formulas/` at
  all.
- **`karma/improvements/improvementDescription.ts`'s `describeImprovement`** (formats a display
  string) doesn't cleanly fit either bucket — it's not a type/predicate and it doesn't compute a
  game-rule value. Filed under `formulas/` as the closer fit, flagged here as a judgment call
  rather than a confident classification.

Exhaustive per-file membership for every remaining domain isn't enumerated here — same discipline
as the `components/` unification below: the rule and the representative examples are settled, the
full file list is PRD-Issue-level detail.

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
  interface standardization) hasn't landed yet, and Phase 2 (the `RunnerState` merge) is gated on
  it. Rename `stores/<domain>/` → `state/<domain>/` and the file suffixes now (mechanical, no
  shape change), but don't try to pre-guess Phase 2's `state/current/` + `state/builder/` shape —
  that's a second, later move once ADR-0016 Phase 2 actually lands.
- `*Slice.actions.ts` → `<slice>.actions.ts`, `*Slice.ts` → `<slice>.state.ts`,
  `*Slice.selectors.ts` → `<slice>.selector.ts` (singular, per this doc's naming).
- The card hierarchy's internal architecture (ADR-0010) is unchanged — only its physical location
  moves. ADR-0010's no-import-cycle rule is about module dependencies, not directory nesting, so
  nesting under `components/cards/` doesn't conflict with it.
- Existing `*.test.ts`/`*.test.tsx` files move with the source file they test, unchanged.
- The `system/model/` vs `formulas/` split is mechanical for files that are already purely one
  kind. `attributeCatalog.ts` and `itemUtils.ts` are the exception — splitting their mixed
  type/compute content is a small, deliberate extraction, called out as its own step rather than
  folded silently into a bulk `git mv`.

## Domain Notes

No new domain terms. This doc executes a rename CONTEXT.md's **Item** entry already calls for:
Item is the code identifier, Gear is UI-copy-only, and "a rename of the remaining Gear-named code
identifiers to `Item`-prefixed equivalents is planned." Folding `system/gear/` into `system/items/`
and `components/gear/`-shaped folders into `components/items/` is that rename, scoped to
directories — see Out of Scope for what it deliberately doesn't touch.

## Open Questions

- [x] **Where does a Context's accessor hook live?** Resolved: `hooks/<domain>/`. PR #614 left the
      shared contexts (`runner/`, `builder/`, `entity/`) unsplit since splitting one file into
      `.context.ts` + `.provider.tsx` is content editing, not a rename (see Constraints); the
      follow-up work split all four mixed context files found (`runner/runnerStore.context.ts`,
      `runner/runnerManagerContext.tsx`, `builder/builderStore.context.ts`,
      `entity/entityProvider.tsx`) into a `.context.ts` (just the `createContext` call), a
      `.provider.tsx` (the Provider component), and a `useXxx` accessor hook under
      `hooks/<domain>/`. `contexts/builder/editorMode.tsx` was deliberately left unsplit — it's
      already marked for retirement once ADR-0016 Phase 2 lands, so splitting it now would be
      wasted work.
- [x] **PR slicing order.** Resolved differently than speculated: landed as one PR (#614) covering
      every mechanical rename across every container, rather than split per-domain. Validated as one
      unit — `yarn tsc` clean, file count unchanged (1119 before and after), `yarn fallow dead-code`
      shows zero new findings (one pre-existing `unused_class_members` false positive moved
      locations; one real `vi.mock()` string-literal path fallow caught and #614 fixed, since it's
      not a static import tsc resolves).
- [x] **Exact per-domain file membership for the `components/` unification and the `system/`
      model/formulas split.** Resolved by executing it — the current tree is the answer. Three
      judgment calls made during execution that this doc didn't fully spell out: `magician`,
      `technomancer`, `adeptPowers`, and `nav` turned out to also be Runner+Builder unify domains
      (builder's `sections/resources/{magician,technomancer,adept}/` and `builder/nav/` are their
      Builder halves) rather than Runner-only as originally listed; `components/system/combat/`
      promoted to top-level `components/combat/` (matching its six siblings) rather than nesting
      under `items/`; and the two mixed-content files (`attributeCatalog.ts`, `itemUtils.ts`) moved
      whole into `model/` as an interim step in #614, then split into `model/`/`formulas/` halves
      in the follow-up PR, per the Constraints note.

## Out of Scope

- **ADR-0016's actual `RunnerState` merge.** This doc only renames/relocates the existing
  `stores/<domain>/` slices; it does not implement Phase 1 or Phase 2 of that ADR.
- **The five ad hoc stores' behavior or lifecycle.** Classified for *location* only (see table
  above) — none of them change shape, get merged into `RunnerState`, or gain/lose reducer logic.
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
