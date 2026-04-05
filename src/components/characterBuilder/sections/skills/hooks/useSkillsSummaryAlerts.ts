import { useStore } from "@tanstack/react-store"

import { useSkillsStore } from "#/components/skills/useSkillsStore.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"

export const useSkillsSummaryAlerts = (): AlertInfo[] => {
  const skillsStore = useSkillsStore()
  const active = useStore(skillsStore, (s) => s.activeSkills)
  const knowledge = useStore(skillsStore, (s) => s.knowledgeSkills)
  const language = useStore(skillsStore, (s) => s.languageSkills)

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
