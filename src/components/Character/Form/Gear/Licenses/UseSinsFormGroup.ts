import {
  useBuilderStore,
  useBuilderStoreSlice,
} from "#/components/CharacterBuilder/BuilderStoreProvider.tsx"
import type { SinData } from "#/lib/system/types/gear/SinData.ts"
import type { LicenseData } from "#/lib/system/types/gear/licenseData.ts"

export function useSinsFormGroup() {
  const gearSlice = useBuilderStoreSlice(
    (state) => state.gear,
    (state, gear) => {
      state.gear = gear
      return state
    },
  )
  const sins = useBuilderStore((state) => state.gear.sins)

  const addSin = (sin: SinData) => {
    gearSlice.update((draft) => {
      draft.sins.push(sin)
    })
  }

  const updateSin = (sin: SinData) => {
    gearSlice.update((draft) => {
      const index = draft.sins.findIndex((item) => item.id === sin.id)
      if (index !== -1) draft.sins[index] = sin
    })
  }

  const removeSin = (sin: SinData) => {
    gearSlice.update((draft) => {
      draft.sins = draft.sins.filter((item) => item.id !== sin.id)
    })
  }

  const getLicensesForSin = (sinId: string): LicenseData[] => {
    const sin = gearSlice.state.sins.find((item) => item.id === sinId)
    return sin?.licenses ?? []
  }

  const addLicenseToSin = (sinId: string, license: LicenseData) => {
    gearSlice.update((draft) => {
      const sin = draft.sins.find((item) => item.id === sinId)
      if (sin) {
        if (!sin.licenses) sin.licenses = []
        sin.licenses.push(license)
      }
    })
  }

  const updateLicenseOnSin = (sinId: string, license: LicenseData) => {
    gearSlice.update((draft) => {
      const sin = draft.sins.find((item) => item.id === sinId)
      if (sin?.licenses) {
        const index = sin.licenses.findIndex((l) => l.id === license.id)
        if (index !== -1) sin.licenses[index] = license
      }
    })
  }

  const removeLicenseFromSin = (sinId: string, licenseId: string) => {
    gearSlice.update((draft) => {
      const sin = draft.sins.find((item) => item.id === sinId)
      if (sin?.licenses) {
        sin.licenses = sin.licenses.filter((l) => l.id !== licenseId)
      }
    })
  }

  return {
    sins,
    addSin,
    updateSin,
    removeSin,
    getLicensesForSin,
    addLicenseToSin,
    updateLicenseOnSin,
    removeLicenseFromSin,
  }
}
