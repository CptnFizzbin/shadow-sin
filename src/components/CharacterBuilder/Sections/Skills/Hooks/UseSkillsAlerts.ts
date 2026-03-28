import {
  useActiveSkillsAlerts,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/Hooks/UseActiveSkillsAlerts.ts"
import {
  useKnowledgeSkillsAlerts,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Hooks/UseKnowledgeSkillsAlerts.ts"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"

export const useSkillsAlerts = (): AlertInfo[] => {
  return [
    ...useActiveSkillsAlerts(),
    ...useKnowledgeSkillsAlerts(),
  ]
}
