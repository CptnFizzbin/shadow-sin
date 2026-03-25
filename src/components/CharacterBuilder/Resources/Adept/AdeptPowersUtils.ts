import { AwakeningType } from "#/lib/system/types/awakeningType.ts"
import type { AdeptPowerData } from "#/lib/system/types/magic/adeptPowerData.ts"

export const isAdept = (awakeningType: AwakeningType) => {
  return (
    awakeningType === AwakeningType.Adept ||
    awakeningType === AwakeningType.MysticAdept
  )
}

export const getAdeptPowerBpCost = (power: AdeptPowerData) => {
  return power.rating * power.costPerRating
}
