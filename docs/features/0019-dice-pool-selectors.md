# Dice Pool Selectors: replace `use*DiceGroup` / `use*DicePool` hooks

> **Status:** In Progress
>
> **GitHub Issues / PRs:**
> - Stage 1: https://github.com/CptnFizzbin/shadow-sin/pull/650

Dice groups and dice pools are built today by a family of hooks — `useAttrDiceGroup`,
`useActiveSkillDiceGroup`, `useWoundDiceGroup`, `useEncumbranceDiceGroup` (removed), `useArmorDiceGroup`,
`useActiveSkillDicePool`, `useKnowledgeSkillDicePool`, `useLanguageSkillDicePool`. Each one reads
state through `useRunnerSelector`/`useEntitySelector` and then does rule arithmetic in the hook
body. That is a second read path next to Selectors, and it hides rule logic where it can't be unit
tested without rendering. This feature moves it onto memoized, namespaced Selectors
([ADR-0014](../adr/0014-selector-input-decomposition.md)) that pass pure Formulas
([ADR-0015](../adr/0015-formulas-for-rule-calculations.md)) as their combiners.

## Decisions

The selectors form one chain, each layer reading only the one below it:

1. **Raw value**, before any modifiers: `AttrSelectors.selectRawValue`, `SkillsSelectors.selectRawValue`.
   The term "value" is deprecated: `selectValue` survives only as a `@deprecated` alias of
   `selectRawValue`.
2. **Modifiers**: active GameEffects targeting the attribute or skill, each named after its source
   (`SourcedGameEffectSelectors.selectAll`, `RatingFormulas.getModifiers`). They only apply to the
   Runner's own attributes and skills, not to another entity in scope such as an Agent.
3. **Rating** = raw value + modifiers: `AttrSelectors.selectRating` / `selectRatingBreakdown` and
   `SkillsSelectors.selectRating` / `selectRatingBreakdown`. An Attribute's rating is capped at its
   augmented maximum, and a cap that applies is listed as its own negative modifier. Agility and
   Reaction also carry the Encumbrance penalty as a modifier, applied after the cap. `rating`
   always equals `rawValue` plus the sum of `modifiers` (`RatingFormulas`).
4. **Dice groups** (`DiceGroupSelectors`) are sized by a rating. A group's optional `modifiers`
   list what the size is made of, for display only: the size already includes them, so a pool
   never adds them again. Every group selector returns `DiceGroup[]`, empty when it adds nothing.
   The Specialization bonus and Defaulting stay their own groups, never folded into the skill's
   rating.
5. **Dice pools** (`DicePoolSelectors`) are built only from `DiceGroupSelectors` groups, and add the
   Wound Modifier automatically unless the caller passes `includeWound: false`. A Resistance Test
   (resisting damage, a direct spell, or Drain) never includes it; defense and spell tests do. The `DicePool` component no longer adds
   a Wound group itself, which fixes the Wound Modifier being counted twice.

Other decisions:

- Knowledge and Language Skills have no stable key to look a rating up by, so their group
  selectors take the rating as an option.
- **A Selector collects, a Formula decides.** `RatingFormulas` (modifiers, ratings, the cap) and
  `DicePoolFormulas.isDefaulting` hold the rule logic. Labels, group types, and pool ids/names are
  presentation, so they stay in the Selector.

## Constraints

- **No stage breaks a call site.** [ADR-0013](../adr/0013-unify-runner-state-access.md) was
  reverted in part for migrating every call site in one pass. Each stage below ships on its own,
  and the hooks keep their names and arguments until nothing calls them. Their return type
  widened to `DiceGroup[]`, so Stage 1 updates the two callers that read a single group's fields
  (the Defense Calculator and the Drain Resistance pool).

## Stages

1. **Ratings, selectors, and Formulas; hooks become wrappers.** Add the raw value / rating
   selectors, `RatingFormulas`, `DicePoolFormulas`, `DiceGroupSelectors`
   (`selectAttr`, `selectSkill`, `selectKnowledgeSkill`, `selectLanguageSkill`, `selectWound`,
   `selectArmor`), and `DicePoolSelectors` (`selectStandardTest`,
   `selectActiveSkill`, `selectKnowledgeSkill`, `selectLanguageSkill`). Each hook becomes a
   one-line delegation marked `@deprecated`, except `useEncumbranceDiceGroup`, which is removed now
   that Encumbrance lives in the ratings. `DicePool` keys its rows by index, so groups no longer
   need a `useId()`-generated `id`, which a Selector can't produce.
2. **Migrate call sites, one area per PR.** Replace hook calls with
   `useRunnerSelector(DiceGroupSelectors.…)` / `useRunnerSelector(DicePoolSelectors.…)` (or
   `useEntitySelector` for Attribute groups) one area at a time: skills lists, magician pools
   (spellcasting / drain / summoning), resistance pools, the Defense and Attack Calculators,
   legwork, and the Availability Test dialog (#643) once it has merged. Pools that several
   components assemble the same way become new `DicePoolSelectors` members.
3. **Delete the hooks.** Once `yarn fallow dead-code` reports a hook as unused, remove it, together
   with `useEncumbrance` if nothing else reads it.

## Open questions

- **"Equipped" for implants.** Modifiers come only from equipped Items, and implants such as the
  sample Runner Artemis's Cerebral Booster don't set `equipped`, so their effects don't apply.
  That predates this feature.
