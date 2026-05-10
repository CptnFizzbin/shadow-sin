import { useSelector } from "@tanstack/react-store"

import { selectAllAdeptPowers } from "#/components/character/adeptPowers/adeptPowersSelectors.ts"
import { isAdept } from "#/components/character/adeptPowers/adeptPowersUtils.ts"
import { useAdeptPowersStore } from "#/components/character/adeptPowers/useAdeptPowersStore.ts"
import { useAttr } from "#/components/character/attributes/useAttr.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const useAdeptPowersAlerts = (): AlertInfo[] => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
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
