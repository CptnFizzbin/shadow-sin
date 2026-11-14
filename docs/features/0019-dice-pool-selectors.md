# Dice Pool Selectors: Ratings, Dice Groups, and Dice Pools

> **Status:** In Progress
>
> **GitHub Issues / PRs:**
> - #653 — one `createDicePoolSelector` call per pool; `DicePool` takes `DicePoolData`; the
>   `use*DiceGroup` / `use*DicePool` hooks are gone.
> - #650 — the Raw Value → Rating → Modifier layer, the `DiceGroups` sub-namespaces, the
>   `createDicePoolSelector({ id, label, groups })` form, and the Wound and
>   Encumbrance rules below.

Every dice pool is built by memoized, namespaced Selectors
([ADR-0014](../adr/0014-selector-input-decomposition.md)) whose rule logic lives in pure Formulas
([ADR-0015](../adr/0015-formulas-for-rule-calculations.md)), so a pool shows exactly where each
die came from. The terms below are defined in [`GLOSSARY.md`](../../GLOSSARY.md).

## Decisions

The selectors form one chain, each layer reading only the one below it:

1. **Raw Value**, before any Modifiers: `AttrSelectors.selectRawValue`,
   `SkillsSelectors.selectRawValue`. The term "value" is deprecated: `selectValue` survives only as
   a `@deprecated` alias of `selectRawValue`.
2. **Modifiers**: active GameEffects targeting the Attribute or Skill, each named after its source
   (`SourcedGameEffectSelectors.selectAll`, `RatingFormulas.getModifiers`). They only apply to the
   Runner's own Attributes and Skills, not to another Entity in scope such as an Agent.
3. **Rating** = Raw Value + Modifiers: `selectRating` / `selectRatingBreakdown` on both
   `AttrSelectors` and `SkillsSelectors`. An Attribute's Rating is capped at its Augmented Maximum,
   and a cap that applies is listed as its own negative Modifier. Agility and Reaction also carry
   the Encumbrance penalty as a Modifier, applied after the cap. `rating` always equals `rawValue`
   plus the sum of `modifiers` (`RatingFormulas`).
4. **Dice Groups** live in a `DiceGroups` sub-namespace of the domain they come from:
   `AttrSelectors.DiceGroups.selectAttr`, `SkillsSelectors.DiceGroups.selectSkill` /
   `selectSpecialization` / `selectKnowledgeSkill` / `selectLanguageSkill`,
   `ItemSelectors.Armor.DiceGroups.selectArmor`, and `DamageSelectors.DiceGroups.selectWoundMod`.
   Attribute and Skill groups are sized by a Rating and carry its `breakdown` (Raw Value and
   Modifiers), which `DicePool` lists under the group as an indented list. It's for display only:
   the size already includes it, so a pool never adds it again. Every group selector
   returns `DiceGroup[]`, empty when it adds nothing. The Specialization bonus and Defaulting stay
   their own groups.
5. **Dice Pools** are declared with `createDicePoolSelector({ id, label, groups, excludeWoundMod })`
   in a per-area namespace (`CombatPoolSelectors`, `MagicPoolSelectors`, `SkillPoolSelectors`,
   `ContactPoolSelectors`): `groups` is the ordered list of Dice Group selectors, and the result
   is the pool's flattened groups and size. The helper appends
   `DamageSelectors.DiceGroups.selectWoundMod` unless `excludeWoundMod` is set, which every
   Resistance Test does (damage, direct spell, Drain), as does the GM's legwork roll, since the
   Contact rolls it. Defense and spell tests keep it.
6. **Pool ids and labels are fixed.** Where the label depends on the pool's options (the damage
   type, the parrying skill, Summoning vs Binding, the skill and Specialization of a skill pool),
   the component or hook showing the pool sets the label (and, for skill pools, the id).

Other decisions:

- Knowledge and Language Skills carry no Modifiers yet, so their group selectors take the rating
  as an option.
- **A Selector collects, a Formula decides.** `RatingFormulas` (Modifiers, Ratings, the cap),
  `DicePoolFormulas.isDefaulting`, and `isEncumberedAttribute` / `calculateEncumbrancePenalty`
  hold the rule logic. Labels, group types, and pool ids/labels are presentation, so they stay in
  the Selector.
