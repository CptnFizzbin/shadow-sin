import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { DicePoolFormulas } from "#/system/formulas/dicePool/dicePoolFormulas.ts"
import type { RatingBreakdown } from "#/system/formulas/ratings/ratingFormulas.ts"
import type { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { AttributeLabels } from "#/system/model/attributes/attributeKey.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import { skillList } from "#/system/model/skills/skillList.ts"
import { SRC } from "#/system/model/systemValues.ts"

const NO_GROUPS: DiceGroup[] = []

/** Adapts the domain selectors' option names to this domain's `attr` / `skill` options. */
const selectAttrRating = (state: EntityScope, { attr }: { attr: AttributeKey }) =>
  AttrSelectors.selectRatingBreakdown(state, { attr })

const selectSkillRating = (state: EntityScope, { skill }: { skill: SkillKey }) =>
  SkillsSelectors.selectRatingBreakdown(state, { skill })

/** A group sized by a rating, listing the rating's modifiers when there are any. */
const ratingGroup = (group: Omit<DiceGroup, "size" | "modifiers">, { rating, modifiers }: RatingBreakdown): DiceGroup =>
  modifiers.length === 0 ? { ...group, size: rating } : { ...group, size: rating, modifiers }

/** A flat Specialization (or lingo) bonus group, or none when no `specialization` is given. */
const flatSpecializationGroups = (label: string, specialization: string | undefined): DiceGroup[] =>
  specialization
    ? [{ name: `${label}: ${specialization}`, size: SRC.Skills.Specialization.Modifier, type: "bonus" }]
    : NO_GROUPS

/**
 * The individual {@link DiceGroup}s a dice pool is assembled from, each sized by a Rating (a Raw
 * Value plus its Modifiers). A group's `modifiers` only explain its size — they're already
 * included in it. Every member returns a `DiceGroup[]`, empty when it contributes nothing.
 * Pools are built from these with `createDicePoolSelector`, which also adds the Wound Modifier.
 */
export namespace DiceGroupSelectors {
  /** An Attribute's Rating — including the Encumbrance penalty, for Agility and Reaction. */
  export const selectAttr = createMemoizedSelector(
    selectAttrRating,
    SelectorOptions.attr,
    (breakdown, attr): DiceGroup[] => [ratingGroup({ name: AttributeLabels[attr], type: "attribute" }, breakdown)],
  )

  /**
   * An Active Skill's Rating, plus a separate Defaulting penalty when the skill is untrained,
   * defaultable, and `excludeDefaulting` isn't set. While defaulting, the skill's own group is
   * listed only when Modifiers give it dice.
   */
  export const selectSkill = createMemoizedSelector(
    selectSkillRating,
    SelectorOptions.skill,
    SelectorOptions.excludeDefaulting,
    (breakdown, skill, excludeDefaulting): DiceGroup[] => {
      const isDefaulting = DicePoolFormulas.isDefaulting({
        rawValue: breakdown.rawValue,
        defaulting: !excludeDefaulting && (skillList[skill].defaultable ?? true),
      })

      const groups: DiceGroup[] = []
      if (!isDefaulting || breakdown.modifiers.length > 0) {
        groups.push(ratingGroup({ name: skill, type: "skill" }, breakdown))
      }
      if (isDefaulting) {
        groups.push({ name: `${skill} - Defaulting`, size: SRC.Skills.Defaulting.Modifier, type: "defaulting" })
      }
      return groups
    },
  )

  /** A Specialization's bonus for `skill`, with its Modifiers, or none when no `specialization` is given. */
  export const selectSpecialization = createMemoizedSelector(
    SkillsSelectors.selectSpecializationBreakdown,
    SelectorOptions.specialization,
    (breakdown, specialization): DiceGroup[] =>
      specialization && breakdown
        ? [ratingGroup({ name: `Specialization: ${specialization}`, type: "bonus" }, breakdown)]
        : NO_GROUPS,
  )

  /**
   * A Knowledge Skill's `rating` plus its Specialization bonus when `specialization` is given.
   * Knowledge Skills have no Modifiers yet, so the caller passes the rating in.
   */
  export const selectKnowledgeSkill = createMemoizedSelector(
    SelectorOptions.knowledge,
    SelectorOptions.rating,
    SelectorOptions.specialization,
    (knowledge, rating, specialization): DiceGroup[] => [
      { name: knowledge, size: rating, type: "skill" },
      ...flatSpecializationGroups("Specialization", specialization),
    ],
  )

  /**
   * A Language Skill's `rating` plus its lingo bonus when `lingo` is given. A native Language
   * contributes no rating dice — it always succeeds automatically.
   */
  export const selectLanguageSkill = createMemoizedSelector(
    SelectorOptions.language,
    SelectorOptions.isNative,
    SelectorOptions.rating,
    SelectorOptions.lingo,
    (language, isNative, rating, lingo): DiceGroup[] => [
      { name: language, size: isNative ? 0 : rating, type: "skill" },
      ...flatSpecializationGroups("Lingo", lingo),
    ],
  )

  /** The best equipped armor's `armor` rating. */
  export const selectArmor = createMemoizedSelector(
    ItemSelectors.Armor.selectEffective,
    SelectorOptions.armor,
    (ratings, armor): DiceGroup[] => [{ name: `Armor (${armor})`, size: ratings[armor] ?? 0 }],
  )
}
