import type { FC } from "react"

import {
  ActiveSkillsBuilderSection,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/active-skills-builder-section.tsx"
import {
  KnowledgeSkillsBuilderSection,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/knowledge-skills-builder-section.tsx"

export const SkillsBuilderSection: FC = () => {
  return (
    <>
      <ActiveSkillsBuilderSection />
      <KnowledgeSkillsBuilderSection />
    </>
  )
}
