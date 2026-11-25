import type { AlertInfo } from "#/common/alerts/alertInfo.ts"

import {
  useActiveSkillsAlerts,
} from "./activeSkills/useActiveSkillsAlerts.ts"
import {
  useKnowledgeSkillsAlerts,
} from "./knowledgeSkills/useKnowledgeSkillsAlerts.ts"

export const useSkillsAlerts = (): AlertInfo[] => {
  return [
    ...useActiveSkillsAlerts(),
    ...useKnowledgeSkillsAlerts(),
  ]
}
