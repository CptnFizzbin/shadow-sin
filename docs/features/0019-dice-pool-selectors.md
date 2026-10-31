# Dice Pool Selectors: Ratings, Dice Groups, and Dice Pools

> **Status:** In Progress
>
> **GitHub Issues / PRs:**
> - #653 — one `createDicePoolSelector` call per pool; `DicePool` takes `DicePoolData`; the
>   `use*DiceGroup` / `use*DicePool` hooks are gone.
> - #650 — the Raw Value → Rating → Modifier layer, `DiceGroupSelectors`, and the Wound and
>   Encumbrance rules below.

Every dice pool is built by memoized, namespaced Selectors
([ADR-0014](../adr/0014-selector-input-decomposition.md)) whose rule logic lives in pure Formulas
([ADR-0015](../adr/0015-formulas-for-rule-calculations.md)), so a pool shows exactly where each
die came from. The terms below are defined in [`CONTEXT.md`](../../CONTEXT.md).

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
4. **Dice Groups** (`DiceGroupSelectors`) are sized by a Rating. A group's optional `modifiers`
   list what its size is made of, for display only: the size already includes them, so a pool
   never adds them again. Every group selector returns `DiceGroup[]`, empty when it adds nothing.
   The Specialization bonus and Defaulting stay their own groups.
5. **Dice Pools** are built only from `DiceGroupSelectors` groups, each with one
   `createDicePoolSelector` call in a per-area namespace (`CombatPoolSelectors`,
   `MagicPoolSelectors`, `SkillPoolSelectors`, `ContactPoolSelectors`). That helper adds the Wound
   Modifier unless the pool's config sets `excludeWoundMod`, which every Resistance Test does
   (damage, direct spell, Drain), as does the GM's legwork roll, since the Contact rolls it.
   Defense and spell tests keep it.

Other decisions:

- Knowledge and Language Skills carry no Modifiers yet, so their group selectors take the rating
  as an option.
- **A Selector collects, a Formula decides.** `RatingFormulas` (Modifiers, Ratings, the cap),
  `DicePoolFormulas.isDefaulting`, and `isEncumberedAttribute` / `calculateEncumbrancePenalty`
  hold the rule logic. Labels, group types, and pool ids/labels are presentation, so they stay in
  the Selector.
