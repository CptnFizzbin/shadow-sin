import { useEffect } from "react"

import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import {
  GearBuildPointAllowance,
  useGearBuildPoints,
  useGearTotalCost,
} from "#/components/Character/Form/Gear/GearUtils.ts"

export function useGearFormGroup() {
  const buildPointsSlice = useCharacterBuilderStoreSlice(
    (state) => state.buildPoints,
    (state, buildPoints) => {
      state.buildPoints = buildPoints
      return state
    },
  )

  const gear = useCharacterBuilderStore((state) => state.gear)

  const totalNuyen = useGearTotalCost()
  const totalBp = useGearBuildPoints().spent
  const isOverBudget = totalBp > GearBuildPointAllowance
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
