# Spend Karma — Post-Chargen Advancement

> **Status:** v1 shipped — follow-up slices tracked in [Out of Scope](#out-of-scope) below.
>
> **GitHub Issues / PRs:**
> - [#273](https://github.com/CptnFizzbin/shadow-sin/pull/273) — early karma-system planning doc (closed; superseded by this feature doc)
> - [#274](https://github.com/CptnFizzbin/shadow-sin/pull/274) — full v1 implementation: dialog + improvement queue for attributes, skills, skill groups, knowledge, language, spells; cost-formula fixes; cap enforcement; `complexFormIncrease`; native-language suppression; `karma.log` ledger + migration; specialization picker for active / knowledge / language skills.

Players need to spend earned **Karma** on post-chargen advancement — raising attributes, raising
or learning skills and skill groups, picking up new knowledge and language skills, learning
spells and complex forms, and (eventually) buying qualities. This mirrors what the BP system
does during chargen, but operates against a finite, accumulating currency rather than a
chargen-time budget.

The implementation approach taken in [#274](https://github.com/CptnFizzbin/shadow-sin/pull/274)
is an **improvement queue**: the Spend Karma dialog stages a set of `ImprovementEntry` objects
in a dialog-scoped `ImprovementStore`; on Save, `applyImprovements()` writes every staged change
to the character sheet and decrements `karma.current` by the total cost. On Cancel, the queue is
discarded. This differs from the immediate-spend model originally sketched in
[#273](https://github.com/CptnFizzbin/shadow-sin/pull/273), and the trade-offs around that
choice are captured in [Open & Resolved Questions](#open--resolved-questions) below.

## Open & Resolved Questions

Resolved items are marked `[x]` with the decision inline; unresolved ones keep `[ ]` and
explain what's still in the air. **Any decision recorded as a house-rule deviation must be
routed through the optional-rules registry** — see [Optional Rules
Integration](#optional-rules-integration) below.

- [x] **Persistent karma ledger — yes, minimal append-only on `CharacterSheet.karma.log`.**
      One `KarmaLedgerEntry` per applied improvement and per `addKarma` submit. Append-only,
      no edit, no delete (counter-entries instead of removal). The full `ImprovementEntry` is
      preserved on each spend entry so v2 undo / export / replay are cheap. **No UI in v1** —
      the display surface is a follow-up slice. See [Karma Ledger](#karma-ledger) for the
      shape, writes, and migration.

- [x] **`mode: 'chargen' | 'advancement'` field on the character sheet — not needed.** The
      implicit split holds: BP controls live in the **builder** view; the Spend Karma dialog
      lives in the **character-sheet** view. Which UI surface you're on is the chargen-vs-
      advancement marker. No `mode` field, no migration, no extra Zod schema field. If a flow
      later proves the split insufficient (GM mid-game retroactive edits, etc.), reopen as a
      separate decision.

- [x] **Cost-formula deviations from SR4A — fix to SR4A defaults; route any intentional
      group-level deviation through `optionalRulesRegistry`.** _v1 shipped:_ every cost in
      `improvementUtils.ts` now matches the SR4A advancement table (wiki:
      `rules/character-improvement.md`) by default. Group-level deviations remain a
      future hook through
      [`optionalRulesRegistry.ts`](../../src/system/featureFlags/optionalRulesRegistry.ts)
      (e.g. `cheaperSkillGroupAdvancement: createFlag<boolean>({ defaultValue: false, … })`)
      branched on inside `getImprovementCost`.
  - ✅ Fixed: `skillGroupIncrease` per-step → **`× 5`** (was `× 2`)
  - ✅ Fixed: `skillIncrease` for Knowledge / Language → **`× 1`** (was `× 2`)
  - ✅ Fixed: `learnSkillGroup` per-step raise → **`× 5`**
  - ✅ Fixed: `learnKnowledgeSkill` / `learnLanguageSkill` per-step raise → **`× 1`**
  - ✅ Fixed: `learnComplexForm` → **flat `2`** (was `5`)
  - ✅ Added: `complexFormIncrease` entry type — `new rating × 1` per step
  - (Already correct: attribute `× 5` — including Magic / Resonance / Edge, which SR4A also
      prices at `× 5`; active-skill `× 2`; new-skill bases of `4` / `10` / `2`; specialization
      flat `2`; new spell flat `5`.)

- [x] **Undo after Save — defer to v2; ledger writes only in v1.** Pre-Save Cancel already
      covers the most common misclick. The post-Save recovery path lands as a focused v2 PR
      with strict-last-spend-only semantics (no skipping over later entries, no batch undo)
      to sidestep dependency analysis entirely. The v1 ledger schema is forward-compatible:
      reserve `"undo"` in the `source` enum now even though it goes unused. Full v2 spec in
      [Karma Ledger → Undo (deferred to v2)](#undo-deferred-to-v2).

- [x] **Rating 6, Aptitude, and attribute caps — enforce SR4A defaults at the queue layer.**
      _v1 shipped:_ all caps are centralized in
      [`improvementCaps.ts`](../../src/system/karma/improvements/improvementCaps.ts) and
      consulted from each list before queueing. The dialog blocks any `ImprovementEntry` that
      would exceed the cap *before* it lands in the queue (not at Save). Caps enforced, per
      the wiki `rules/character-improvement.md`:
  - ✅ Active skill cap at 6 unless the character has the **Aptitude** quality for that skill
      (wiki: `qualities/aptitude.md`); with Aptitude, the cap is 7 and raises beyond 6 cost
      **double Karma per step** (`boostedByAptitude` flag on `SkillIncreaseEntry`).
  - ✅ Skill-group cap at 6 (no Aptitude analogue).
  - ✅ Knowledge / Language skill cap at 6.
  - ✅ Attribute cap = metatype maximum (`+1` to one attribute with **Exceptional Attribute**;
      wiki: `qualities/exceptional-attribute.md`).
  - ✅ Magic / Resonance cap = awakening max (today: 6). The full `6 + initiation/submersion
      grade` rule arrives with the initiation / submersion slices when grade tracking lands.
  - A future "soft caps" optional rule could relax these, but the default matches the book.

  _Aptitude / Exceptional Attribute detection_ today uses a name-pattern match on the
  character's qualities (`"Aptitude (Pistols)"`, `"Exceptional Attribute (Logic)"`).
  A structured cap-boost effect type can replace it later without touching callers.

- [x] **v1 scope — MUST (correctness + ledger) + SHOULD (spell UI); DEFER everything that
      needs a new domain surface.** _v1 shipped:_
  - ✅ **MUST landed in v1:** cost-formula bug fixes (5 deviations), `complexFormIncrease`
      entry type + apply path, cap enforcement at the queue layer (`improvementCaps.ts`),
      native-language suppression, `karma.log` field + migration + writes, `source` enum
      reserving `"undo"`.
  - ✅ **SHOULD landed in v1:** spell-learning UI replacing the
      `<Typography>Spell learning coming soon</Typography>` placeholder — see
      `improvementSpellList.tsx`.
  - ✅ **Bonus, surfaced during implementation:** a focused **specialization picker dialog**
      (`specializationPickerDialog.tsx`) replaces the queue-time hardcoded `"New Spec"`
      string. Active skills use the SR4A specialization list as a dropdown + custom input;
      knowledge skills get a free-text spec; languages get a free-text **Lingo** (the same
      entry type, stored to the `lingo` field by `applySpecialization`).
  - ✅ **Bug fix, also during implementation:** `breakSkillGroup` now no-ops when the
      character doesn't have the targeted group on the sheet (e.g. raising a standalone
      `Banishing` no longer crashes because the character has no `Conjuring` group).
  - **DEFER to follow-up slices** — each needs its own domain surface or design pass:
      complex-form picker UI (technomancer-only), positive-quality (new), negative-quality
      buy-off, focus bonding (`bondFocus` per CONTEXT.md), initiation grade, submersion
      grade, long-term spirit binding, metamagic-driven karma spends (Quickening / Anchoring
      / Cannibalize).

- [x] **Native-language pricing — suppress.** _v1 shipped:_ `LearnLanguageSkillEntry.skill`
      is now narrowed to a numeric-rating type (`LearnableLanguageSkillData`), the silent
      "treat as rating 1" fallback in `getImprovementCost` is gone, and the learn-language
      UI guards against native before queueing. Note: a queued **Lingo** entry on an
      already-native language is still allowed (per SR4A, lingos cost 2 karma regardless of
      rating). If a group wants to allow native to be karma-learnable in the future, that's
      a `allowKarmaForNativeLanguage` optional rule (defaults to off).

## Constraints

- **SR4A is the rulebook source of truth.** Every cost formula in `improvementUtils.ts`
  must match the SR4A advancement table (wiki: `rules/character-improvement.md`) by
  default. Group-level deviations live in
  [`optionalRulesRegistry`](../../src/system/featureFlags/optionalRulesRegistry.ts) and are
  read at call time — they do not get hardcoded into `improvementUtils.ts`. See
  [Optional Rules Integration](#optional-rules-integration).
- **The Spend Karma dialog lives on the character-sheet view, not the builder.** The view
  surface is the implicit chargen-vs-advancement marker — there is no `mode` field on the
  character sheet.
- **Karma is finite and never goes negative.** The dialog must block Save when the staged
  queue's total cost exceeds `karma.current`. (Already enforced via `remainingKarma < 0` →
  Save disabled.)
- **Skill-group breaking is mandatory** (SR4A p. 86): increasing or specialising a single
  skill that belongs to a group automatically breaks the group, splitting it into its
  constituent active skills at the group's rating. Implemented in `breakSkillGroup()`,
  which is a no-op when the character doesn't have the targeted group (e.g. the skill was
  learned standalone, or the group was already broken). Must hold for any new entry types
  that touch a grouped skill.
- **The improvement queue is dialog-scoped and transient.** It must not persist across dialog
  open/close cycles, and must not leak partial state onto the character sheet if the user
  cancels or refreshes mid-edit.
- **Application is atomic from the user's perspective.** On Save, either every staged entry
  applies and the total cost is deducted, or nothing does. Today this is "atomic enough"
  because everything runs inside one `produce()` block; if we add anything that could throw
  per-entry (e.g. server-side validation), the all-or-nothing guarantee needs revisiting.
- **No new migration is introduced by the queue model itself.** Adding a persistent ledger or
  a `mode` field would require one — see Open Questions.

## Domain Notes

- **Karma** — existing CONTEXT.md term. The currency this feature spends.
- **Improvement** — a single staged or applied change to the character sheet purchased with
  Karma. New term being introduced by this feature; should be added to CONTEXT.md.
  Discriminated by `ImprovementType` (`attrIncrease`, `skillIncrease`, `skillGroupIncrease`,
  `skillSpecialization`, `learnActiveSkill`, `learnSkillGroup`, `learnKnowledgeSkill`,
  `learnLanguageSkill`, `learnSpell`, `learnComplexForm`).
- **Improvement Queue** — the in-memory, dialog-scoped set of pending `ImprovementEntry`
  objects held by `ImprovementStore`. Cleared on dialog close; flushed to the character sheet
  on Save.
- **Skill Group Breaking** — SR4A rule that splits a Skill Group into its constituent Active
  Skills when one of them is improved or specialised individually. Cross-references the
  existing `breakSkillGroup` helper.
- The CONTEXT.md entries for **Focus / Bonding** already describe `bondFocus` as an
  `ImprovementEntry`. Bonding is not in `ImprovementType` yet — a future slice should add it
  here rather than inventing a parallel mechanism.

## Karma Ledger

A per-character append-only audit trail of every karma earn and spend, stored on
`CharacterSheet.karma.log`. **v1 ships the field, the migration, and the writes** — the
display UI and post-Save undo are deferred to follow-up slices.

### Shape (shipped)

Defined in [`karmaLedgerEntry.ts`](../../src/system/karma/karmaLedgerEntry.ts):

```ts
karma: {
  current: number
  total: number
  log: KarmaLedgerEntry[]    // backfilled to [] on existing characters via migration
}

interface KarmaLedgerEntry {
  id: UUID
  timestamp: string                            // ISO 8601
  amount: number                               // negative = spend, positive = earn / refund
  description: string                          // human-friendly, e.g. "Raised AGI 4 → 5"
  source: "addKarma" | "spendKarma" | "undo"   // "undo" reserved for v2 — unused in v1
  improvement?: ImprovementEntry               // present when source=spendKarma — enables v2 undo / export / replay
  undoes?: UUID                                // present when source=undo (v2)
}
```

### Writes (v1, shipped)
- ✅ **`applyImprovements()`** — appends one entry per `ImprovementEntry` in the queue (not
  one per Save batch — keeps the audit trail useful and matches the future undo unit).
  Description is rendered by `describeImprovement()` in
  [`improvementDescription.ts`](../../src/system/karma/improvements/improvementDescription.ts).
- ✅ **`KarmaStore.addKarma()`** — appends one positive-amount `source: "addKarma"` entry per
  submit from the Add Karma dialog.

### Migration (shipped)

[`017_addKarmaLog.ts`](../../src/data/migrations/017_addKarmaLog.ts)
backfills `log: []` on every existing character — same pattern as
[`016_addFeatureFlags.ts`](../../src/data/migrations/016_addFeatureFlags.ts)
from #297. The schema on `karma` now requires `log` going forward.

### Undo (deferred to v2)
Not implemented in v1. The spec is locked here so the future implementer doesn't re-litigate:

- **Scope**: strictly the most recent ledger entry whose `source === "spendKarma"` — no
  skipping over later entries, no batch undo. The strict-last-spend rule eliminates
  dependency analysis entirely (nothing came after by definition).
- **Affordance**: an "Undo last spend" control in the character-sheet Karma section, enabled
  iff the most recent ledger entry's `source === "spendKarma"` (disabled after an `addKarma`,
  after a prior `undo`, until the next spend lands).
- **Effect — three writes in one atomic `produce()` block**:
  1. Replay the inverse of the original `ImprovementEntry` on the character sheet
  2. Add the original karma cost back to `karma.current`
  3. Append a counter-entry to `karma.log` (do not remove the original — append-only):
     ```ts
     {
       id: <new UUID>,
       timestamp: <now>,
       amount: <abs(original.amount)>,           // positive — refund
       description: `Undid: ${original.description}`,
       source: "undo",
       undoes: original.id,
     }
     ```
- **No re-do.** Re-applying is just a fresh trip through the normal Spend Karma dialog.

### Intentionally out of scope (even for v2)
- Ledger trimming or archival for long-running characters (YAGNI)
- Filtering, search, or grouping in the display
- Per-entry edit — the ledger is immutable; corrections happen via counter-entries

## Optional Rules Integration

Any deliberate deviation from SR4A (cheaper skill groups, no rating caps, karma-learnable
native languages, etc.) is expressed as an entry in
[`src/system/featureFlags/optionalRulesRegistry.ts`](../../src/system/featureFlags/optionalRulesRegistry.ts)
rather than hardcoded in `improvementUtils.ts`. The pattern from
[#297](https://github.com/CptnFizzbin/shadow-sin/pull/297) /
[#298](https://github.com/CptnFizzbin/shadow-sin/pull/298):

1. **Register the variant** — add a `createFlag<Value>({ name, description, source: { book,
   page }, defaultValue })` entry. **`defaultValue` must produce stock SR4A behaviour** so
   absence of the flag is indistinguishable from the rulebook (per [ADR
   0002 — feature-flags-design](../adr/0002-feature-flags-design.md)).
2. **Read at cost-calculation time** — `getImprovementCost` branches on
   `useGameConfig().config.featureFlags?.optionalRules?.<key>` (with the runner-level
   override at `characterSheet.featureFlags?.optionalRules?.<key>` taking precedence once
   per-runner UI is wired).
3. **Don't pollute the entry shape** — `ImprovementEntry` itself stays SR4A-typed; the
   pricing branch is a pure function of `(entry, optionalRules)`.

Concrete candidates surfaced by the resolved open questions:

| Candidate key                        | Effect when on                                                          | Default |
|--------------------------------------|-------------------------------------------------------------------------|--------:|
| `cheaperSkillGroupAdvancement`       | Skill-group rating increase uses `× 2` instead of `× 5`                 |  off    |
| `cheaperKnowledgeSkillAdvancement`   | Knowledge / Language rating increase uses `× 2` instead of `× 1`        |  off    |
| `cheaperComplexFormLearning`         | New complex form costs `5` instead of `2`                               |  off    |
| `allowKarmaForNativeLanguage`        | Surface native language as a `learnLanguageSkill` target                |  off    |
| `noSkillRatingCap`                   | Don't enforce the rating-6 cap (or Aptitude double-cost beyond 6)       |  off    |

None of these are added by this feature on speculation — they enter the registry only when a
group explicitly wants the deviation.

## Interfaces (shipped)

These are no longer sketches — the v1 shapes live in
[`improvementEntry.ts`](../../src/system/karma/improvements/improvementEntry.ts),
[`improvementStore.ts`](../../src/system/karma/improvements/improvementStore.ts), and
[`improvementUtils.ts`](../../src/system/karma/improvements/improvementUtils.ts):

```ts
// One entry per planned spend. Discriminated by `type`.
type ImprovementEntry =
  | AttrIncreaseEntry
  | SkillIncreaseEntry            // active, knowledge, or language — disambiguated by skillType;
                                  //   carries optional `boostedByAptitude` for the rating-7 double-cost rule
  | SkillSpecializationEntry      // also used for language Lingo (stored to skill.lingo by apply path)
  | SkillGroupIncreaseEntry
  | LearnActiveSkillEntry
  | LearnSkillGroupEntry
  | LearnKnowledgeSkillEntry
  | LearnLanguageSkillEntry       // skill.rating narrowed to number — no native via karma
  | LearnSpellEntry
  | LearnComplexFormEntry
  | ComplexFormIncreaseEntry      // v1 — cost: new rating × 1 (parallels Knowledge/Language)
  // Future (deferred slices): BondFocusEntry, LearnPositiveQualityEntry,
  //   BuyOffNegativeQualityEntry, InitiateEntry, SubmergeEntry

// Dialog-scoped store, created fresh by SpendKarmaDialogProvider.
class ImprovementStore {
  add(entry: Omit<ImprovementEntry, "id">): ImprovementEntry
  remove(entry: UUID | ImprovementEntry): void
  removeAll(): void
}

// Pure cost lookup driven entirely by entry shape — no character-sheet access needed.
function getImprovementCost(entry: ImprovementEntry): number

// Single application path. Iterates the queue, applies each entry, deducts karma,
// and appends one karma.log entry per ImprovementEntry — all inside one produce() block.
function applyImprovements(
  improvementsStore: ImprovementStore,
  characterStore: CharacterSheetStore,
): void
```

## Out of Scope

- **Karma earnings** — adding karma (`addKarmaDialog`) was unchanged by this feature, beyond
  the ledger write `KarmaStore.addKarma` now produces. The dialog itself wasn't redesigned.
- **Downtime pacing rules** — SR4A allows one improvement of each kind per downtime, gated by
  an Extended `Intuition + skill` Test (threshold `new rating × 2`, interval 1 week / 1 month
  for groups), and improvements aren't usable until the end of the next adventure. The app
  ships none of this — players self-pace.
- **Build Modes** — Karma Build chargen is tracked separately in
  [`0002-additional-build-modes.md`](./0002-additional-build-modes.md); this feature is
  post-chargen only
- **GM-driven karma adjustments** — out-of-band edits to `karma.current` (corrections, GM
  awards) are not modelled as `ImprovementEntry`s
- **Karma ledger display UI** — the `karma.log` field and writes shipped in v1; the
  on-screen history view is a follow-up slice (see [Karma Ledger](#karma-ledger)).
- **Undo after Save** — deferred to v2; spec locked in
  [Karma Ledger → Undo (deferred to v2)](#undo-deferred-to-v2).
- **Complex-form picker UI** — `complexFormIncrease` entry type and apply path shipped in
  v1 for cost-formula coherence, but the technomancer-facing picker UI is a follow-up slice.
- **Positive qualities (new) and negative-quality buy-off** — need a quality picker, BP×2
  cost surface, and the SR4A "karma debt" rule (when a GM-awarded positive quality exceeds
  current karma, **all subsequent karma earnings** auto-pay the debt until cleared — see
  the wiki `rules/karma-spending.md`). The picker
  must also filter out **Awakened qualities** (Adept / Magician / Mystic Adept /
  Technomancer) and **innate qualities** (Ambidexterity, etc.), which RAW says cannot be
  acquired in play.
- **Focus bonding (`bondFocus`), initiation grades, submersion grades** — each cross-cuts a
  separate magical-advancement feature surface. Their own slices.
- **Metamagic-driven karma spends** — Quickening (1 karma per Force per Combat Turn, lost
  if dispelled), Anchoring, Cannibalize (Street Magic). All depend on the initiation slice
  landing first.
- **Long-term spirit binding** (Street Magic p. 94) — Force karma to lock a spirit into
  semi-permanent service. Lives with the spirit-management slice, not here.
- **Specialization change is _not_ a separate entry type.** The wiki treats new vs swapped
  specs as a single 2-karma spend, and `applySpecialization` already overwrites the existing
  `specialization` / `lingo` on the skill, so renaming is implicit in the existing
  `skillSpecialization` entry type. The v1 specialization picker dialog exposes this via a
  "click the chip to rename" affordance on queued specs.
- **Lifestyle / group / foundation expenditures** — all separate features

## Related Features

- [`docs/features/0002-additional-build-modes.md`](./0002-additional-build-modes.md) — Karma
  Build chargen will reuse the same cost formulas; sharing `getImprovementCost` (or its
  building blocks) is desirable
- [`docs/features/0006-game-effect-resolution-model.md`](./0006-game-effect-resolution-model.md)
  — Focus bonding (a future `ImprovementType`) produces `GameEffect`s on activation
- [`docs/features/0007-migration-system-improvement.md`](./0007-migration-system-improvement.md)
  — if a persistent karma ledger is added later, the new schema version scheme should
  be in place first
- [ADR 0002 — feature-flags-design](../adr/0002-feature-flags-design.md) — the namespaced
  registry pattern that any house-rule cost / cap deviations for this feature plug into
- [#297](https://github.com/CptnFizzbin/shadow-sin/pull/297) — `FeatureFlagsData`,
  `optionalRulesRegistry`, GameConfig type
- [#298](https://github.com/CptnFizzbin/shadow-sin/pull/298) — `GameConfigProvider`
  (runtime home for the GM-layer config that house-rule toggles read from)

## Sources

Rules references live in the **ShadowSinWiki** project, which is the canonical SR4A
reference for this project. Pages are named below without paths — paths vary by where
the wiki is checked out and shouldn't be hardcoded in this repo.

- `rules/karma-spending.md` — single-page index of **every** documented way to spend
  karma (SR4A + Runner's Companion + Street Magic). The deferred-slice list above is
  derived from this taxonomy; any new spend category added to the wiki should reach this
  plan as either an in-scope item or a new DEFER entry.
- `rules/character-improvement.md` — SR4A p. 269–271; the advancement cost table this
  feature's formulas must match.
- `rules/karma.md` — SR4A p. 71, 269; what Karma is and the spending categories.
- `rules/karma-chargen.md` — Karma-as-chargen variant; informs the shared cost-formula
  question with feature [0002](./0002-additional-build-modes.md).

When the cost-formula questions above are settled, update the affected wiki pages too if any
of our decisions are deliberate house-rule deviations from RAW.
