import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { ProfileSection } from "#/components/CharacterBuilder/Sections/Profile/ProfileSection.tsx"
import { useProfileAlerts } from "#/components/CharacterBuilder/Sections/Profile/UseProfileAlerts.ts"

export const ProfileBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.profile} alerts={useProfileAlerts()}>
      <ProfileSection />
    </BuilderSection>
  )
}
