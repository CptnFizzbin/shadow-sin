import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import {
  useKnowledgeSkillsAlerts,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Hooks/UseKnowledgeSkillsAlerts.ts"
import {
  KnowledgeSkillsList,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/KnowledgeSkillsList.tsx"

export const KnowledgeSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.knowledgeSkills} alerts={useKnowledgeSkillsAlerts()}>
      <KnowledgeSkillsList />
    </BuilderSection>
  )
}
