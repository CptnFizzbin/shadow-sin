import { AwakeningType } from "#/lib/system/awakeningType.ts"
import type { AdeptPowerData } from "#/lib/system/magic/adeptPowerData.ts"

export const isAdept = (awakeningType: AwakeningType) => {
  return (
    awakeningType === AwakeningType.Adept
    || awakeningType === AwakeningType.MysticAdept
  )
}

export const getAdeptPowerBpCost = (power: AdeptPowerData) => {
  return power.rating * power.costPerRating
}
