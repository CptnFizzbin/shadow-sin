// PROTOTYPE — see spendKarmaDialogPrototypes.tsx; delete alongside it.
import { useImprovementSelector } from "#/components/runner/karma/runnerImprovements/useImprovementSelector.ts"
import type { ImprovementEntry } from "#/system/karma/improvements/improvementEntry.ts"
import { selectAllImprovements } from "#/system/karma/improvements/improvementSelectors.ts"
import { ImprovementType } from "#/system/karma/improvements/improvementType.ts"
import { getImprovementCost } from "#/system/karma/improvements/improvementUtils.ts"

import type { SpendKarmaSectionKey } from "./spendKarmaSections.tsx"

export interface SectionQueuedSummary {
  count: number
  cost: number
}

function sectionForEntry(entry: ImprovementEntry): SpendKarmaSectionKey {
  switch (entry.type) {
    case ImprovementType.attrIncrease:
      return "attribute"
    case ImprovementType.skillIncrease:
    case ImprovementType.skillSpecialization:
      if (entry.skillType === "KnowledgeSkill") return "knowledge"
      if (entry.skillType === "LanguageSkill") return "language"
      return "skill"
    case ImprovementType.learnActiveSkill:
      return "skill"
    case ImprovementType.skillGroupIncrease:
    case ImprovementType.learnSkillGroup:
      return "skillGroup"
    case ImprovementType.learnKnowledgeSkill:
      return "knowledge"
    case ImprovementType.learnLanguageSkill:
      return "language"
    case ImprovementType.learnSpell:
    case ImprovementType.learnComplexForm:
    case ImprovementType.complexFormIncrease:
      return "spell"
  }
}

/** Queued improvement count and karma cost per dialog section, for nav badges. */
export const useSectionQueuedSummaries = (): Record<SpendKarmaSectionKey, SectionQueuedSummary> => {
  const allImprovements = useImprovementSelector(selectAllImprovements)

  const summaries: Record<SpendKarmaSectionKey, SectionQueuedSummary> = {
    attribute: { count: 0, cost: 0 },
    skill: { count: 0, cost: 0 },
    skillGroup: { count: 0, cost: 0 },
    knowledge: { count: 0, cost: 0 },
    language: { count: 0, cost: 0 },
    spell: { count: 0, cost: 0 },
  }

  for (const entry of allImprovements) {
    const summary = summaries[sectionForEntry(entry)]
    summary.count += 1
    summary.cost += getImprovementCost(entry)
  }

  return summaries
}
