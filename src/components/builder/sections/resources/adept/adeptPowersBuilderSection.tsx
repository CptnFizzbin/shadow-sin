import type { FC } from "react"

import { BuilderSection } from "#/components/builder/sections/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { AdeptPowersList } from "#/components/runner/adeptPowers/adeptPowersList.tsx"
import { isAdept } from "#/components/runner/adeptPowers/adeptPowersUtils.ts"
import { useRunnerData } from "#/components/runner/sheet/runnerStoreProvider.tsx"

import { useAdeptPowersAlerts } from "./useAdeptPowersAlerts.ts"

export const AdeptPowersBuilderSection: FC = () => {
  const awakeningType = useRunnerData((sheet) => sheet.biology.awakening)
  const alerts = useAdeptPowersAlerts()

  if (!isAdept(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.adeptPowers} alerts={alerts}>
      <AdeptPowersList />
    </BuilderSection>
  )
}
