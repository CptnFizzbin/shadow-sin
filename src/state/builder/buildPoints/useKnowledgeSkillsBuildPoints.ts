import { BuilderConfig } from "#/rules/buildPoints/builderConfig.ts"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
import {
  useKnowledgeSkillPoints,
} from "#/state/builder/sections/skills/knowledgeSkills/useKnowledgeSkillPoints.ts"

import type { BpLineItem } from "./bpLineItem.ts"

export const useKnowledgeSkillsBuildPoints = (): BpLineItem => {
  const skillPoints = useKnowledgeSkillPoints()

  return {
    sectionId: BuilderSectionId.knowledgeSkills,
    spent: skillPoints.spent.extra * BuilderConfig.skills.knowledge.bpCost.extraSkillPoint,
  }
}
