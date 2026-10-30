# Dice Pool Selectors: replace `use*DiceGroup` / `use*DicePool` hooks

> **Status:** In Progress
>
> **GitHub Issues / PRs:**
> <!-- Stage 1 PR is linked here once opened. -->

Dice groups and dice pools are built today by a family of hooks — `useAttrDiceGroup`,
`useActiveSkillDiceGroup`, `useWoundDiceGroup`, `useEncumbranceDiceGroup`, `useArmorDiceGroup`,
`useActiveSkillDicePool`, `useKnowledgeSkillDicePool`, `useLanguageSkillDicePool`. Each one reads
state through `useRunnerSelector`/`useEntitySelector` and then does rule arithmetic in the hook
body. That is a second read path next to Selectors, and it hides rule logic where it can't be unit
tested without rendering. This feature moves it onto memoized, namespaced Selectors
([ADR-0014](../adr/0014-selector-input-decomposition.md)) that pass pure Formulas
([ADR-0015](../adr/0015-formulas-for-rule-calculations.md)) as their combiners.

## Constraints

- **No stage breaks a call site.** [ADR-0013](../adr/0013-unify-runner-state-access.md) was
  reverted in part for migrating every call site in one pass. Each stage below ships on its own,
  and the hooks keep their signatures until nothing calls them.
- **Behavior parity first.** Stage 1 reproduces each hook's output exactly, including its quirks
  (see Open questions). Fixing a quirk is a separate, visible change, not a side effect of the
  refactor.
- **A Selector collects, a Formula decides.** GameEffect summing and the trained / Defaulting /
  untrained decision are Formulas in `system/formulas/dicePool/`. Labels, group types, and pool
  ids/names are presentation, so they stay in the Selector.

## Stages

1. **Selectors + Formulas, hooks become wrappers.** Add `DicePoolFormulas` and the
   `DicePoolSelectors` members `selectAttrGroup`, `selectActiveSkillGroup`, `selectWoundGroup`,
   `selectEncumbranceGroup`, `selectArmorGroup`, `selectActiveSkillPool`,
   `selectKnowledgeSkillPool`, `selectLanguageSkillPool`. Each hook becomes a one-line delegation
   marked `@deprecated`, so every existing call site runs on the new Selectors unchanged.
   `DicePool` keys its rows by index, so groups no longer need a `useId()`-generated `id`; that
   `id` was the one thing a Selector couldn't reproduce.
2. **Migrate call sites, one area per PR.** Replace hook calls with
   `useRunnerSelector(DicePoolSelectors.…)` (or `useEntitySelector` for Attribute groups) one
   area at a time: skills lists, magician pools (spellcasting / drain / summoning), resistance
   pools, the defense and attack calculators, legwork, and the Availability Test dialog (#643)
   once it has merged. Each PR only touches its own area.
3. **Delete the hooks.** Once `yarn fallow dead-code` reports a hook as unused, remove it, together
   with `useEncumbrance` if nothing else reads it.

## Open questions

- **Two Active Skill group semantics.** `selectActiveSkillGroup` (hook parity) folds `skillMod`
  effects into one group, always allows Defaulting unless `excludeDefaulting` is set, and ignores
  `skillList[skill].defaultable`. The earlier `selectSkillTest` (used by the attack calculator)
  emits the mod as a separate `bonus` group and respects `defaultable`. They should converge on
  one behavior. `selectSkillTest`'s handling of `defaultable` is probably the correct rule.
- **Wound counted twice.** `DicePool` adds the Wound group itself (`includeWound` defaults to
  `true`), but many pools also pass `useWoundDiceGroup()` in `groups`, so the Wound Modifier is
  applied twice. `ResistDamageDicePool` also applies it, even though it doesn't list it. Stage 2
  is the natural place to settle which side owns the Wound group.
- **Entity scope for Encumbrance.** `useEncumbrance` read Body through `useEntitySelector`.
  `selectEncumbranceGroup` reads it from whichever entity the caller's hook provides, and the
  Stage 1 wrapper uses `useRunnerSelector`. Today every caller sits in Runner scope, so the result
  is the same.
