import type { FC } from "react"

import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import {
  useKnowledgeSkillsAlerts,
} from "#/hooks/builder/sections/skills/knowledgeSkills/useKnowledgeSkillsAlerts.ts"

import {
  KnowledgeSkillsList,
} from "./knowledgeSkillsList.tsx"

export const KnowledgeSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.knowledgeSkills} alerts={useKnowledgeSkillsAlerts()}>
      <KnowledgeSkillsList />
    </BuilderSection>
  )
}
