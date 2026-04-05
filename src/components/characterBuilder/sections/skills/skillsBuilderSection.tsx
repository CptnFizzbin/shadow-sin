import type { FC } from "react"

import {
  ActiveSkillsBuilderSection,
} from "#/components/characterBuilder/sections/skills/activeSkills/activeSkillsBuilderSection.tsx"
import {
  KnowledgeSkillsBuilderSection,
} from "#/components/characterBuilder/sections/skills/knowledgeSkills/knowledgeSkillsBuilderSection.tsx"

export const SkillsBuilderSection: FC = () => {
  return (
    <>
      <ActiveSkillsBuilderSection />
      <KnowledgeSkillsBuilderSection />
    </>
  )
}
