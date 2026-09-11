import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { SelectorOptions } from "#/stores/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import { isEntityWithSkills } from "#/system/entities/traits/entityWithSkills.ts"
import type { SkillInfo } from "#/system/skills/skillInfo.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

export namespace SkillsSelectors {

  export const selectActiveSkills = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithSkills),
    (entity) => entity.skills.activeSkills,
  )

  export const selectSkillGroups = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithSkills),
    (entity) => entity.skills.skillGroups,
  )

  export const selectKnowledgeSkills = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithSkills),
    (entity) => entity.skills.knowledgeSkills,
  )

  export const selectLanguageSkills = createMemoizedSelector(
    ViewerStateSelectors.selectEntity.withTrait(isEntityWithSkills),
    (entity) => entity.skills.languageSkills,
  )

  export const selectAllowedActive = createMemoizedSelector(
    BiologySelectors.selectAwakening,
    (awakeningType) => {
      const skillEntries = Object.entries(skillList)
        .filter(([_, info]) => {
          if (!info.awakening) return true
          return info.awakening.includes(awakeningType)
        })

      return Object.fromEntries(skillEntries) as Partial<Record<SkillKey, SkillInfo>>
    },
  )

  export const selectValue = createMemoizedSelector(
    selectActiveSkills,
    selectSkillGroups,
    SelectorOptions.skillName,
    (activeSkills, skillGroups, skillName) => {
      const skillInfo = skillList[skillName]
      const skillRating = activeSkills.find((s) => s.name === skillName)?.rating ?? 0
      const groupRating = skillGroups.find((g) => g.name === skillInfo.group)?.rating ?? 0
      return Math.max(skillRating, groupRating, 0)
    },
  )

  export const selectSpecialization = createMemoizedSelector(
    selectActiveSkills,
    SelectorOptions.skillName,
    (activeSkills, skillName) => activeSkills.find((s) => s.name === skillName)?.specialization,
  )

  export const selectActiveSkill = createMemoizedSelector(
    selectActiveSkills,
    SelectorOptions.skillName,
    selectValue,
    (activeSkills, skill, value) => {
      const skillData = activeSkills.find((s) => s.name === skill)
      return {
        name: skill,
        rating: skillData?.rating ?? 0,
        specialization: skillData?.specialization,
        attr: skillList[skill].attr,
        value: value,
      }
    },
  )
}
