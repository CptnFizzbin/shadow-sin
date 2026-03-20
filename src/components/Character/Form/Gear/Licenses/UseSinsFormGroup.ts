import { useStore } from "@tanstack/react-store"

import type { LicenseFormState } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/Character/Form/Gear/Licenses/Forms/SinFormState.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

export function useSinsFormGroup(form: PlayerCharacterForm) {
  const sins = useStore(form.store, (s) => s.values.gear.sins)

  const addSin = (sin: SinFormState) => {
    form.setFieldValue("gear.sins", (prev) => [...prev, sin])
  }

  const updateSin = (sin: SinFormState) => {
    form.setFieldValue("gear.sins", (prev) =>
      prev.map((item) => (item.id === sin.id ? sin : item)),
    )
  }

  const removeSin = (sin: SinFormState) => {
    form.setFieldValue("gear.sins", (prev) =>
      prev.filter((item) => item.id !== sin.id),
    )
    // Also remove associated licenses
    form.setFieldValue("gear.licenses", (prev) =>
      prev.filter((item) => item.sinId !== sin.id),
    )
  }

  const getLicensesForSin = (sinId: string): LicenseFormState[] => {
    const licenses = form.getFieldValue("gear.licenses")
    return licenses.filter((license) => license.sinId === sinId)
  }

  return {
    sins,
    addSin,
    updateSin,
    removeSin,
    getLicensesForSin,
  }
}
