import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { DicePoolFormulas } from "#/system/formulas/dicePool/dicePoolFormulas.ts"
import { calculateEncumbrancePenalty } from "#/system/formulas/items/encumbranceUtils.ts"
import type { RatingBreakdown } from "#/system/formulas/ratings/ratingFormulas.ts"
import { AttributeKey, AttributeLabels } from "#/system/model/attributes/attributeKey.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import { skillList } from "#/system/model/skills/skillList.ts"
import { SRC } from "#/system/model/systemValues.ts"

/** Adapts the domain selectors' option names to this domain's `attr` / `skill` / `specialization` options. */
const selectAttrRating = (state: EntityScope, { attr }: { attr: AttributeKey }) =>
  AttrSelectors.selectRatingBreakdown(state, { attr })

const selectSkillRating = (state: EntityScope, { skill }: { skill: SkillKey }) =>
  SkillsSelectors.selectRatingBreakdown(state, { skill })

const selectSpecialization = (state: EntityScope, options: { skill: SkillKey, specialization?: string }) =>
  SkillsSelectors.selectSpecializationBreakdown(state, options)

/** A group sized by a rating, listing the rating's modifiers when there are any. */
const ratingGroup = (group: Omit<DiceGroup, "size" | "modifiers">, { rating, modifiers }: RatingBreakdown): DiceGroup =>
  modifiers.length === 0 ? { ...group, size: rating } : { ...group, size: rating, modifiers }

/**
 * The individual {@link DiceGroup}s a test's dice pool is assembled from, each sized by a rating
 * (raw value plus modifiers). A group's `modifiers` only explain its size — they are already
 * included in it. Every member returns a `DiceGroup[]`, empty when it contributes nothing, so a
 * dice pool can concatenate them. Use `DicePoolSelectors` for a whole pool.
 */
export namespace DiceGroupSelectors {
  /** An Attribute's rating. */
  export const selectAttr = createMemoizedSelector(
    selectAttrRating,
    SelectorOptions.attr,
    (breakdown, attr): DiceGroup[] => [ratingGroup({ name: AttributeLabels[attr], type: "attribute" }, breakdown)],
  )

  /**
   * An Active Skill: its rating, a separate Defaulting penalty when untrained, defaultable, and
   * `excludeDefaulting` isn't set, and a separate Specialization bonus when `specialization` is given.
   * An untrained skill being defaulted only lists its own group when modifiers give it dice.
   */
  export const selectSkill = createMemoizedSelector(
    selectSkillRating,
    selectSpecialization,
    SelectorOptions.skill,
    SelectorOptions.specialization,
    SelectorOptions.excludeDefaulting,
    (breakdown, specializationBreakdown, skill, specialization, excludeDefaulting): DiceGroup[] => {
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
      if (specialization && specializationBreakdown) {
        groups.push(ratingGroup({ name: `Specialization: ${specialization}`, type: "bonus" }, specializationBreakdown))
      }
      return groups
    },
  )

  /**
   * A Knowledge Skill's `rating` plus the Specialization bonus when `specialization` is given.
   * Knowledge Skills have no stable key to look a rating up by, so the caller passes it in.
   */
  export const selectKnowledgeSkill = createMemoizedSelector(
    SelectorOptions.knowledge,
    SelectorOptions.rating,
    SelectorOptions.specialization,
    (knowledge, rating, specialization): DiceGroup[] => [
      { name: knowledge, size: rating, type: "skill" },
      ...(specialization
        ? [{ name: `Specialization: ${specialization}`, size: SRC.Skills.Specialization.Modifier, type: "bonus" } satisfies DiceGroup]
        : []),
    ],
  )

  /**
   * A Language Skill's `rating` plus the lingo bonus when `lingo` is given. A native Language
   * contributes no rating dice — it always succeeds automatically. Language Skills have no stable
   * key to look a rating up by, so the caller passes it in.
   */
  export const selectLanguageSkill = createMemoizedSelector(
    SelectorOptions.language,
    SelectorOptions.isNative,
    SelectorOptions.rating,
    SelectorOptions.lingo,
    (language, isNative, rating, lingo): DiceGroup[] => [
      { name: language, size: isNative ? 0 : rating, type: "skill" },
      ...(lingo ? [{ name: `Lingo: ${lingo}`, size: SRC.Skills.Specialization.Modifier, type: "bonus" } satisfies DiceGroup] : []),
    ],
  )

  /** The Wound Modifier as a penalty. */
  export const selectWound = createMemoizedSelector(
    DamageSelectors.selectWoundMod,
    (woundMod): DiceGroup[] => woundMod === 0 ? [] : [{ name: "Wound", size: -woundMod, type: "penalty" }],
  )

  /** The armor Encumbrance penalty. */
  export const selectEncumbrance = createMemoizedSelector(
    ItemSelectors.Armor.selectBulk,
    AttrSelectors.forAttr(AttributeKey.body).selectRawValue,
    (bulk, body): DiceGroup[] => {
      const penalty = calculateEncumbrancePenalty(bulk.ballistic, bulk.impact, body)
      return penalty === 0 ? [] : [{ name: "Encumbrance", size: -penalty, type: "penalty" }]
    },
  )

  /** The best equipped armor's `armorRating`. */
  export const selectArmor = createMemoizedSelector(
    ItemSelectors.Armor.selectEffective,
    SelectorOptions.armorRating,
    (ratings, armorRating): DiceGroup[] => [
      { name: `Armor (${armorRating})`, size: ratings[armorRating] ?? 0 },
    ],
  )
}
