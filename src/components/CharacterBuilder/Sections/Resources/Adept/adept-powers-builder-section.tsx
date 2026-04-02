import type { FC } from "react"

import { AdeptPowersList } from "#/components/CharacterBuilder/Sections/Resources/Adept/adept-powers-list.tsx"
import { useAdeptPowersAlerts } from "#/components/CharacterBuilder/Sections/Resources/Adept/use-adept-powers-alerts.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { BuilderSection } from "#/components/CharacterBuilder/Sections/builder-section.tsx"

export const AdeptPowersBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.adeptPowers} alerts={useAdeptPowersAlerts()}>
      <AdeptPowersList />
    </BuilderSection>
  )
}
