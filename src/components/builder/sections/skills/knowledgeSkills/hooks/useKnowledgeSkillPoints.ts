import { getKnowledgeSkillSp, getLanguageSkillSp } from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import { useAttrValue } from "#/components/runner/attributes/attributesProvider.tsx"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const useKnowledgeSkillPoints = () => {
  const logicAttr = useAttrValue(AttributeKey.logic)
  const intuitionAttr = useAttrValue(AttributeKey.intuition)

  const knowledgeSkills = useRunnerStoreSelector(Selectors.skills.selectKnowledgeSkills)
  const languageSkills = useRunnerStoreSelector(Selectors.skills.selectLanguageSkills)

  const knowledgeSp = knowledgeSkills.reduce((total, skill) => {
    return total + getKnowledgeSkillSp(skill)
  }, 0)

  const languageSp = languageSkills.reduce((total, skill) => {
    return total + getLanguageSkillSp(skill)
  }, 0)

  const totalSpSpent = knowledgeSp + languageSp
  const maxSp = (logicAttr + intuitionAttr) * 6
  const freeSp = (logicAttr + intuitionAttr) * 3
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
