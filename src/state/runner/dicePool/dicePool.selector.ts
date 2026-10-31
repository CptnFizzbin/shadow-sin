import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import type { DicePoolConfig } from "#/components/system/dicePool/dicePoolData.tsx"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { createMemoizedSelector, injectOption } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { SkillsSelectors } from "#/state/runner/skills/skills.selector.ts"
import { filterByEffectType } from "#/system/formulas/gameEffects/gameEffectUtils.ts"
import { calculateArmorBulk, calculateEncumbrancePenalty } from "#/system/formulas/items/encumbranceUtils.ts"
import { AttributeKey, AttributeLabels } from "#/system/model/attributes/attributeKey.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { skillList } from "#/system/model/skills/skillList.ts"
import { SRC } from "#/system/model/systemValues.ts"

import { createDicePoolSelector } from "./createDicePoolSelector.ts"

const selectSkillModTotal = createMemoizedSelector(
  GameEffectSelectors.selectAll,
  SelectorOptions.skill,
  (allEffects, skill) =>
    allEffects
      .filter(filterByEffectType(GameEffectType.skillMod))
      .filter((effect) => effect.target === skill)
      .reduce((sum, effect) => sum + effect.value, 0),
)

/** Adapts {@link AttrSelectors.selectValue}'s `key` option to this domain's `attr` option. */
const selectAttrValue = (
  state: Parameters<typeof AttrSelectors.selectValue>[0],
  { attr }: { attr: AttributeKey },
): number => AttrSelectors.selectValue(state, { key: attr })

export namespace DicePoolSelectors {
  /**
   * The {@link DiceGroup}s an Attribute contributes to a test: just its base rating.
   */
  export const selectAttrTest = createMemoizedSelector(
    selectAttrValue,
    SelectorOptions.attr,
    (attrValue, attr): DiceGroup[] => [
      { name: AttributeLabels[attr], size: attrValue, type: "attribute" },
    ],
  )

  /**
   * The {@link DiceGroup}s a Skill contributes to a test: its base rating (or a Defaulting penalty
   * when untrained and defaultable), plus a combined entry for any active `skillMod` GameEffects
   * and the flat Specialization bonus.
   */
  export const selectSkillTest = createMemoizedSelector(
    SkillsSelectors.selectActiveSkills,
    SkillsSelectors.selectSkillGroups,
    selectSkillModTotal,
    SelectorOptions.skill,
    SelectorOptions.isSpecialized,
    SelectorOptions.excludeDefaulting,
    (activeSkills, skillGroups, modTotal, skill, isSpecialized, excludeDefaulting): DiceGroup[] => {
      const skillInfo = skillList[skill]
      const skillRating = activeSkills.find((s) => s.name === skill)?.rating ?? 0
      const groupRating = skillGroups.find((g) => g.name === skillInfo.group)?.rating ?? 0
      const base = Math.max(skillRating, groupRating, 0)

      const groups: DiceGroup[] = []
      if (base === 0 && !excludeDefaulting && (skillInfo.defaultable ?? true)) {
        groups.push({ name: `${skill} - Defaulting`, size: SRC.Skills.Defaulting.Modifier, type: "defaulting" })
      } else {
        groups.push({ name: skill, size: base, type: "skill" })
      }

      const totalMod = modTotal + (isSpecialized ? SRC.Skills.Specialization.Modifier : 0)
      if (totalMod !== 0) {
        groups.push({ name: `${skill} Mod`, size: totalMod, type: "bonus" })
      }

      return groups
    },
  )

  /**
   * Assembles the full dice pool for a Standard Test rolling `attr` + `skill`: Base Attribute,
   * Base Skill, Skill mod(s), each queried live against active GameEffects, and the wound modifier.
   */
  export const selectStandardTest = createDicePoolSelector(
    selectAttrTest,
    selectSkillTest,
    SelectorOptions.attr,
    SelectorOptions.skill,
    (attrGroups, skillGroups, attr, skill): DicePoolConfig => ({
      id: `standardTest.${attr}.${skill}`,
      label: `${AttributeLabels[attr]} + ${skill}`,
      groups: [...attrGroups, ...skillGroups],
    }),
  )

  /**
   * The {@link DiceGroup}s armor encumbrance contributes to an Agility or Reaction test: a single
   * penalty group when the Runner's equipped armor exceeds what their Body can carry, otherwise
   * none.
   */
  export const selectEncumbranceTest = createMemoizedSelector(
    ItemSelectors.Armor.selectEquipped,
    injectOption(selectAttrValue, { attr: AttributeKey.body }),
    (equippedArmor, body): DiceGroup[] => {
      const bulk = calculateArmorBulk(equippedArmor)
      const penalty = calculateEncumbrancePenalty(bulk.ballistic, bulk.impact, body)
      return penalty === 0 ? [] : [{ name: "Encumbrance", size: -penalty, type: "penalty" }]
    },
  )

  /** The {@link DiceGroup}s equipped armor contributes to a damage resistance test against `armor`. */
  export const selectArmorTest = createMemoizedSelector(
    ItemSelectors.Armor.selectEffective,
    SelectorOptions.armor,
    (effectiveArmor, armor): DiceGroup[] => [
      { name: `Armor (${armor})`, size: effectiveArmor[armor] ?? 0 },
    ],
  )

  /**
   * The {@link DiceGroup}s a Specialization contributes to a `skill` test: the flat Specialization
   * bonus plus any active `skillSpecializationMod` GameEffects for it, or none when
   * `specialization` is unset.
   */
  export const selectSpecializationTest = createMemoizedSelector(
    GameEffectSelectors.selectAll,
    SelectorOptions.skill,
    SelectorOptions.specialization,
    (allEffects, skill, specialization): DiceGroup[] => {
      if (!specialization) return []

      const specializationMod = allEffects
        .filter(filterByEffectType(GameEffectType.skillSpecializationMod))
        .filter((effect) => effect.target === skill && effect.subTarget === specialization)
        .reduce((sum, effect) => sum + effect.value, 0)

      return [{ name: specialization, size: SRC.Skills.Specialization.Modifier + specializationMod }]
    },
  )
}
