import type { FC } from "react"

import { isAdept } from "#/components/adeptPowers/adeptPowersUtils.ts"
import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { BuilderSection } from "#/components/characterBuilder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { AdeptPowersList } from "#/components/characterBuilder/sections/resources/adept/adeptPowersList.tsx"
import { useAdeptPowersAlerts } from "#/components/characterBuilder/sections/resources/adept/useAdeptPowersAlerts.ts"

export const AdeptPowersBuilderSection: FC = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const alerts = useAdeptPowersAlerts()

  if (!isAdept(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.adeptPowers} alerts={alerts}>
      <AdeptPowersList />
    </BuilderSection>
  )
}
