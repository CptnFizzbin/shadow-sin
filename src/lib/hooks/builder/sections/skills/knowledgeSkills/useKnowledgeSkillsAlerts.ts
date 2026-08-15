import pluralize from "pluralize"

import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useEditorMode } from "#/lib/contexts/builder/editorMode.tsx"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

import {
  useKnowledgeSkillPoints,
} from "./useKnowledgeSkillPoints.ts"

export const useKnowledgeSkillsAlerts = (): AlertInfo[] => {
  const languageSkills = useRunnerStoreSelector(Selectors.skills.selectLanguageSkills)
  const skillPoints = useKnowledgeSkillPoints()
  const editorMode = useEditorMode()

  if (editorMode.isEdit) return []

  const statuses: AlertInfo[] = []

  const nativeCount = languageSkills.filter((s) => s.rating === "native").length
  if (nativeCount > 1) {
    statuses.push({
      section: "Skills",
      severity: "error",
      title: "Too many native languages",
      message: `${nativeCount} native languages selected. Starting runners are limited to 1 native language.`,
    })
  }

  const unspentFreeSp = skillPoints.free - skillPoints.spent.free
  if (unspentFreeSp > 0) {
    statuses.push({
      section: "Skills",
      severity: "warning",
      title: "Unspent Free SP",
      message: `You have ${unspentFreeSp} unspent free ${pluralize("Skill Point", unspentFreeSp)} that won't be carried over. Consider adding or improving Knowledge or Language skills.`,
      summaryOnly: true,
    })
  }

  return statuses
}
