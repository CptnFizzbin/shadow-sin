import { useMemo } from "react"

import { BASE_ESSENCE } from "#/components/CharacterBuilder/Gear/Cyberware/ImplantUtils.ts"
import { useImplantsStore } from "#/components/CharacterBuilder/Gear/Cyberware/UseImplantsStore.ts"

export function useCyberwareState() {
  const {
    implants,
    implantMods,
    addImplant,
    updateImplant,
    removeImplant,
    addImplantMod,
    updateImplantMod,
    removeImplantMod,
    getModsForImplant,
  } = useImplantsStore()

  const essenceSummary = useMemo(() => {
    const cyberwareTotal = implants.reduce(
      (sum, i) => sum + (i.essenceCost ?? 0),
      0,
    )
    const biowareTotal = 0 // placeholder if bioware tracked separately
    const effectiveEssenceUsed = cyberwareTotal + biowareTotal
    const remainingEssence = BASE_ESSENCE - effectiveEssenceUsed

    return { cyberwareTotal, biowareTotal, effectiveEssenceUsed, remainingEssence }
  }, [implants])

  return {
    implants: implants,
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
