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

## Open Questions

These are the design decisions that the queue model in #274 leaves on the table — most are
deliberate deferrals, but each needs an explicit answer before the feature ships:

- [ ] **Do we need a persistent karma ledger?** #273 proposed `karma.log` as a per-character
      audit trail of every advancement purchased ("Raised Agility 3 → 4 on 2025-08-14, −20k").
      #274 ships without one — staged entries vanish on Save and only `karma.current` records
      that anything was spent. Without a ledger there is no in-app "what did I buy last
      session?" view and no foundation for an Undo-Last-Purchase feature. If we want it, where
      does it live (CharacterSheet vs RunnerData session tier vs a new store) and when does it
      land — this slice, a follow-up slice, or a separate feature?
- [ ] **Do we need a `mode: 'chargen' | 'advancement'` field on the character sheet?** #273
      proposed one to decide which currency and cost table is in play. #274 sidesteps the
      question by placing the Spend Karma dialog in the character-sheet view (post-chargen) and
      BP controls in the builder — chargen vs advancement is implicit in **which UI surface you
      are using**. Is that good enough, or are there flows (e.g. mid-build karma earnings, GM
      adjustments, retroactive sheet edits) where the implicit split breaks down?
- [ ] **Cost-formula deviations from SR4A — bugs or intentional house rules?** Cross-checked
      against the [ShadowSinWiki rules
      page](../../../ShadowSinWiki/rules/character-improvement.md) (SR4A p. 270). Most
      formulas in `improvementUtils.ts` match the table; these do not:
  - `skillGroupIncrease` uses `× 2`; SR4A is **`× 5`**
  - `skillIncrease` for `KnowledgeSkill` / `LanguageSkill` uses `× 2`; SR4A is **`× 1`**
      (just "new rating")
  - `learnSkillGroup` per-step raise uses `× 2`; should be `× 5` if the base+raise
      composition stays
  - `learnKnowledgeSkill` / `learnLanguageSkill` per-step raise uses `× 2`; should be `× 1`
  - `learnComplexForm` is flat `5`; SR4A is **`2`**
  - No `complexFormIncrease` entry type — improving an existing complex form (`new rating × 1`
      per step) cannot be staged today
  - (Already correct: attribute `× 5` — including Magic / Resonance / Edge, which SR4A also
      prices at `× 5`; active-skill `× 2`; new-skill bases of `4` / `10` / `2`; specialization
      flat `2`; new spell flat `5`.)
- [ ] **What happens to an applied improvement we want to take back?** No undo path exists
      after Save — `karma.current` is decremented and the character-sheet change is permanent.
      Acceptable for v1, or do we need a way to reverse the last batch (e.g. by replaying the
      inverse of each entry in the queue)? A persistent ledger would make this trivial.
- [ ] **Should the queue enforce Rating 6, Aptitude, and attribute caps?** SR4A caps each
      Active Skill at rating 6 unless the character has the [`Aptitude`
      quality](../../../ShadowSinWiki/qualities/aptitude.md) for that skill — and raises
      beyond 6 with Aptitude cost **double Karma per step**. Attributes cap at the metatype
      maximum (`+1` with [`Exceptional Attribute`](../../../ShadowSinWiki/qualities/exceptional-attribute.md));
      Magic and Resonance cap at `6 + initiation/submersion grade`. PR #274 does not appear to
      enforce any of these. Block at the queue layer, at the UI layer, or punt to a future
      validation pass?
- [ ] **Scope of "Spend Karma" v1** — which improvement types must ship in the first merged
      PR vs. follow-up slices? Currently shipped: attribute, active skill increase + learn,
      skill group increase + learn, knowledge skill increase + learn, language skill increase +
      learn, specialization. Not yet shipped: spells (UI placeholder, entry type exists),
      complex forms (no `complexFormIncrease` entry type), positive qualities, negative-quality
      buy-off, focus bonding, initiation, submersion.
- [ ] **Native-language pricing** — `learnLanguageSkill` for a native language is treated as
      "rating 1" for cost purposes. Per SR4A, native languages can't be learned with karma at
      all. Should the UI suppress this option, or is the current cost a safe fallback?

## Constraints

- **SR4A is the rulebook source of truth** — every cost formula traces back to the SR4A
  advancement table (p. 270). Where the implementation diverges, the table wins unless we
  record a deliberate house-rule decision.
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
  — if a persistent karma ledger or `mode` field is added, the new schema version scheme should
  be in place first

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
