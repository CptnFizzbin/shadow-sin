import { useSelector } from "@tanstack/react-store"

import { selectAllAdeptPowers } from "#/components/runner/adeptPowers/adeptPowersSelectors.ts"
import { isAdept } from "#/components/runner/adeptPowers/adeptPowersUtils.ts"
import { useAdeptPowersStore } from "#/components/runner/adeptPowers/useAdeptPowersStore.ts"
import { useAttr } from "#/components/runner/runnerUtils.ts"
import { useRunnerData } from "#/components/runner/sheet/runnerDataProvider.tsx"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const useAdeptPowersAlerts = (): AlertInfo[] => {
  const awakeningType = useRunnerData((sheet) => sheet.biology.awakening)
  const magicAttr = useAttr(AttributeKey.magic)
  const adeptPowersStore = useAdeptPowersStore()
  const adeptPowers = useSelector(adeptPowersStore, selectAllAdeptPowers)

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
