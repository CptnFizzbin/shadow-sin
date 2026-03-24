import type { LicenseFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/SinFormState.ts"
import { useBuilderGearSlice } from "#/components/CharacterBuilder/Gear/UseBuilderGearSlice.ts"

export function useSinsFormGroup() {
  const gear = useBuilderGearSlice()
  const sins = gear.getItemsByType<SinFormState>("sins")

  const addSin = (sin: Omit<SinFormState, "id">) => {
    gear.createItem({ ...sin, type: "sins" })
  }

  const updateSin = (sin: SinFormState) => {
    gear.saveItem({ ...sin, type: "sins" })
  }

  const removeSin = (sin: SinFormState) => {
    // remove sin and associated licenses
    const licenses = gear.getItemsByType<LicenseFormState>("licenses").filter((l) => l.sinId === sin.id)
    licenses.forEach((l) => gear.deleteItem({ id: l.id }, { removeChildren: true }))
    gear.deleteItem({ id: sin.id }, { removeChildren: true })
  }

  const getLicensesForSin = (sinId: string): LicenseFormState[] => {
    return gear.getItemsByType<LicenseFormState>("licenses").filter((license) => license.sinId === sinId)
  }

  return {
    sins,
    addSin,
    updateSin,
    removeSin,
    getLicensesForSin,
  }
}
