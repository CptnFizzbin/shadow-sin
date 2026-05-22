# Spend Karma — Post-Chargen Advancement

> **Status:** In Progress
>
> **GitHub Issues / PRs:**
> - [#273](https://github.com/CptnFizzbin/shadow-sin/pull/273) — early karma-system planning doc (closed; superseded by this feature doc)
> - [#274](https://github.com/CptnFizzbin/shadow-sin/pull/274) — first implementation slice: dialog + improvement queue for attributes, skills, skill groups, knowledge, language

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
choice are captured in [Open Questions](#open-questions) below.

## Open & Resolved Questions

Resolved items are marked `[x]` with the decision inline; unresolved ones keep `[ ]` and
explain what's still in the air. **Any decision recorded as a house-rule deviation must be
routed through the optional-rules registry** — see [Optional Rules
Integration](#optional-rules-integration) below.

- [ ] **Do we need a persistent karma ledger?** #273 proposed `karma.log` as a per-character
      audit trail of every advancement purchased ("Raised Agility 3 → 4 on 2025-08-14, −20k").
      #274 ships without one — staged entries vanish on Save and only `karma.current` records
      that anything was spent. Without a ledger there is no in-app "what did I buy last
      session?" view and no foundation for an Undo-Last-Purchase feature. If we want it, where
      does it live (CharacterSheet vs RunnerData session tier vs a new store) and when does it
      land — this slice, a follow-up slice, or a separate feature?

- [x] **`mode: 'chargen' | 'advancement'` field on the character sheet — not needed.** The
      implicit split holds: BP controls live in the **builder** view; the Spend Karma dialog
      lives in the **character-sheet** view. Which UI surface you're on is the chargen-vs-
      advancement marker. No `mode` field, no migration, no extra Zod schema field. If a flow
      later proves the split insufficient (GM mid-game retroactive edits, etc.), reopen as a
      separate decision.

- [x] **Cost-formula deviations from SR4A — fix to SR4A defaults; route any intentional
      group-level deviation through `optionalRulesRegistry`.** Each value in
      `improvementUtils.ts` is treated as a bug against the
      [SR4A advancement table](../../../ShadowSinWiki/rules/character-improvement.md) until
      shown otherwise; the defaults below are what the code should compute when no optional
      rule is set. If a group wants to keep one of the cheaper variants, expose it as a new
      entry in
      [`optionalRulesRegistry.ts`](../../src/system/featureFlags/optionalRulesRegistry.ts)
      (e.g. `cheaperSkillGroupAdvancement: createFlag<boolean>({ defaultValue: false, … })`)
      and branch on it inside `getImprovementCost`.
  - Fix: `skillGroupIncrease` per-step → **`× 5`** (was `× 2`)
  - Fix: `skillIncrease` for Knowledge / Language → **`× 1`** (was `× 2`)
  - Fix: `learnSkillGroup` per-step raise → **`× 5`**
  - Fix: `learnKnowledgeSkill` / `learnLanguageSkill` per-step raise → **`× 1`**
  - Fix: `learnComplexForm` → **flat `2`** (was `5`)
  - Add: `complexFormIncrease` entry type — `new rating × 1` per step
  - (Already correct: attribute `× 5` — including Magic / Resonance / Edge, which SR4A also
      prices at `× 5`; active-skill `× 2`; new-skill bases of `4` / `10` / `2`; specialization
      flat `2`; new spell flat `5`.)

- [ ] **What happens to an applied improvement we want to take back?** No undo path exists
      after Save — `karma.current` is decremented and the character-sheet change is permanent.
      Acceptable for v1, or do we need a way to reverse the last batch (e.g. by replaying the
      inverse of each entry in the queue)? A persistent ledger would make this trivial.

- [x] **Rating 6, Aptitude, and attribute caps — enforce SR4A defaults at the queue layer.**
      The dialog should block any `ImprovementEntry` that would exceed the cap *before* it
      lands in the queue (not at Save). Caps to enforce, per
      [character-improvement](../../../ShadowSinWiki/rules/character-improvement.md):
  - Active skill cap at 6 unless the character has the
      [`Aptitude`](../../../ShadowSinWiki/qualities/aptitude.md) quality for that skill;
      with Aptitude, the cap is 7 and raises beyond 6 cost **double Karma per step**.
  - Attribute cap = metatype maximum (`+1` to one attribute with
      [`Exceptional Attribute`](../../../ShadowSinWiki/qualities/exceptional-attribute.md)).
  - Magic / Resonance cap = `6 + initiation/submersion grade`.
  - A future "soft caps" optional rule could relax these, but the default matches the book.

- [ ] **Scope of "Spend Karma" v1** — which improvement types must ship in the first merged
      PR vs. follow-up slices? Currently shipped: attribute, active skill increase + learn,
      skill group increase + learn, knowledge skill increase + learn, language skill increase +
      learn, specialization. Not yet shipped: spells (UI placeholder, entry type exists),
      complex forms (no `complexFormIncrease` entry type), positive qualities, negative-quality
      buy-off, focus bonding, initiation, submersion.

- [x] **Native-language pricing — suppress.** Per SR4A, native languages cannot be learned
      with Karma. The UI must not surface native as an option in `learnLanguageSkill`; the
      current "treat as rating 1" fallback is dead code paths. If a group wants to allow it,
      that's a future optional rule (`allowKarmaForNativeLanguage`); defaults to off.

## Constraints

- **SR4A is the rulebook source of truth.** Every cost formula in `improvementUtils.ts`
  must match the [SR4A advancement
  table](../../../ShadowSinWiki/rules/character-improvement.md) by default. Group-level
  deviations live in
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
  constituent active skills at the group's rating. This is already implemented in
  `breakSkillGroup()` but must hold for any new entry types that touch a grouped skill.
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

## Rough Interface Sketches

```ts
// One entry per planned spend. Discriminated by `type`.
type ImprovementEntry =
  | AttrIncreaseEntry
  | SkillIncreaseEntry            // active, knowledge, or language — disambiguated by skillType
  | SkillSpecializationEntry
  | SkillGroupIncreaseEntry
  | LearnActiveSkillEntry
  | LearnSkillGroupEntry
  | LearnKnowledgeSkillEntry
  | LearnLanguageSkillEntry
  | LearnSpellEntry
  | LearnComplexFormEntry
  // Future: BondFocusEntry, LearnQualityEntry, BuyOffNegativeQualityEntry, InitiateEntry,
  //         SpecialAttrIncreaseEntry

// Dialog-scoped store, created fresh by SpendKarmaDialogProvider.
class ImprovementStore {
  add(entry: Omit<ImprovementEntry, "id">): ImprovementEntry
  remove(entry: UUID | ImprovementEntry): void
  removeAll(): void
}

// Pure cost lookup driven entirely by entry shape — no character-sheet access needed.
function getImprovementCost(entry: ImprovementEntry): number

// Single application path. Iterates the queue, mutates the sheet, deducts karma.
function applyImprovements(
  improvementsStore: ImprovementStore,
  characterStore: CharacterSheetStore,
): void
```

## Out of Scope

- **Karma earnings** — adding karma (`addKarmaDialog`) is unchanged and not part of this
  feature
- **Downtime pacing rules** — SR4A allows one improvement of each kind per downtime, gated by
  an Extended `Intuition + skill` Test (threshold `new rating × 2`, interval 1 week / 1 month
  for groups), and improvements aren't usable until the end of the next adventure. The app
  ships none of this — players self-pace.
- **Build Modes** — Karma Build chargen is tracked separately in
  [`0002-additional-build-modes.md`](./0002-additional-build-modes.md); this feature is
  post-chargen only
- **GM-driven karma adjustments** — out-of-band edits to `karma.current` (corrections, GM
  awards) are not modelled as `ImprovementEntry`s
- **Persistent advancement history** — until the [karma-ledger question](#open-questions)
  resolves, applied entries are not retained
- **Initiation / submersion grades, focus bonding, group / foundation rules, lifestyle
  expenditures** — all separate features

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

Rules references live in the sibling **ShadowSinWiki** repo (`../../../ShadowSinWiki/`),
which is the canonical SR4A reference for this project:

- [`rules/character-improvement.md`](../../../ShadowSinWiki/rules/character-improvement.md) —
  SR4A p. 269–271; the advancement cost table this feature's formulas must match
- [`rules/karma.md`](../../../ShadowSinWiki/rules/karma.md) — SR4A p. 71, 269; what Karma is
  and the spending categories
- [`rules/karma-chargen.md`](../../../ShadowSinWiki/rules/karma-chargen.md) — Karma-as-chargen
  variant; informs the shared cost-formula question with feature
  [0002](./0002-additional-build-modes.md)

When the cost-formula questions above are settled, update the affected wiki pages too if any
of our decisions are deliberate house-rule deviations from RAW.
