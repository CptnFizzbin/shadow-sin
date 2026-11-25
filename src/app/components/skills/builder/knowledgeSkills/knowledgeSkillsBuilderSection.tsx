import type { FC } from "react"

import { BuilderSection } from "#app/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#state/builder/builderSectionId.ts"
import {
  useKnowledgeSkillsAlerts,
} from "#state/builder/sections/skills/knowledgeSkills/useKnowledgeSkillsAlerts.ts"

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
