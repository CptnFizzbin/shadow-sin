# Dice Pool Selectors: replace `use*DiceGroup` / `use*DicePool` hooks

> **Status:** In Progress
>
> **GitHub Issues / PRs:**
> - Stage 1: https://github.com/CptnFizzbin/shadow-sin/pull/650

Dice groups and dice pools are built today by a family of hooks — `useAttrDiceGroup`,
`useActiveSkillDiceGroup`, `useWoundDiceGroup`, `useEncumbranceDiceGroup`, `useArmorDiceGroup`,
`useActiveSkillDicePool`, `useKnowledgeSkillDicePool`, `useLanguageSkillDicePool`. Each one reads
state through `useRunnerSelector`/`useEntitySelector` and then does rule arithmetic in the hook
body. That is a second read path next to Selectors, and it hides rule logic where it can't be unit
tested without rendering. This feature moves it onto memoized, namespaced Selectors
([ADR-0014](../adr/0014-selector-input-decomposition.md)) that pass pure Formulas
([ADR-0015](../adr/0015-formulas-for-rule-calculations.md)) as their combiners.

## Decisions

- **Two namespaces.** `DiceGroupSelectors` (`src/state/runner/diceGroup/`) builds the individual
  groups. `DicePoolSelectors` (`src/state/runner/dicePool/`) builds whole pools.
- **Pools are built only from groups.** `DicePoolSelectors` imports `DiceGroupSelectors` and
  nothing else from the store: no `AttrSelectors`, `SkillsSelectors`, or GameEffect reads.
- **Groups read raw value selectors.** Each `DiceGroupSelectors` member reads plain value
  selectors (`AttrSelectors.selectValue`, `SkillsSelectors.selectValue`,
  `DamageSelectors.selectWoundMod`, `ItemSelectors.Armor.selectBulk` / `selectEffective`) and
  turns the values into groups. Groups never build on other groups. Knowledge and Language Skills
  have no stable key to look a rating up by, so their group selectors take the rating as an option.
- **Every group selector returns `DiceGroup[]`.** It's empty when the group contributes nothing
  (no Wound Modifier, for example), so pools concatenate groups without null checks.
- **One Active Skill rule.** `DiceGroupSelectors.selectSkill` respects
  `skillList[skill].defaultable` and lists the `skillMod` total and the Specialization bonus as
  separate `bonus` groups. The old hook folded mods into the skill's group and let every skill
  default. The earlier `selectAttrTest` / `selectSkillTest` moved into `DiceGroupSelectors` as
  `selectAttr` / `selectSkill`.
- **A Selector collects, a Formula decides.** GameEffect summing and the trained / Defaulting /
  untrained decision are `DicePoolFormulas` in `system/formulas/dicePool/`. Encumbrance reuses the
  existing `calculateArmorBulk` / `calculateEncumbrancePenalty`. Labels, group types, and pool
  ids/names are presentation, so they stay in the Selector.

## Constraints

- **No stage breaks a call site.** [ADR-0013](../adr/0013-unify-runner-state-access.md) was
  reverted in part for migrating every call site in one pass. Each stage below ships on its own,
  and the hooks keep their names and arguments until nothing calls them. Their return type
  widened to `DiceGroup[]`, so Stage 1 updates the two callers that read a single group's fields
  (the Defense Calculator and the Drain Resistance pool).

## Stages

1. **Selectors + Formulas, hooks become wrappers.** Add `DicePoolFormulas`, `DiceGroupSelectors`
   (`selectAttr`, `selectSkill`, `selectKnowledgeSkill`, `selectLanguageSkill`, `selectWound`,
   `selectEncumbrance`, `selectArmor`), and `DicePoolSelectors` (`selectStandardTest`,
   `selectActiveSkill`, `selectKnowledgeSkill`, `selectLanguageSkill`). Each hook becomes a
   one-line delegation marked `@deprecated`. `DicePool` keys its rows by index, so groups no
   longer need a `useId()`-generated `id`, which a Selector can't produce.
2. **Migrate call sites, one area per PR.** Replace hook calls with
   `useRunnerSelector(DiceGroupSelectors.…)` / `useRunnerSelector(DicePoolSelectors.…)` (or
   `useEntitySelector` for Attribute groups) one area at a time: skills lists, magician pools
   (spellcasting / drain / summoning), resistance pools, the Defense and Attack Calculators,
   legwork, and the Availability Test dialog (#643) once it has merged. Pools that several
   components assemble the same way become new `DicePoolSelectors` members.
3. **Delete the hooks.** Once `yarn fallow dead-code` reports a hook as unused, remove it, together
   with `useEncumbrance` if nothing else reads it.

## Open questions

- **Wound counted twice.** `DicePool` adds the Wound group itself (`includeWound` defaults to
  `true`), but many pools also pass `useWoundDiceGroup()` in `groups`, so the Wound Modifier is
  applied twice. `ResistDamageDicePool` also applies it, even though it doesn't list it. Stage 2
  is the natural place to settle which side owns the Wound group.
- **Entity scope for Encumbrance.** `useEncumbrance` read Body through `useEntitySelector`. The
  Stage 1 wrapper reads `selectEncumbrance` through `useRunnerSelector`. Today every caller sits in
  Runner scope, so the result is the same.
