import { GearBpAllowance, getGearBpSpent } from "#/components/CharacterBuilder/Gear/GearSectionRequirements.ts"
import type { SinFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/SinFormState.ts"
import { useBuilderGearApi } from "#/components/CharacterBuilder/Gear/UseBuilderGearApi.ts"
import { GearType } from "#/lib/system/types/gear/gearData.ts"

export function useGearState() {
  const gearApi = useBuilderGearApi()

  const totalNuyen = gearApi.allItems()
    .map((item) => item.cost ?? 0)
    .reduce((sum, cost) => sum + cost, 0)

  const totalBp = getGearBpSpent(totalNuyen)
  const isOverBudget = totalBp > GearBpAllowance

  const sins = gearApi.getItemsByType<SinFormState>(GearType.sin)
  const hasRealSin = sins.some((sin) => sin.rating === "real")

  return {
    totalNuyen,
    totalBp,
    isOverBudget,
    hasRealSin,
    gear: gearApi,
  }
}
