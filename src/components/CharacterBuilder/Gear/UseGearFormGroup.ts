import { useEffect } from "react"

import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { getImplantEffectiveNuyenCost } from "#/components/CharacterBuilder/Gear/Cyberware/ImplantUtils.ts"
import {
  GearBpAllowance,
  getGearBpSpent,
} from "#/components/CharacterBuilder/Gear/GearSectionRequirements.ts"
import { Lifestyles } from "#/lib/system/types/LifestyleType.ts"

export function useGearFormGroup() {
  const buildPointsSlice = useCharacterBuilderStoreSlice(
    (state) => state.buildPoints,
    (state, buildPoints) => {
      state.buildPoints = buildPoints
      return state
    },
  )

  const gear = useCharacterBuilderStore((state) => state.gear)
  const lifestyle = useCharacterBuilderStore((state) => state.lifestyle)
  const lifestyleMonths = useCharacterBuilderStore(
    (state) => state.lifestyleMonths,
  )

  const lifestyleNuyen = Lifestyles[lifestyle].upkeep * lifestyleMonths

  const genericNuyen = [
    ...gear.weapons.map((i) => i.cost),
    ...gear.armor.map((i) => i.cost),
    ...gear.vehicles.map((i) => i.cost),
    ...gear.devices.map((i) => i.cost),
    ...gear.misc.map((i) => i.cost),
    ...gear.sins.map((i) => i.cost),
    ...gear.licenses.map((i) => i.cost),
  ].reduce((sum, cost) => sum + cost, 0)

  const cyberwareNuyen =
    gear.cyberware.reduce(
      (sum, implant) => sum + getImplantEffectiveNuyenCost(implant),
      0,
    ) + gear.implantMods.reduce((sum, mod) => sum + (mod.cost ?? 0), 0)

  const totalNuyen = genericNuyen + cyberwareNuyen + lifestyleNuyen

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
