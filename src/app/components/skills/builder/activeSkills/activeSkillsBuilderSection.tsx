import type { FC } from "react"

import { BuilderSection } from "#app/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#state/builder/builderSectionId.ts"
import {
  useActiveSkillsAlerts,
} from "#state/builder/sections/skills/activeSkills/useActiveSkillsAlerts.ts"

import { ActiveSkillsList } from "./activeSkillsList.tsx"

export const ActiveSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.activeSkills} alerts={useActiveSkillsAlerts()}>
      <ActiveSkillsList />
    </BuilderSection>
  )
}
