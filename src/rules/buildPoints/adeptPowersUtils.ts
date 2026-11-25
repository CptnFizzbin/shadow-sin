import { AwakeningType } from "#data/magic/awakeningType.ts"
import type { AdeptPowerData } from "#data/powers/adeptPowerData.ts"

export const isAdept = (awakeningType: AwakeningType) => {
  return (
    awakeningType === AwakeningType.Adept
    || awakeningType === AwakeningType.MysticAdept
  )
}

export const getAdeptPowerBpCost = (power: AdeptPowerData) => {
  return power.rating * power.costPerRating
}
