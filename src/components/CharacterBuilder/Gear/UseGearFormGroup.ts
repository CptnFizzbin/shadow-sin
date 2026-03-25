import { useEffect } from "react"

import {
  useBuilderStoreSlice,
  useBuildStateStore,
} from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"
import { getImplantEffectiveNuyenCost } from "#/components/CharacterBuilder/Gear/Cyberware/ImplantUtils.ts"
import {
  GearBpAllowance,
  getGearBpSpent,
} from "#/components/CharacterBuilder/Gear/GearSectionRequirements.ts"
import { Lifestyles } from "#/lib/system/types/LifestyleType.ts"
import { VerificationKind } from "#/lib/system/types/gear/licenseData.ts"

export function useGearFormGroup() {
  const buildPointsSlice = useBuilderStoreSlice(
    (state) => state.buildPoints,
    (state, buildPoints) => {
      state.buildPoints = buildPoints
      return state
    },
  )

  const gear = useBuildStateStore((state) => state.gear)
  const lifestyle = useBuildStateStore((state) => state.lifestyle)
  const lifestyleMonths = useBuildStateStore((state) => state.lifestyleMonths)

  const lifestyleNuyen = Lifestyles[lifestyle].upkeep * lifestyleMonths

  const sinAndLicenseNuyen = gear.sins.reduce((sum, sin) => {
    const licenseCost = (sin.licenses ?? []).reduce(
      (licSum, lic) => licSum + (lic.cost ?? 0),
      0,
    )
    return sum + (sin.cost ?? 0) + licenseCost
  }, 0)

  const genericNuyen =
    gear.weapons.reduce((sum, item) => sum + (item.cost ?? 0), 0) +
    gear.armor.reduce((sum, item) => sum + (item.cost ?? 0), 0) +
    gear.vehicles.reduce((sum, item) => sum + (item.cost ?? 0), 0) +
    gear.devices.reduce((sum, item) => sum + (item.cost ?? 0), 0) +
    gear.misc.reduce((sum, item) => sum + (item.cost ?? 0), 0) +
    sinAndLicenseNuyen

  const cyberwareNuyen = gear.cyberware.reduce((sum, implant) => {
    const modCost = (implant.attachments ?? []).reduce(
      (modSum, mod) => modSum + (mod.cost ?? 0),
      0,
    )
    return sum + getImplantEffectiveNuyenCost(implant) + modCost
  }, 0)

  const totalNuyen = genericNuyen + cyberwareNuyen + lifestyleNuyen

  const totalBp = getGearBpSpent(totalNuyen)
  const isOverBudget = totalBp > GearBpAllowance
  const hasRealSin = gear.sins.some(
    (sin) => sin.verification.kind === VerificationKind.Real,
  )

  const gearBpSpent = useBuildStateStore(
    (state) => state.buildPoints.spent.gear,
  )

  useEffect(() => {
    if (gearBpSpent !== totalBp) {
      buildPointsSlice.update((draft) => {
        draft.spent.gear = totalBp
      })
    }
  }, [buildPointsSlice, gearBpSpent, totalBp])

  return {
    totalNuyen,
    totalBp,
    isOverBudget,
    hasRealSin,
    gear,
  }
}
