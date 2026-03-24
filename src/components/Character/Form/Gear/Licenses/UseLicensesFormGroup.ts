import { useSinsFormGroup } from "#/components/Character/Form/Gear/Licenses/UseSinsFormGroup.ts"
import type { LicenseData } from "#/lib/system/types/gear/licenseData.ts"

export function useLicensesFormGroup(sinId: string) {
  const {
    sins,
    getLicensesForSin,
    addLicenseToSin,
    updateLicenseOnSin,
    removeLicenseFromSin,
  } = useSinsFormGroup()

  const sin = sins.find((s) => s.id === sinId)
  const licenses = getLicensesForSin(sinId)
  const sinReal = sin?.verification.kind === "Real"

  const addLicense = (license: LicenseData) => addLicenseToSin(sinId, license)
  const updateLicense = (license: LicenseData) =>
    updateLicenseOnSin(sinId, license)
  const removeLicense = (license: LicenseData) =>
    removeLicenseFromSin(sinId, license.id)

  return {
    sin,
    sins,
    sinReal,
    licenses,
    addLicense,
    updateLicense,
    removeLicense,
  }
}
