import { isAdept } from "#/components/runner/adeptPowers/adeptPowersUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useEntitySelector } from "#/lib/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const useAdeptPowersAlerts = (): AlertInfo[] => {
  const awakeningType = useRunnerStoreSelector(Selectors.biology.selectAwakening)
  const magicAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.magic })
  const adeptPowers = useRunnerStoreSelector(Selectors.powers.selectPowers)

  const statuses: AlertInfo[] = []

  if (!isAdept(awakeningType)) return statuses

  const powerPointsUsed = adeptPowers
    .map((power) => power.costPerRating * power.rating)
    .reduce((total, cost) => total + cost, 0)
  const powerPointsMax = magicAttr

  if (powerPointsUsed > powerPointsMax) {
    statuses.push({
      section: "Adept Powers",
      severity: "error",
      title: "Power Points Exceeded",
      message: `Power points used (${powerPointsUsed}) exceeds maximum (${powerPointsMax}).`,
    })
  }

  return statuses
}
