import {
  useActiveSkillsAlerts,
} from "#/components/builder/sections/skills/activeSkills/hooks/useActiveSkillsAlerts.ts"
import {
  useKnowledgeSkillsAlerts,
} from "#/components/builder/sections/skills/knowledgeSkills/hooks/useKnowledgeSkillsAlerts.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"

export const useSkillsAlerts = (): AlertInfo[] => {
  return [
    ...useActiveSkillsAlerts(),
    ...useKnowledgeSkillsAlerts(),
  ]
}
