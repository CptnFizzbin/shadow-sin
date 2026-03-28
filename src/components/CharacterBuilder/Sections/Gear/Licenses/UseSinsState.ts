import type { LicenseFormState } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Forms/SinFormState.ts"
import { useGearApi, useGearByType } from "#/components/Gear/UseGearApi.ts"

export function useSinsState() {
  const gear = useGearApi()
  const sins = useGearByType<SinFormState>("sins")

  const addSin = (sin: Omit<SinFormState, "id">) => {
    gear.add({ ...sin, itemType: "sins" })
  }

  const updateSin = (sin: SinFormState) => {
    gear.set({ ...sin, itemType: "sins" })
  }

  const removeSin = (sin: SinFormState) => {
    // Read live state so we get the freshest license list when the handler fires.
    const licenses = Object.values(gear.store.state)
      .filter((item) => item.itemType === "licenses" && (item as unknown as LicenseFormState).sinId === sin.id) as unknown as LicenseFormState[]
    licenses.forEach((l) => gear.remove(l.id, { removeChildren: true }))
    gear.remove(sin.id, { removeChildren: true })
  }

  const getLicensesForSin = (sinId: string): LicenseFormState[] => {
    return Object.values(gear.store.state)
      .filter((item) => item.itemType === "licenses" && (item as unknown as LicenseFormState).sinId === sinId) as unknown as LicenseFormState[]
  }

  return {
    sins,
    addSin,
    updateSin,
    removeSin,
    getLicensesForSin,
  }
}
