import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"

import { ActiveSkillsList } from "./activeSkillsList.tsx"
import {
  useActiveSkillsAlerts,
} from "./hooks/useActiveSkillsAlerts.ts"

export const ActiveSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.activeSkills} alerts={useActiveSkillsAlerts()}>
      <ActiveSkillsList />
    </BuilderSection>
  )
}
