import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/bp-line-item.ts"
import {
  useKnowledgeSkillPoints,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Hooks/use-knowledge-skill-points.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { ExtraSkillPointBpCost } from "#/components/Skills/skill-utils.ts"

export const useKnowledgeSkillsBuildPoints = (): BpLineItem => {
  const skillPoints = useKnowledgeSkillPoints()

  return {
    sectionId: BuilderSectionId.knowledgeSkills,
    spent: skillPoints.spent.extra * ExtraSkillPointBpCost,
  }
}
