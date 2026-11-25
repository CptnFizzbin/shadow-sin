import type { FC } from "react"

import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { useProfileAlerts } from "#/hooks/builder/sections/profile/useProfileAlerts.ts"

import { ProfileSection } from "./profileSection.tsx"

export const ProfileBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.profile} alerts={useProfileAlerts()}>
      <ProfileSection />
    </BuilderSection>
  )
}
