import type { FC } from "react"

import {
  ActiveSkillsBuilderSection,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/ActiveSkillsBuilderSection.tsx"
import {
  KnowledgeSkillsBuilderSection,
} from "#/components/CharacterBuilder/Sections/Skills/KnowledgeSkills/KnowledgeSkillsBuilderSection.tsx"

export const SkillsBuilderSection: FC = () => {
  return (
    <>
      <ActiveSkillsBuilderSection />
      <KnowledgeSkillsBuilderSection />
    </>
  )
}
