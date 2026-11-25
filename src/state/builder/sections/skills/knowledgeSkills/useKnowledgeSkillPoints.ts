import { AttributeKey } from "#data/attributes/attributeKey.ts"
import { BuilderConfig } from "#rules/buildPoints/builderConfig.ts"
import {
  getFreeSkillPoints,
  getKnowledgeSkillSp,
  getLanguageSkillSp,
} from "#rules/buildPoints/skillsBuilderUtils.ts"
import { useEntitySelector } from "#state/entity/useEntitySelector.ts"
import { AttrSelectors } from "#state/runner/attributes/attributes.selector.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#state/runner/skills/skills.selector.ts"

export const useKnowledgeSkillPoints = () => {
  const logicAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.logic })
  const intuitionAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.intuition })

  const knowledgeSkills = useRunnerSelector(SkillsSelectors.selectKnowledgeSkills)
  const languageSkills = useRunnerSelector(SkillsSelectors.selectLanguageSkills)

  const knowledgeSp = knowledgeSkills.reduce((total, skill) => {
    return total + getKnowledgeSkillSp(skill)
  }, 0)

  const languageSp = languageSkills.reduce((total, skill) => {
    return total + getLanguageSkillSp(skill)
  }, 0)

  const totalSpSpent = knowledgeSp + languageSp
  const maxSp = (logicAttr + intuitionAttr) * BuilderConfig.skills.knowledge.maxSkillPointsPerAttribute
  const freeSp = getFreeSkillPoints(logicAttr, intuitionAttr)
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
