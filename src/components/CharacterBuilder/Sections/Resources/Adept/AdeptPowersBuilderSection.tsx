import type { FC } from "react"

import { BuilderSection } from "#/components/CharacterBuilder/Sections/BuilderSection.tsx"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { AdeptPowersList } from "#/components/CharacterBuilder/Sections/Resources/Adept/AdeptPowersList.tsx"
import { useAdeptPowersAlerts } from "#/components/CharacterBuilder/Sections/Resources/Adept/UseAdeptPowersAlerts.ts"

export const AdeptPowersBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.adeptPowers} alerts={useAdeptPowersAlerts()}>
      <AdeptPowersList />
    </BuilderSection>
  )
}
