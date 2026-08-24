import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { selectProfileAlerts } from "#/hooks/builder/sections/profile/useProfileAlerts.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { ProfileSection } from "./profileSection.tsx"

export const ProfileBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.profile} alerts={useRunnerSelector(selectProfileAlerts)}>
      <ProfileSection />
    </BuilderSection>
  )
}
