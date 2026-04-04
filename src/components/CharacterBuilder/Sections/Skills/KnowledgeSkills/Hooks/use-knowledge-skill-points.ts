import { useStore } from "@tanstack/react-store"

import { useAttr } from "#/components/Character/character-utils.ts"
import { getKnowledgeSkillSp, getLanguageSkillSp } from "#/components/CharacterBuilder/Sections/Skills/skills-builder-utils.ts"
import { useSkillsStore } from "#/components/Skills/use-skills-store.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"

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
