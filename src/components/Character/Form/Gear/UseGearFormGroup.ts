import { useStore } from "@tanstack/react-store"
import { useEffect } from "react"

import {
  GearBpAllowance,
  getGearBpSpent,
} from "#/components/Character/Form/Gear/GearSectionRequirements.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

export function useGearFormGroup(form: PlayerCharacterForm) {
  const gear = useStore(form.store, (store) => store.values.gear)

  const totalNuyen = (Object.values(gear) as Array<{ cost: number }[]>)
    .flat()
    .reduce((sum, item) => sum + (item.cost ?? 0), 0)

  const totalBp = getGearBpSpent(totalNuyen)
  const isOverBudget = totalBp > GearBpAllowance
  const hasRealSin = gear.sins.some((sin) => sin.rating === "real")

  useEffect(() => {
    form.setFieldValue("buildPoints.spent.gear", totalBp)
  }, [form, totalBp])

  return {
    totalNuyen,
    totalBp,
    isOverBudget,
    hasRealSin,
    gear,
  }
}
