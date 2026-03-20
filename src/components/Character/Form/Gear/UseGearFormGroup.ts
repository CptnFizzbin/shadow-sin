import { useEffect } from "react"

import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreContext,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import {
  GearBpAllowance,
  getGearBpSpent,
} from "#/components/Character/Form/Gear/GearSectionRequirements.ts"
import { getLicenseCost } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import { getSinCost } from "#/components/Character/Form/Gear/Licenses/Forms/SinFormState.ts"

export function useGearFormGroup() {
  const store = useCharacterBuilderStoreContext()
  const gear = useCharacterBuilderStore((state) => state.gear)

  const totalNuyen = [
    ...gear.sins.map((sin) => getSinCost(sin.rating)),
    ...gear.licenses.map((license) => getLicenseCost(license.rating)),
  ].reduce((sum, cost) => sum + cost, 0)

  const totalBp = getGearBpSpent(totalNuyen)
  const isOverBudget = totalBp > GearBpAllowance
  const hasRealSin = gear.sins.some((sin) => sin.rating === "real")

  useEffect(() => {
    store.setState((prev) => ({
      ...prev,
      buildPoints: {
        ...prev.buildPoints,
        spent: {
          ...prev.buildPoints.spent,
          gear: totalBp,
        },
      },
    }))
  }, [store, totalBp])

  return {
    totalNuyen,
    totalBp,
    isOverBudget,
    hasRealSin,
    gear,
  }
}
