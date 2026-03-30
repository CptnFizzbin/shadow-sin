import {
  useKnowledgeSkillPoints,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Hooks/UseKnowledgeSkillPoints.ts"
import { ExtraSkillPointBpCost } from "#/components/CharacterBuilder/Sections/Skills/SkillUtils.ts"
import type { BpLineItem } from "#/components/CharacterBuilder/SummaryLineItem.ts"

export const useKnowledgeSkillsBuildPoints = (): BpLineItem => {
  const skillPoints = useKnowledgeSkillPoints()

  return {
    label: "Knowledge Skills",
    spent: skillPoints.spent.extra * ExtraSkillPointBpCost,
  }
}
