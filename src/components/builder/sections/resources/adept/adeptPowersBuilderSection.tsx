import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { AdeptPowersList } from "#/components/builder/sections/resources/adept/adeptPowersList.tsx"
import { useAdeptPowersAlerts } from "#/components/builder/sections/resources/adept/useAdeptPowersAlerts.ts"
import { isAdept } from "#/components/character/adeptPowers/adeptPowersUtils.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"

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
