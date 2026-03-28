import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"

export const useKnowledgeSkillsAlerts = (): AlertInfo[] => {
  const knowledgeSkills = useCharacterBuilderStore((state) => state.skills.knowledgeSkills)
  const languageSkills = useCharacterBuilderStore((state) => state.skills.languageSkills)

  const statuses: AlertInfo[] = []

  // Rating constraints (same rules as active skills)
  const allRatings = [
    ...knowledgeSkills.map((s) => s.rating),
    ...languageSkills.filter((s) => !s.isNative).map((s) => s.rating),
  ]
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

  const nativeCount = languageSkills.filter((s) => s.isNative).length
  if (nativeCount > 1) {
    statuses.push({
      section: "Skills",
      severity: "error",
      title: "Too many native languages",
      message: `${nativeCount} native languages selected. Starting characters are limited to 1 native language.`,
    })
  }

  return statuses
}
