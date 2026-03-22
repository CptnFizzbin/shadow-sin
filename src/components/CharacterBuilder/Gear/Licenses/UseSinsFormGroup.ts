import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { LicenseFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/SinFormState.ts"

export function useSinsFormGroup() {
  const gearSlice = useCharacterBuilderStoreSlice(
    (state) => state.gear,
    (state, gear) => {
      state.gear = gear
      return state
    },
  )
  const sins = useCharacterBuilderStore((state) => state.gear.sins)

  const addSin = (sin: SinFormState) => {
    gearSlice.update((draft) => {
      draft.sins.push(sin)
    })
  }

  const updateSin = (sin: SinFormState) => {
    gearSlice.update((draft) => {
      const index = draft.sins.findIndex((item) => item.id === sin.id)
      if (index !== -1) draft.sins[index] = sin
    })
  }

  const removeSin = (sin: SinFormState) => {
    gearSlice.update((draft) => {
      draft.sins = draft.sins.filter((item) => item.id !== sin.id)
      draft.licenses = draft.licenses.filter((item) => item.sinId !== sin.id)
    })
  }

  const getLicensesForSin = (sinId: string): LicenseFormState[] => {
    return gearSlice.state.licenses.filter((license) => license.sinId === sinId)
  }

  return {
    sins,
    addSin,
    updateSin,
    removeSin,
    getLicensesForSin,
  }
}
