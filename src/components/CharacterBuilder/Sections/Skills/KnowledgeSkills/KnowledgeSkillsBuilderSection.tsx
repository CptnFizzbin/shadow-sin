import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import {
  useKnowledgeSkillsAlerts,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Hooks/UseKnowledgeSkillsAlerts.ts"
import {
  KnowledgeSkillsList,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/KnowledgeSkillsList.tsx"

export const KnowledgeSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection title="Knowledge Skills" alerts={useKnowledgeSkillsAlerts()}>
      <KnowledgeSkillsList />
    </BuilderSection>
  )
}
