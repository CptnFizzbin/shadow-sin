import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/BpLineItem.ts"
import { getTotalCost } from "#/components/CharacterBuilder/Sections/Gear/GearUtils.ts"
import { Lifestyles, LifestyleType } from "#/lib/system/LifestyleType.ts"

export const GearBuildPointAllowance = 50
export const GearNuyenPerBuildPoint = 5_000
export const GearNuyenAllowance = GearNuyenPerBuildPoint * GearBuildPointAllowance

export const useGearTotalCost = () => {
  const gear = useCharacterSheet((state) => state.gear)
  const allGear = Object.values(gear)

  const lifestyle = useCharacterSheet((state) => {
    const lifestyleType = state.profile.lifestyle?.quality ?? LifestyleType.Street
    return Lifestyles[lifestyleType]
  })
  const lifestyleMonths = useCharacterSheet(
    (state) => state.profile.lifestyle?.monthsPaid ?? 1,
  )

  const gearCost = getTotalCost(...allGear)
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
    isOverBudget: gearBuildPoints > GearBuildPointAllowance,
  }
}
