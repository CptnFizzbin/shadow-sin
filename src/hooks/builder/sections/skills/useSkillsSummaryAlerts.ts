import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"

export const useSkillsSummaryAlerts = (): AlertInfo[] => {
  const active = useRunnerSelector(SkillsSelectors.selectActiveSkills)
  const knowledge = useRunnerSelector(SkillsSelectors.selectKnowledgeSkills)
  const language = useRunnerSelector(SkillsSelectors.selectLanguageSkills)

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
