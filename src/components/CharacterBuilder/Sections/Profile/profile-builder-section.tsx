import type { FC } from "react"

import { ProfileSection } from "#/components/CharacterBuilder/Sections/Profile/profile-section.tsx"
import { useProfileAlerts } from "#/components/CharacterBuilder/Sections/Profile/use-profile-alerts.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"

export const ProfileBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.profile} alerts={useProfileAlerts()}>
      <ProfileSection />
    </BuilderSection>
  )
}
