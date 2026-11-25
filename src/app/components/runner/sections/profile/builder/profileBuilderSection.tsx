import type { FC } from "react"

import { BuilderSection } from "#app/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#state/builder/builderSectionId.ts"
import { useProfileAlerts } from "#state/builder/sections/profile/useProfileAlerts.ts"

import { ProfileSection } from "./profileSection.tsx"

export const ProfileBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.profile} alerts={useProfileAlerts()}>
      <ProfileSection />
    </BuilderSection>
  )
}
