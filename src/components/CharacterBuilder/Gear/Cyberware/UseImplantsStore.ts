import type { ImplantFormState } from "#/components/CharacterBuilder/Gear/Cyberware/Forms/ImplantFormState.ts"
import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import { useGearApi, useGearByType } from "#/components/Gear/UseGearApi.ts"

export function useImplantsStore() {
  const gear = useGearApi()
  const implants = useGearByType<ImplantFormState>("cyberware")
  const implantMods = useGearByType<GearItemFormState>("implantMods")

  const addImplant = (implant: Omit<ImplantFormState, "id">) => {
    gear.add({ ...implant, itemType: "cyberware" })
  }

  const updateImplant = (implant: ImplantFormState) => {
    gear.set({ ...implant, itemType: "cyberware" })
  }

  const removeImplant = (implant: ImplantFormState) => {
    gear.remove(implant.id, { removeChildren: true })
  }

  const addImplantMod = (mod: Omit<GearItemFormState, "id">) => {
    gear.add({ ...mod, itemType: "implantMods" })
  }

  const updateImplantMod = (mod: GearItemFormState) => {
    gear.set({ ...mod, itemType: "implantMods" })
  }

  const removeImplantMod = (mod: GearItemFormState) => {
    gear.remove(mod.id)
  }

  // Reads live state so the result is always up-to-date when called imperatively.
  const getModsForImplant = (implantId: string): GearItemFormState[] =>
    Object.values(gear.store.state)
      .filter((item) => item.itemType === "implantMods" && item.parentId === implantId) as unknown as GearItemFormState[]

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
  }
}
