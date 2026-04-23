import type { FC } from "react"

import {
  ActiveSkillsBuilderSection,
} from "#/components/builder/sections/skills/activeSkills/activeSkillsBuilderSection.tsx"
import {
  KnowledgeSkillsBuilderSection,
} from "#/components/builder/sections/skills/knowledgeSkills/knowledgeSkillsBuilderSection.tsx"

export const SkillsBuilderSection: FC = () => {
  return (
    <>
      <ActiveSkillsBuilderSection />
      <KnowledgeSkillsBuilderSection />
    </>
  )
}
