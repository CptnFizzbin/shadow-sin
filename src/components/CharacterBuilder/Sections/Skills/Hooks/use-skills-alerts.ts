import {
  useActiveSkillsAlerts,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/Hooks/use-active-skills-alerts.ts"
import {
  useKnowledgeSkillsAlerts,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Hooks/use-knowledge-skills-alerts.ts"
import type { AlertInfo } from "#/components/UI/alerts/alert-info.ts"

export const useSkillsAlerts = (): AlertInfo[] => {
  return [
    ...useActiveSkillsAlerts(),
    ...useKnowledgeSkillsAlerts(),
  ]
}
