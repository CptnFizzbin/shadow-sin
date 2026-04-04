import { AwakeningType } from "#/lib/system/awakening-type.ts"
import type { AdeptPowerData } from "#/lib/system/magic/adept-power-data.ts"

export const isAdept = (awakeningType: AwakeningType) => {
  return (
    awakeningType === AwakeningType.Adept
    || awakeningType === AwakeningType.MysticAdept
  )
}

export const getAdeptPowerBpCost = (power: AdeptPowerData) => {
  return power.rating * power.costPerRating
}
