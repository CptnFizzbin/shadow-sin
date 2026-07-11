import { useSelector } from "@tanstack/react-store"

import {
  selectActiveSkills,
  selectKnowledgeSkills,
  selectLanguageSkills,
} from "#/components/runner/skills/skillsSelectors.ts"
import { useSkillsStore } from "#/components/runner/skills/useSkillsStore.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"

export const useSkillsSummaryAlerts = (): AlertInfo[] => {
  const skillsStore = useSkillsStore()
  const active = useSelector(skillsStore, selectActiveSkills)
  const knowledge = useSelector(skillsStore, selectKnowledgeSkills)
  const language = useSelector(skillsStore, selectLanguageSkills)

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
