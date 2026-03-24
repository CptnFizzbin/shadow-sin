import { useEffect } from "react"

import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { ImplantFormState } from "#/components/CharacterBuilder/Gear/Cyberware/Forms/ImplantFormState.ts"
import { getImplantEffectiveNuyenCost } from "#/components/CharacterBuilder/Gear/Cyberware/ImplantUtils.ts"
import {
  GearBpAllowance,
  getGearBpSpent,
} from "#/components/CharacterBuilder/Gear/GearSectionRequirements.ts"
import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import type { LicenseFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/SinFormState.ts"
import { useBuilderGearSlice } from "#/components/CharacterBuilder/Gear/UseBuilderGearSlice.ts"
import { Lifestyles } from "#/lib/system/types/LifestyleType.ts"

export function useGearFormGroup() {
  const buildPointsSlice = useCharacterBuilderStore((state) => state.buildPoints)

  const gearApi = useBuilderGearSlice()
  const weapons = gearApi.getItemsByType<GearItemFormState>("weapons")
  const armor = gearApi.getItemsByType<GearItemFormState>("armor")
  const vehicles = gearApi.getItemsByType<GearItemFormState>("vehicles")
  const devices = gearApi.getItemsByType<GearItemFormState>("devices")
  const misc = gearApi.getItemsByType<GearItemFormState>("misc")
  const sins = gearApi.getItemsByType<SinFormState>("sins")
  const licenses = gearApi.getItemsByType<LicenseFormState>("licenses")
  const cyberware = gearApi.getItemsByType<ImplantFormState>("cyberware")
  const implantMods = gearApi.getItemsByType<GearItemFormState>("implantMods")

  const lifestyle = useCharacterBuilderStore((state) => state.lifestyle)
  const lifestyleMonths = useCharacterBuilderStore((state) => state.lifestyleMonths)
  const lifestyleNuyen = Lifestyles[lifestyle].upkeep * lifestyleMonths

  const genericNuyen = [
    ...weapons.map((i) => i.cost ?? 0),
    ...armor.map((i) => i.cost ?? 0),
    ...vehicles.map((i) => i.cost ?? 0),
    ...devices.map((i) => i.cost ?? 0),
    ...misc.map((i) => i.cost ?? 0),
    ...sins.map((i) => i.cost ?? 0),
    ...licenses.map((i) => i.cost ?? 0),
  ].reduce((sum, cost) => sum + cost, 0)

  const cyberwareNuyen =
    cyberware.reduce(
      (sum, implant) => sum + getImplantEffectiveNuyenCost(implant),
      0,
    ) + implantMods.reduce((sum, mod) => sum + (mod.cost ?? 0), 0)

  const totalNuyen = genericNuyen + cyberwareNuyen + lifestyleNuyen

  const totalBp = getGearBpSpent(totalNuyen)
  const isOverBudget = totalBp > GearBpAllowance
  const hasRealSin = sins.some((sin) => sin.rating === "real")

  useEffect(() => {
    buildPointsSlice.spent.gear = totalBp
  }, [buildPointsSlice, totalBp])

  return {
    totalNuyen,
    totalBp,
    isOverBudget,
    hasRealSin,
    gear: gearApi,
  }
}
