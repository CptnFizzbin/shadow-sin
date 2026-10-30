import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import type { GameEffectsState } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { EntityScope } from "#/state/entityScope.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { DamageSelectors } from "#/state/runner/damage/damage.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { DicePoolFormulas } from "#/system/formulas/dicePool/dicePoolFormulas.ts"
import { calculateEncumbrancePenalty } from "#/system/formulas/items/encumbranceUtils.ts"
import { AttributeKey, AttributeLabels } from "#/system/model/attributes/attributeKey.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"
import { skillList } from "#/system/model/skills/skillList.ts"
import { SRC } from "#/system/model/systemValues.ts"

const selectSkillMods = (state: GameEffectsState) =>
  GameEffectSelectors.selectByType(state, { gameEffectType: GameEffectType.skillMod })

const selectSpecializationMods = (state: GameEffectsState) =>
  GameEffectSelectors.selectByType(state, { gameEffectType: GameEffectType.skillSpecializationMod })

/** Adapts {@link AttrSelectors.selectValue}'s `key` option to this domain's `attr` option. */
const selectAttrValue = (state: EntityScope, { attr }: { attr: AttributeKey }): number =>
  AttrSelectors.selectValue(state, { key: attr })

/** Adapts {@link SkillsSelectors.selectValue}'s `skillName` option to this domain's `skill` option. */
const selectSkillValue = (state: EntityScope, { skill }: { skill: SkillKey }): number =>
  SkillsSelectors.selectValue(state, { skillName: skill })

/** A Specialization's flat bonus as a group, or nothing when no `specialization` is given. */
const specializationGroups = (specialization: string | undefined, modTotal: number): DiceGroup[] =>
  specialization
    ? [{ name: specialization, size: SRC.Skills.Specialization.Modifier + modTotal, type: "bonus" }]
    : []

/**
 * The individual {@link DiceGroup}s a test's dice pool is assembled from. Every member returns a
 * `DiceGroup[]` — empty when it contributes nothing (e.g. no Wound Modifier) — so a dice pool can
 * concatenate them without null checks. Use `DicePoolSelectors` for a whole pool.
 */
export namespace DiceGroupSelectors {
  /** An Attribute's rating. */
  export const selectAttr = createMemoizedSelector(
    selectAttrValue,
    SelectorOptions.attr,
    (attrValue, attr): DiceGroup[] => [
      { name: AttributeLabels[attr], size: attrValue, type: "attribute" },
    ],
  )

  /**
   * An Active Skill: its rating (or a Defaulting penalty when untrained, defaultable, and
   * `excludeDefaulting` isn't set), a combined entry for active `skillMod` GameEffects, and the
   * Specialization bonus when `specialization` is given.
   */
  export const selectSkill = createMemoizedSelector(
    selectSkillValue,
    selectSkillMods,
    selectSpecializationMods,
    SelectorOptions.skill,
    SelectorOptions.specialization,
    SelectorOptions.excludeDefaulting,
    (rating, skillMods, specializationMods, skill, specialization, excludeDefaulting): DiceGroup[] => {
      const modTotal = DicePoolFormulas.getSkillModTotal({ skillMods, skill })
      const skillDice = DicePoolFormulas.getActiveSkillDice({
        rating,
        defaulting: !excludeDefaulting && (skillList[skill].defaultable ?? true),
      })
      const specializationModTotal = specialization
        ? DicePoolFormulas.getSpecializationModTotal({ specializationMods, skill, specialization })
        : 0

      return [
        skillDice.isDefaulting
          ? { name: `${skill} - Defaulting`, size: skillDice.size, type: "defaulting" }
          : { name: skill, size: skillDice.size, type: "skill" },
        ...(modTotal === 0 ? [] : [{ name: `${skill} Mod`, size: modTotal, type: "bonus" } satisfies DiceGroup]),
        ...specializationGroups(specialization, specializationModTotal),
      ]
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
      ...specializationGroups(specialization, 0),
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
      ...specializationGroups(lingo, 0),
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
    AttrSelectors.forAttr(AttributeKey.body).selectValue,
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
