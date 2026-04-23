import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import {
  useKnowledgeSkillsAlerts,
} from "#/components/builder/sections/skills/knowledgeSkills/hooks/useKnowledgeSkillsAlerts.ts"
import {
  KnowledgeSkillsList,
} from "#/components/builder/sections/skills/knowledgeSkills/knowledgeSkillsList.tsx"

export const KnowledgeSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.knowledgeSkills} alerts={useKnowledgeSkillsAlerts()}>
      <KnowledgeSkillsList />
    </BuilderSection>
  )
}
