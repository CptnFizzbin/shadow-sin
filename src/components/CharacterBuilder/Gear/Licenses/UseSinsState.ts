import type { LicenseFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/SinFormState.ts"
import { useGearApi } from "#/components/Gear/UseGearApi.ts"

export function useSinsState() {
  const gear = useGearApi()
  const sins = gear.getByType<SinFormState>("sins")

  const addSin = (sin: Omit<SinFormState, "id">) => {
    gear.create({ ...sin, itemType: "sins" })
  }

  const updateSin = (sin: SinFormState) => {
    gear.set({ ...sin, itemType: "sins" })
  }

  const removeSin = (sin: SinFormState) => {
    // remove sin and associated licenses
    const licenses = gear.getByType<LicenseFormState>("licenses").filter((l) => l.sinId === sin.id)
    licenses.forEach((l) => gear.remove(l.id, { removeChildren: true }))
    gear.remove(sin.id, { removeChildren: true })
  }

  const getLicensesForSin = (sinId: string): LicenseFormState[] => {
    return gear.getByType<LicenseFormState>("licenses").filter((license) => license.sinId === sinId)
  }

  return {
    sins,
    addSin,
    updateSin,
    removeSin,
    getLicensesForSin,
  }
}
