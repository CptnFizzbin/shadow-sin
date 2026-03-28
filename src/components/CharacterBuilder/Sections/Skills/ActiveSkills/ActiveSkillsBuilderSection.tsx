import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { ActiveSkillsList } from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/ActiveSkillsList.tsx"
import {
  useActiveSkillsAlerts,
} from "#/components/CharacterBuilder/Sections/Skills/ActiveSkills/Hooks/UseActiveSkillsAlerts.ts"

export const ActiveSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection title="Active Skills" alerts={useActiveSkillsAlerts()}>
      <ActiveSkillsList />
    </BuilderSection>
  )
}
