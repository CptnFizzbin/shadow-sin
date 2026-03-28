import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { isAdept } from "#/components/CharacterBuilder/Sections/Resources/Adept/AdeptPowersUtils.ts"
import { useBuilderAdeptPowersApi } from "#/components/CharacterBuilder/Sections/Resources/Adept/UseAdeptPowersApi.ts"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

export const useAdeptPowersAlerts = (): AlertInfo[] => {
  const awakeningType = useCharacterBuilderStore((state) => state.awakening)
  const magicAttr = useCharacterBuilderStore((state) => state.attributes[AttributeKey.magic])
  const { adeptPowers } = useBuilderAdeptPowersApi()

  const statuses: AlertInfo[] = []

  if (!isAdept(awakeningType)) return statuses

  const powerPointsUsed = adeptPowers
    .map((power) => power.costPerRating * power.rating)
    .reduce((total, cost) => total + cost, 0)
  const powerPointsMax = magicAttr.value

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
