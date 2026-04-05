import type { BpLineItem } from "#/components/characterBuilder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import {
  useKnowledgeSkillPoints,
} from "#/components/characterBuilder/sections/skills/knowledgeSkills/hooks/useKnowledgeSkillPoints.ts"
import { ExtraSkillPointBpCost } from "#/components/characterBuilder/sections/skills/skillsBuilderUtils.ts"

export const useKnowledgeSkillsBuildPoints = (): BpLineItem => {
  const skillPoints = useKnowledgeSkillPoints()

  return {
    sectionId: BuilderSectionId.knowledgeSkills,
    spent: skillPoints.spent.extra * ExtraSkillPointBpCost,
  }
}
