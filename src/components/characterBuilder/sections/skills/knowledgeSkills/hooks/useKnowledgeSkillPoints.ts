import { useStore } from "@tanstack/react-store"

import { useAttr } from "#/components/character/characterUtils.ts"
import {
  getKnowledgeSkillSp,
  getLanguageSkillSp,
} from "#/components/characterBuilder/sections/skills/skillsBuilderUtils.ts"
import { useSkillsStore } from "#/components/skills/useSkillsStore.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const useKnowledgeSkillPoints = () => {
  const skillsStore = useSkillsStore()

  const logicAttr = useAttr(AttributeKey.logic)
  const intuitionAttr = useAttr(AttributeKey.intuition)

  const knowledgeSkills = useStore(skillsStore, (state) => state.knowledgeSkills)
  const languageSkills = useStore(skillsStore, (state) => state.languageSkills)

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
