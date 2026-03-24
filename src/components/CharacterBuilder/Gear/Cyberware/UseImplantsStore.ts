import type { ImplantFormState } from "#/components/CharacterBuilder/Gear/Cyberware/Forms/ImplantFormState.ts"
import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useBuilderGearSlice } from "#/components/CharacterBuilder/Gear/UseBuilderGearSlice.ts"

export function useImplantsStore() {
  const gear = useBuilderGearSlice()

  const addImplant = (implant: Omit<ImplantFormState, "id">) => {
    gear.createItem({ ...implant, type: "cyberware" })
  }

  const updateImplant = (implant: ImplantFormState) => {
    gear.saveItem({ ...implant, type: "cyberware" })
  }

  const removeImplant = (implant: ImplantFormState) => {
    gear.deleteItem(implant, { removeChildren: true })
  }

  const addImplantMod = (mod: Omit<GearItemFormState, "id">) => {
    gear.createItem({ ...mod, type: "implantMods" })
  }

  const updateImplantMod = (mod: GearItemFormState) => {
    gear.saveItem({ ...mod, type: "implantMods" })
  }

  const removeImplantMod = (mod: GearItemFormState) => {
    gear.deleteItem({ id: mod.id })
  }

  const getModsForImplant = (implantId: string): GearItemFormState[] =>
    gear.getItemsByType<GearItemFormState>("implantMods").filter((mod) => mod.parentId === implantId)

  return {
    implants: gear.getItemsByType<ImplantFormState>("cyberware"),
    implantMods: gear.getItemsByType<GearItemFormState>("implantMods"),
    addImplant,
    updateImplant,
    removeImplant,
    addImplantMod,
    updateImplantMod,
    removeImplantMod,
    getModsForImplant,
  }
}
