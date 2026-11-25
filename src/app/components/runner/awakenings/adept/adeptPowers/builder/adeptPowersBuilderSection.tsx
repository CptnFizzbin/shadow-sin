import type { FC } from "react"

import { BuilderSection } from "#/app/components/builder/builderSection.tsx"
import { AdeptPowersList } from "#/app/components/runner/awakenings/adept/adeptPowers/viewer/adeptPowersList.tsx"
import { isAdept } from "#/rules/buildPoints/adeptPowersUtils.ts"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
import { useAdeptPowersAlerts } from "#/state/builder/sections/resources/adept/useAdeptPowersAlerts.ts"
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
