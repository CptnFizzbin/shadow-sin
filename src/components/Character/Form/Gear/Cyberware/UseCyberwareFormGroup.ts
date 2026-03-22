import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { ImplantFormState } from "#/components/Character/Form/Gear/Cyberware/Forms/ImplantFormState.ts"
import { calculateImplantEssence } from "#/components/Character/Form/Gear/Cyberware/ImplantUtils.ts"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"

export function useCyberwareFormGroup() {
  const gearSlice = useCharacterBuilderStoreSlice(
    (state) => state.gear,
    (state, gear) => {
      state.gear = gear
      return state
    },
  )
  const implants = useCharacterBuilderStore((state) => state.gear.cyberware)
  const implantMods = useCharacterBuilderStore(
    (state) => state.gear.implantMods,
  )

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
      draft.implantMods = draft.implantMods.filter(
        (mod) => mod.parentId !== implantId,
      )
    })
  }

  const addImplantMod = (mod: GearItemFormState) => {
    gearSlice.update((draft) => {
      draft.implantMods.push(mod)
    })
  }

  const updateImplantMod = (mod: GearItemFormState) => {
    gearSlice.update((draft) => {
      const index = draft.implantMods.findIndex((m) => m.id === mod.id)
      if (index !== -1) draft.implantMods[index] = mod
    })
  }

  const removeImplantMod = (modId: string) => {
    gearSlice.update((draft) => {
      draft.implantMods = draft.implantMods.filter((m) => m.id !== modId)
    })
  }

  const getModsForImplant = (implantId: string): GearItemFormState[] =>
    gearSlice.state.implantMods.filter((mod) => mod.parentId === implantId)

  const essenceSummary = calculateImplantEssence(implants)

  return {
    implants,
    implantMods,
    addImplant,
    updateImplant,
    removeImplant,
    addImplantMod,
    updateImplantMod,
    removeImplantMod,
    getModsForImplant,
    essenceSummary,
  }
}
