import type { FC } from "react"

import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import {
  useActiveSkillsAlerts,
} from "#/hooks/builder/sections/skills/activeSkills/useActiveSkillsAlerts.ts"

import { ActiveSkillsList } from "./activeSkillsList.tsx"

export const ActiveSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.activeSkills} alerts={useActiveSkillsAlerts()}>
      <ActiveSkillsList />
    </BuilderSection>
  )
}
