import { useEffect } from "react"

import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import {
  GearBpAllowance,
  getGearBpSpent,
} from "#/components/Character/Form/Gear/GearSectionRequirements.ts"
import { getLicenseCost } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import { getSinCost } from "#/components/Character/Form/Gear/Licenses/Forms/SinFormState.ts"

export function useGearFormGroup() {
  const buildPointsSlice = useCharacterBuilderStoreSlice(
    (state) => state.buildPoints,
  )
  const gear = useCharacterBuilderStore((state) => state.gear)

  const totalNuyen = [
    ...gear.sins.map((sin) => getSinCost(sin.rating)),
    ...gear.licenses.map((license) => getLicenseCost(license.rating)),
  ].reduce((sum, cost) => sum + cost, 0)

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
