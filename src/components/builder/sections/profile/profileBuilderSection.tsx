import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { useProfileAlerts } from "#/lib/hooks/builder/sections/profile/useProfileAlerts.ts"

import { ProfileSection } from "./profileSection.tsx"

export const ProfileBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.profile} alerts={useProfileAlerts()}>
      <ProfileSection />
    </BuilderSection>
  )
}
