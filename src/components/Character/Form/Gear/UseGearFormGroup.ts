import { useEffect } from "react"

import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import {
  GearBpAllowance,
  getGearBpSpent,
} from "#/components/Character/Form/Gear/GearSectionRequirements.ts"

export function useGearFormGroup() {
  const buildPointsSlice = useCharacterBuilderStoreSlice(
    (state) => state.buildPoints,
  )
  const gear = useCharacterBuilderStore((state) => state.gear)

  const totalNuyen = (Object.values(gear) as Array<{ cost: number }[]>)
    .flat()
    .reduce((sum, item) => sum + (item.cost ?? 0), 0)

  const totalBp = getGearBpSpent(totalNuyen)
  const isOverBudget = totalBp > GearBpAllowance
  const hasRealSin = gear.sins.some((sin) => sin.rating === "real")

  useEffect(() => {
    buildPointsSlice.update((draft) => {
      draft.spent.gear = totalBp
    })
  }, [buildPointsSlice, totalBp])

  return {
    totalNuyen,
    totalBp,
    isOverBudget,
    hasRealSin,
    gear,
  }
}
