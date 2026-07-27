import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const useSkillsSummaryAlerts = (): AlertInfo[] => {
  const active = useRunnerStoreSelector(Selectors.skills.selectActiveSkills)
  const knowledge = useRunnerStoreSelector(Selectors.skills.selectKnowledgeSkills)
  const language = useRunnerStoreSelector(Selectors.skills.selectLanguageSkills)

  if (active.length === 0 && knowledge.length === 0 && language.length === 0) {
    return [{
      section: "Skills",
      severity: "warning",
      title: "No skills selected",
      message: "No skills have been added. Consider purchasing active, knowledge, or language skills.",
      summaryOnly: true,
    }]
  }

  return []
}
