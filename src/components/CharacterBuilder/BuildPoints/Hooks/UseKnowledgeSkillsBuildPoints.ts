import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/BpLineItem.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import {
  useKnowledgeSkillPoints,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Hooks/UseKnowledgeSkillPoints.ts"
import { ExtraSkillPointBpCost } from "#/components/Skills/SkillUtils.ts"

export const useKnowledgeSkillsBuildPoints = (): BpLineItem => {
  const skillPoints = useKnowledgeSkillPoints()

  return {
    sectionId: BuilderSectionId.knowledgeSkills,
    spent: skillPoints.spent.extra * ExtraSkillPointBpCost,
  }
}
