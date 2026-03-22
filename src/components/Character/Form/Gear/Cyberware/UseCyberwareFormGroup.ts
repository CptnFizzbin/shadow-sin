import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { ImplantFormState } from "#/components/Character/Form/Gear/Cyberware/Forms/ImplantFormState.ts"
import { calculateImplantEssence } from "#/components/Character/Form/Gear/Cyberware/ImplantUtils.ts"

export function useCyberwareFormGroup() {
  const gearSlice = useCharacterBuilderStoreSlice(
    (state) => state.gear,
    (state, gear) => {
      state.gear = gear
      return state
    },
  )
  const implants = useCharacterBuilderStore((state) => state.gear.cyberware)

  const addImplant = (implant: ImplantFormState) => {
    gearSlice.update((draft) => {
      draft.cyberware.push(implant)
    })
  }

  const updateImplant = (implant: ImplantFormState) => {
    gearSlice.update((draft) => {
      const index = draft.cyberware.findIndex((item) => item.id === implant.id)
      if (index !== -1) draft.cyberware[index] = implant
    })
  }

  const removeImplant = (implantId: string) => {
    gearSlice.update((draft) => {
      draft.cyberware = draft.cyberware.filter((item) => item.id !== implantId)
    })
  }

  const essenceSummary = calculateImplantEssence(implants)

  return {
    implants,
    addImplant,
    updateImplant,
    removeImplant,
    essenceSummary,
  }
}
