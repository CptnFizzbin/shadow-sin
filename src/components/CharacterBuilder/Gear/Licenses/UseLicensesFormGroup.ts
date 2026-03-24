import type { LicenseFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/SinFormState.ts"
import { useBuilderGearSlice } from "#/components/CharacterBuilder/Gear/UseBuilderGearSlice.ts"

export function useLicensesFormGroup() {
  const gear = useBuilderGearSlice()
  const licenses = gear.getItemsByType<LicenseFormState>("licenses")
  const sins = gear.getItemsByType<SinFormState>("sins")

  const addLicense = (license: Omit<LicenseFormState, "id">) => {
    gear.createItem({ ...license, type: "licenses" })
  }

  const updateLicense = (license: LicenseFormState) => {
    gear.saveItem({ ...license, type: "licenses" })
  }

  const removeLicense = (license: LicenseFormState) => {
    gear.deleteItem({ id: license.id }, { removeChildren: true })
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
