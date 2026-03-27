import type { LicenseFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/SinFormState.ts"
import { useGearApi, useGearByType } from "#/components/Gear/UseGearApi.ts"

export function useLicensesState() {
  const gear = useGearApi()
  const licenses = useGearByType<LicenseFormState>("licenses")
  const sins = useGearByType<SinFormState>("sins")

  const addLicense = (license: Omit<LicenseFormState, "id">) => {
    gear.add({ ...license, itemType: "licenses" })
  }

  const updateLicense = (license: LicenseFormState) => {
    gear.set({ ...license, itemType: "licenses" })
  }

  const removeLicense = (license: LicenseFormState) => {
    gear.remove(license.id, { removeChildren: true })
  }

  const getLicensesForSin = (sinId: string): LicenseFormState[] => {
    return licenses.filter((license) => license.sinId === sinId)
  }

  return {
    licenses,
    sins,
    addLicense,
    updateLicense,
    removeLicense,
    getLicensesForSin,
  }
}
