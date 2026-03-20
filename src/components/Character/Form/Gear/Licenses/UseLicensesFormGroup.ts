import { useStore } from "@tanstack/react-store"

import type { LicenseFormState } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

export function useLicensesFormGroup(form: PlayerCharacterForm) {
  const licenses = useStore(form.store, (s) => s.values.gear.licenses)
  const sins = useStore(form.store, (s) => s.values.gear.sins)

  const addLicense = (license: LicenseFormState) => {
    form.setFieldValue("gear.licenses", (prev) => [...prev, license])
  }

  const updateLicense = (license: LicenseFormState) => {
    form.setFieldValue("gear.licenses", (prev) =>
      prev.map((l) => (l.id === license.id ? license : l)),
    )
  }

  const removeLicense = (license: LicenseFormState) => {
    form.setFieldValue("gear.licenses", (prev) =>
      prev.filter((l) => l.id !== license.id),
    )
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
