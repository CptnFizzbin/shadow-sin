import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import {
  useKnowledgeSkillPoints,
} from "#/components/builder/sections/skills/knowledgeSkills/hooks/useKnowledgeSkillPoints.ts"
import { ExtraSkillPointBpCost } from "#/components/builder/sections/skills/skillsBuilderUtils.ts"

export const useKnowledgeSkillsBuildPoints = (): BpLineItem => {
  const skillPoints = useKnowledgeSkillPoints()

  return {
    sectionId: BuilderSectionId.knowledgeSkills,
    spent: skillPoints.spent.extra * ExtraSkillPointBpCost,
  }
}
