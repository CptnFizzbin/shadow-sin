import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { getKnowledgeSkillSp, getLanguageSkillSp } from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import { useEntitySelector } from "#/lib/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const useKnowledgeSkillPoints = () => {
  const logicAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.logic })
  const intuitionAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.intuition })

  const knowledgeSkills = useRunnerStoreSelector(Selectors.skills.selectKnowledgeSkills)
  const languageSkills = useRunnerStoreSelector(Selectors.skills.selectLanguageSkills)

  const knowledgeSp = knowledgeSkills.reduce((total, skill) => {
    return total + getKnowledgeSkillSp(skill)
  }, 0)

  const languageSp = languageSkills.reduce((total, skill) => {
    return total + getLanguageSkillSp(skill)
  }, 0)

  const totalSpSpent = knowledgeSp + languageSp
  const maxSp = (logicAttr + intuitionAttr) * BuilderConfig.skills.knowledge.maxSkillPointsPerAttribute
  const freeSp = (logicAttr + intuitionAttr) * BuilderConfig.skills.knowledge.freeSkillPointsPerAttribute
  const freeSpSpent = totalSpSpent > freeSp ? freeSp : totalSpSpent
  const extraSpSpent = Math.max(totalSpSpent - freeSp, 0)

  return {
    max: maxSp,
    free: freeSp,
    spent: {
      total: totalSpSpent,
      free: freeSpSpent,
      extra: extraSpSpent,
      knowledge: knowledgeSp,
      language: languageSp,
    },
  }
}
