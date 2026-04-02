import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { ActiveSkillsList } from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/ActiveSkillsList.tsx"
import {
  useActiveSkillsAlerts,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/Hooks/UseActiveSkillsAlerts.ts"

export const ActiveSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.activeSkills} alerts={useActiveSkillsAlerts()}>
      <ActiveSkillsList />
    </BuilderSection>
  )
}
