import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { createDicePool } from "#/components/system/dicePool/dicePoolData.tsx"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { SelectorOptions } from "#/stores/runner/selectorOptions.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { filterByEffectType } from "#/system/gameEffects/gameEffectUtils.ts"
import { skillList } from "#/system/skills/skillList.ts"
import { SystemValues } from "#/system/systemValues.ts"

const selectAttrModTotal = createMemoizedSelector(
  GameEffectSelectors.selectAll,
  SelectorOptions.attr,
  (allEffects, attr) =>
    allEffects
      .filter(filterByEffectType(GameEffectType.attrMod))
      .filter((effect) => effect.target === attr)
      .reduce((sum, effect) => sum + effect.value, 0),
)

const selectSkillModTotal = createMemoizedSelector(
  GameEffectSelectors.selectAll,
  SelectorOptions.skill,
  (allEffects, skill) =>
    allEffects
      .filter(filterByEffectType(GameEffectType.skillMod))
      .filter((effect) => effect.target === skill)
      .reduce((sum, effect) => sum + effect.value, 0),
)

export namespace DicePoolSelectors {
  /**
   * The {@link DiceGroup}s an Attribute contributes to a test: its base rating, plus a combined
   * entry for any active `attrMod` GameEffects targeting it.
   */
  export const selectAttrTest = createMemoizedSelector(
    AttrSelectors.selectAll,
    selectAttrModTotal,
    SelectorOptions.attr,
    (attributes, modTotal, attr): DiceGroup[] => {
      const groups: DiceGroup[] = [
        { name: AttributeLabels[attr], size: attributes[attr] ?? 0, type: "attribute" },
      ]

      if (modTotal !== 0) {
        groups.push({ name: `${AttributeLabels[attr]} Mod`, size: modTotal, type: "bonus" })
      }

      return groups
    },
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
        groups.push({ name: `${skill} - Defaulting`, size: SystemValues.skills.defaulting.modifier, type: "defaulting" })
      } else {
        groups.push({ name: skill, size: base, type: "skill" })
      }

      const totalMod = modTotal + (isSpecialized ? SystemValues.skills.specialization.modifier : 0)
      if (totalMod !== 0) {
        groups.push({ name: `${skill} Mod`, size: totalMod, type: "bonus" })
      }

      return groups
    },
  )

  /**
   * Assembles the full dice pool for a Standard Test rolling `attr` + `skill`: Base Attribute,
   * Attribute mod(s), Base Skill, and Skill mod(s), each queried live against active GameEffects.
   */
  export const selectStandardTest = createMemoizedSelector(
    selectAttrTest,
    selectSkillTest,
    SelectorOptions.attr,
    SelectorOptions.skill,
    (attrGroups, skillGroups, attr, skill): DicePoolData =>
      createDicePool(
        `standardTest.${attr}.${skill}`,
        `${AttributeLabels[attr]} + ${skill}`,
        [...attrGroups, ...skillGroups],
      ),
  )
}
