import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { ProfileSection } from "#/components/builder/sections/profile/profileSection.tsx"
import { useProfileAlerts } from "#/components/builder/sections/profile/useProfileAlerts.ts"

export const ProfileBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.profile} alerts={useProfileAlerts()}>
      <ProfileSection />
    </BuilderSection>
  )
}
