import type { SpendKarmaSectionKey } from "#/components/improvements/spendKarmaSections.tsx"
import type { ImprovementEntry } from "#/system/karma/improvements/improvementEntry.ts"
import { selectAllImprovements } from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import { getImprovementCost } from "#/system/karma/improvements/improvementUtils.ts"

import { useImprovementSelector } from "./useImprovementSelector.ts"

export interface SectionQueuedSummary {
  count: number
  cost: number
}

export function sectionForEntry(entry: ImprovementEntry): SpendKarmaSectionKey {
  switch (entry.type) {
    case ImprovementType.attrIncrease:
      return "attribute"
    case ImprovementType.skillIncrease:
      if (entry.skillType === "KnowledgeSkill") return "knowledge"
      if (entry.skillType === "LanguageSkill") return "language"
      return "skill"
    case ImprovementType.skillSpecialization:
      return "specialization"
    case ImprovementType.learnActiveSkill:
      return "skill"
    case ImprovementType.skillGroupIncrease:
    case ImprovementType.learnSkillGroup:
      return "skillGroup"
    case ImprovementType.learnKnowledgeSkill:
      return "knowledge"
    case ImprovementType.learnLanguageSkill:
      return "language"
    case ImprovementType.learnQuality:
    case ImprovementType.qualityBuyOff:
      return "quality"
    case ImprovementType.learnSpell:
      return "spell"
    case ImprovementType.learnComplexForm:
    case ImprovementType.complexFormIncrease:
      return "complexForm"
    case ImprovementType.initiationIncrease:
      return "initiation"
    case ImprovementType.submersionIncrease:
      return "submersion"
  }
}

/** Queued improvement count and karma cost per dialog section, for hub badges. */
export const useSectionQueuedSummaries = (): Record<SpendKarmaSectionKey, SectionQueuedSummary> => {
  const allImprovements = useImprovementSelector(selectAllImprovements)

  const summaries: Record<SpendKarmaSectionKey, SectionQueuedSummary> = {
    attribute: { count: 0, cost: 0 },
    skill: { count: 0, cost: 0 },
    skillGroup: { count: 0, cost: 0 },
    knowledge: { count: 0, cost: 0 },
    language: { count: 0, cost: 0 },
    specialization: { count: 0, cost: 0 },
    quality: { count: 0, cost: 0 },
    spell: { count: 0, cost: 0 },
    complexForm: { count: 0, cost: 0 },
    initiation: { count: 0, cost: 0 },
    submersion: { count: 0, cost: 0 },
  }

  for (const entry of allImprovements) {
    const summary = summaries[sectionForEntry(entry)]
    summary.count += 1
    summary.cost += getImprovementCost(entry)
  }

  return summaries
}
