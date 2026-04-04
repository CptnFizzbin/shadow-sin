import type { FC } from "react"

import {
  useActiveSkillsAlerts,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/Hooks/use-active-skills-alerts.ts"
import { ActiveSkillsList } from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/active-skills-list.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"

export const ActiveSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.activeSkills} alerts={useActiveSkillsAlerts()}>
      <ActiveSkillsList />
    </BuilderSection>
  )
}
