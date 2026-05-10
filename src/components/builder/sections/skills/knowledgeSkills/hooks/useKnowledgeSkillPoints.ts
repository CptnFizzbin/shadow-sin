import { useSelector } from "@tanstack/react-store"

import { getKnowledgeSkillSp, getLanguageSkillSp } from "#/components/builder/sections/skills/skillsBuilderUtils.ts"
import { useAttr } from "#/components/character/attributes/useAttr.ts"
import { selectKnowledgeSkills, selectLanguageSkills } from "#/components/character/skills/skillsSelectors.ts"
import { useSkillsStore } from "#/components/character/skills/useSkillsStore.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const useKnowledgeSkillPoints = () => {
  const skillsStore = useSkillsStore()

  const logicAttr = useAttr(AttributeKey.logic)
  const intuitionAttr = useAttr(AttributeKey.intuition)

  const knowledgeSkills = useSelector(skillsStore, selectKnowledgeSkills)
  const languageSkills = useSelector(skillsStore, selectLanguageSkills)

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
