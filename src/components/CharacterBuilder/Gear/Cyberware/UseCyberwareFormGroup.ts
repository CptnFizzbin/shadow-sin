import {
  useBuilderStoreSlice,
  useBuildStateStore,
} from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"
import { calculateImplantEssence } from "#/components/CharacterBuilder/Gear/Cyberware/ImplantUtils.ts"
import type { GearData } from "#/lib/system/types/gear/gearData.ts"
import type { ImplantData } from "#/lib/system/types/gear/implantData.ts"

export function useCyberwareFormGroup() {
  const gearSlice = useBuilderStoreSlice(
    (state) => state.gear,
    (state, gear) => {
      state.gear = gear
      return state
    },
  )
  const implants = useBuildStateStore((state) => state.gear.cyberware)

  const addImplant = (implant: ImplantData) => {
    gearSlice.update((draft) => {
      draft.cyberware.push(implant)
    })
  }

  const updateImplant = (implant: ImplantData) => {
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

  const addImplantMod = (implantId: string, mod: GearData) => {
    gearSlice.update((draft) => {
      const implant = draft.cyberware.find((item) => item.id === implantId)
      if (implant) {
        if (!implant.attachments) implant.attachments = []
        implant.attachments.push(mod)
      }
    })
  }

  const updateImplantMod = (implantId: string, mod: GearData) => {
    gearSlice.update((draft) => {
      const implant = draft.cyberware.find((item) => item.id === implantId)
      if (implant?.attachments) {
        const index = implant.attachments.findIndex((m) => m.id === mod.id)
        if (index !== -1) implant.attachments[index] = mod
      }
    })
  }

  const removeImplantMod = (implantId: string, modId: string) => {
    gearSlice.update((draft) => {
      const implant = draft.cyberware.find((item) => item.id === implantId)
      if (implant?.attachments) {
        implant.attachments = implant.attachments.filter((m) => m.id !== modId)
      }
    })
  }

  const getModsForImplant = (implantId: string): GearData[] => {
    const implant = gearSlice.state.cyberware.find(
      (item) => item.id === implantId,
    )
    return implant?.attachments ?? []
  }

  const essenceSummary = calculateImplantEssence(implants)

  return {
    implants,
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
