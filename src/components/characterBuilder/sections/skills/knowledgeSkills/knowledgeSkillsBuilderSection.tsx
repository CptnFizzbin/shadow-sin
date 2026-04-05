import type { FC } from "react"

import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import {
  useKnowledgeSkillsAlerts,
} from "#/components/characterBuilder/sections/skills/knowledgeSkills/hooks/useKnowledgeSkillsAlerts.ts"
import {
  KnowledgeSkillsList,
} from "#/components/characterBuilder/sections/skills/knowledgeSkills/knowledgeSkillsList.tsx"

export const KnowledgeSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.knowledgeSkills} alerts={useKnowledgeSkillsAlerts()}>
      <KnowledgeSkillsList />
    </BuilderSection>
  )
}
