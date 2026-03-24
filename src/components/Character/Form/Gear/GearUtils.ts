import { useMemo } from "react"

import { useCharacterBuilderStore } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { BpLineItem } from "#/components/Character/Form/SummaryLineItem.ts"
import { Lifestyles, LifestyleType } from "#/lib/system/types/LifestyleType.ts"

export const GearBuildPointAllowance = 50
export const GearNuyenPerBuildPoint = 5_000
export const GearNuyenAllowance =
  GearNuyenPerBuildPoint * GearBuildPointAllowance
export const GearMaxAvailability = 12

export type GearItemCostInfo = {
  cost?: number
  quantity?: number
}

export const getTotalCost = (...items: GearItemCostInfo[]) => {
  return items
    .map((item) => ({
      cost: item.cost ?? 0,
      quantity: item.quantity ?? 1,
    }))
    .map(({ cost, quantity }) => cost * quantity)
    .reduce((sum, itemCost) => sum + itemCost, 0)
}

export const useGearTotalCost = () => {
  const gear = useCharacterBuilderStore((state) => state.gear)
  const lifestyle = useCharacterBuilderStore((state) => {
    const lifestyleType = state.lifestyle ?? LifestyleType.Street
    return Lifestyles[lifestyleType]
  })
  const lifestyleMonths = useCharacterBuilderStore(
    (state) => state.lifestyleMonths ?? 1,
  )

  const gearCost = useMemo(() => {
    const allGear = Object.values(gear).flat()
    return getTotalCost(...allGear)
  }, [gear])

  const lifestyleCost = lifestyle.upkeep * lifestyleMonths
  return gearCost + lifestyleCost
}

export const useGearBuildPoints = (): BpLineItem => {
  const gearNuyenCost = useGearTotalCost()
  const gearBuildPoints = Math.ceil(gearNuyenCost / GearNuyenPerBuildPoint)

  return {
    label: "Gear",
    spent: gearBuildPoints,
    allowance: GearBuildPointAllowance,
  }
}
