import { AwakeningType } from "#/system/model/magic/awakeningType.ts"
import type { AdeptPowerData } from "#/system/model/powers/adeptPowerData.ts"

export const isAdept = (awakeningType: AwakeningType) => {
  return (
    awakeningType === AwakeningType.Adept
    || awakeningType === AwakeningType.MysticAdept
  )
}

export const getAdeptPowerBpCost = (power: AdeptPowerData) => {
  return power.rating * power.costPerRating
}
