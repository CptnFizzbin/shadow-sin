import { useEffect } from "react"

import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { getImplantEffectiveNuyenCost } from "#/components/Character/Form/Gear/Cyberware/ImplantUtils.ts"
import {
  GearBpAllowance,
  getGearBpSpent,
} from "#/components/Character/Form/Gear/GearSectionRequirements.ts"

export function useGearFormGroup() {
  const buildPointsSlice = useCharacterBuilderStoreSlice(
    (state) => state.buildPoints,
    (state, buildPoints) => {
      state.buildPoints = buildPoints
      return state
    },
  )

  const gear = useCharacterBuilderStore((state) => state.gear)

  const genericNuyen =
    gear.weapons.reduce((sum, item) => sum + (item.cost ?? 0), 0) +
    gear.armor.reduce((sum, item) => sum + (item.cost ?? 0), 0) +
    gear.vehicles.reduce((sum, item) => sum + (item.cost ?? 0), 0) +
    gear.misc.reduce((sum, item) => sum + (item.cost ?? 0), 0) +
    gear.sins.reduce((sum, item) => sum + (item.cost ?? 0), 0) +
    gear.licenses.reduce((sum, item) => sum + (item.cost ?? 0), 0)

  const cyberwareNuyen = gear.cyberware.reduce(
    (sum, implant) => sum + getImplantEffectiveNuyenCost(implant),
    0,
  )

  const totalNuyen = genericNuyen + cyberwareNuyen

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
