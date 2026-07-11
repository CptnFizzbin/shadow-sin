import { useSelector } from "@tanstack/react-store"
import pluralize from "pluralize"

import { selectKnowledgeSkills, selectLanguageSkills } from "#/components/runner/skills/skillsSelectors.ts"
import { useSkillsStore } from "#/components/runner/skills/useSkillsStore.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"

import {
  useKnowledgeSkillPoints,
} from "./useKnowledgeSkillPoints.ts"

export const useKnowledgeSkillsAlerts = (): AlertInfo[] => {
  const skillsStore = useSkillsStore()
  const knowledgeSkills = useSelector(skillsStore, selectKnowledgeSkills)
  const languageSkills = useSelector(skillsStore, selectLanguageSkills)
  const skillPoints = useKnowledgeSkillPoints()

  const statuses: AlertInfo[] = []

  // Rating constraints (same rules as active skills)
  const allRatings = [...knowledgeSkills, ...languageSkills]
    .map((s) => s.rating)
    .filter((r) => r !== "native")

  const r6Count = allRatings.filter((r) => r >= 6).length
  const r5Count = allRatings.filter((r) => r === 5).length
  const aboveR4Count = allRatings.filter((r) => r > 4).length

  if (r6Count > 1) {
    statuses.push({
      section: "Skills",
      severity: "error",
      title: "Invalid skill ratings",
      message: "Cannot have more than 1 skill at Rating 6",
    })
  }

  if (r6Count === 1 && r5Count > 0) {
    statuses.push({
      section: "Skills",
      severity: "error",
      title: "Invalid skill ratings",
      message: "Cannot have a Rating 6 skill alongside any Rating 5 skills",
    })
  }

  if (r6Count === 0 && aboveR4Count > 2) {
    statuses.push({
      section: "Skills",
      severity: "error",
      title: "Invalid skill ratings",
      message: "Cannot have more than 2 skills at Rating 5",
    })
  }

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
