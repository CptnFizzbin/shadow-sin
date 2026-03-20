import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreContext,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { LicenseFormState } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"

export function useLicensesFormGroup() {
  const store = useCharacterBuilderStoreContext()
  const licenses = useCharacterBuilderStore((state) => state.gear.licenses)
  const sins = useCharacterBuilderStore((state) => state.gear.sins)

  const addLicense = (license: LicenseFormState) => {
    store.setState((prev) => ({
      ...prev,
      gear: {
        ...prev.gear,
        licenses: [...prev.gear.licenses, license],
      },
    }))
  }

  const updateLicense = (license: LicenseFormState) => {
    store.setState((prev) => ({
      ...prev,
      gear: {
        ...prev.gear,
        licenses: prev.gear.licenses.map((existingLicense) =>
          existingLicense.id === license.id ? license : existingLicense,
        ),
      },
    }))
  }

  const removeLicense = (license: LicenseFormState) => {
    store.setState((prev) => ({
      ...prev,
      gear: {
        ...prev.gear,
        licenses: prev.gear.licenses.filter(
          (existingLicense) => existingLicense.id !== license.id,
        ),
      },
    }))
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
