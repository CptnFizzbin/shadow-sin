import { useStore } from "@tanstack/react-store"

import { isAdept } from "#/components/AdeptPowers/adept-powers-utils.ts"
import { useAdeptPowersStore } from "#/components/AdeptPowers/use-adept-powers-store.ts"
import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { useAttr } from "#/components/Character/character-utils.ts"
import type { AlertInfo } from "#/components/UI/Alerts/alert-info.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"

export const useAdeptPowersAlerts = (): AlertInfo[] => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const magicAttr = useAttr(AttributeKey.magic)
  const adeptPowersStore = useAdeptPowersStore()
  const adeptPowers = useStore(adeptPowersStore, (state) => state)

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
