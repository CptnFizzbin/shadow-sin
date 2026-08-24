import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import {
  useKnowledgeSkillPoints,
} from "#/hooks/builder/sections/skills/knowledgeSkills/useKnowledgeSkillPoints.ts"

export const useKnowledgeSkillsBuildPoints = (): BpLineItem => {
  const skillPoints = useKnowledgeSkillPoints()

  return {
    sectionId: BuilderSectionId.knowledgeSkills,
    spent: skillPoints.spent.extra * BuilderConfig.skills.knowledge.bpCost.extraSkillPoint,
  }
}
