import type { ImplantFormState } from "#/components/CharacterBuilder/Gear/Cyberware/Forms/ImplantFormState.ts"
import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useGearApi } from "#/components/Gear/UseGearApi.ts"

export function useImplantsStore() {
  const gear = useGearApi()

  const addImplant = (implant: Omit<ImplantFormState, "id">) => {
    gear.create({ ...implant, itemType: "cyberware" })
  }

  const updateImplant = (implant: ImplantFormState) => {
    gear.set({ ...implant, itemType: "cyberware" })
  }

  const removeImplant = (implant: ImplantFormState) => {
    gear.remove(implant.id, { removeChildren: true })
  }

  const addImplantMod = (mod: Omit<GearItemFormState, "id">) => {
    gear.create({ ...mod, itemType: "implantMods" })
  }

  const updateImplantMod = (mod: GearItemFormState) => {
    gear.set({ ...mod, itemType: "implantMods" })
  }

  const removeImplantMod = (mod: GearItemFormState) => {
    gear.remove(mod.id)
  }

  const getModsForImplant = (implantId: string): GearItemFormState[] =>
    gear.getByType<GearItemFormState>("implantMods").filter((mod) => mod.parentId === implantId)

  return {
    implants: gear.getByType<ImplantFormState>("cyberware"),
    implantMods: gear.getByType<GearItemFormState>("implantMods"),
    addImplant,
    updateImplant,
    removeImplant,
    addImplantMod,
    updateImplantMod,
    removeImplantMod,
    getModsForImplant,
  }
}
