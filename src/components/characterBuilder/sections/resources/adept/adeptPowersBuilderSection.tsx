import type { FC } from "react"

import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { AdeptPowersList } from "#/components/characterBuilder/sections/resources/adept/adeptPowersList.tsx"
import { useAdeptPowersAlerts } from "#/components/characterBuilder/sections/resources/adept/useAdeptPowersAlerts.ts"

export const AdeptPowersBuilderSection: FC = () => {
  return (
    <BuilderSection id={BuilderSectionId.adeptPowers} alerts={useAdeptPowersAlerts()}>
      <AdeptPowersList />
    </BuilderSection>
  )
}
