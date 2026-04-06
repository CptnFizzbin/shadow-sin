import type { FC } from "react"

import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { ActiveSkillsList } from "#/components/characterBuilder/sections/skills/activeSkills/activeSkillsList.tsx"
import {
  useActiveSkillsAlerts,
} from "#/components/characterBuilder/sections/skills/activeSkills/hooks/useActiveSkillsAlerts.ts"

export const ActiveSkillsBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.activeSkills} alerts={useActiveSkillsAlerts()}>
      <ActiveSkillsList />
    </BuilderSection>
  )
}
