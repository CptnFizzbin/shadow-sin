import type { FC } from "react"

import {
  useKnowledgeSkillsAlerts,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/Hooks/use-knowledge-skills-alerts.ts"
import {
  KnowledgeSkillsList,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/knowledge-skills-list.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"

export const KnowledgeSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.knowledgeSkills} alerts={useKnowledgeSkillsAlerts()}>
      <KnowledgeSkillsList />
    </BuilderSection>
  )
}
