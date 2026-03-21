import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { LicenseFormState } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"

export function useLicensesFormGroup() {
  const gearSlice = useCharacterBuilderStoreSlice((state) => state.gear)
  const licenses = useCharacterBuilderStore((state) => state.gear.licenses)
  const sins = useCharacterBuilderStore((state) => state.gear.sins)

  const addLicense = (license: LicenseFormState) => {
    gearSlice.update((draft) => {
      draft.licenses.push(license)
    })
  }

  const updateLicense = (license: LicenseFormState) => {
    gearSlice.update((draft) => {
      const index = draft.licenses.findIndex((l) => l.id === license.id)
      if (index !== -1) draft.licenses[index] = license
    })
  }

  const removeLicense = (license: LicenseFormState) => {
    gearSlice.update((draft) => {
      draft.licenses = draft.licenses.filter((l) => l.id !== license.id)
    })
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
