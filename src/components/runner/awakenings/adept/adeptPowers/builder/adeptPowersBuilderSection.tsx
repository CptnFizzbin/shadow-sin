import type { FC } from "react"

import { BuilderSection } from "#/components/builder/builderSection.tsx"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { AdeptPowersList } from "#/components/runner/awakenings/adept/adeptPowers/viewer/adeptPowersList.tsx"
import { isAdept } from "#/components/runner/awakenings/adept/adeptPowers/viewer/adeptPowersUtils.ts"
import { useAdeptPowersAlerts } from "#/hooks/builder/sections/resources/adept/useAdeptPowersAlerts.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

export const AdeptPowersBuilderSection: FC = () => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const alerts = useAdeptPowersAlerts()

  if (!isAdept(awakeningType)) return null

  return (
    <BuilderSection id={BuilderSectionId.adeptPowers} alerts={alerts}>
      <AdeptPowersList />
    </BuilderSection>
  )
}
