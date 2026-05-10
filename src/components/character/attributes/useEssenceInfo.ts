import { getImplantEffectiveEssenceCost } from "#/components/items/types/implants/implantUtils.ts"
import { useGearByType } from "#/components/items/useGearStore.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantType } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"

import { useAttrInfo } from "./attributesProvider.tsx"

/**
 * Hook to retrieve essence usage and remaining values.
 */
export const useEssenceInfo = () => {
  const essenceInfo = useAttrInfo(AttributeKey.essence)
  const implants = useGearByType<ImplantData>(ItemType.implant)

  const implantEssence = implants
    .filter((implant) => !implant.parentId) // implant accessories cost Capacity, not Essence
    .map((implant) => ({
      implantType: implant.implantType,
      essenceCost: getImplantEffectiveEssenceCost(implant),
    }))

  const cyberwareEssence = implantEssence.filter((i) => i.implantType === ImplantType.cyberware)
    .map((item) => item.essenceCost)
    .reduce((sum, cost) => sum + cost, 0)

  const biowareEssence = implantEssence.filter((i) => i.implantType === ImplantType.bioware)
    .map((item) => item.essenceCost)
    .reduce((sum, cost) => sum + cost, 0)

  const essenceUsed =
    cyberwareEssence >= biowareEssence
      ? cyberwareEssence + (biowareEssence / 2)
      : biowareEssence + (cyberwareEssence / 2)

  const essenceRemaining = essenceInfo.max - essenceUsed

  return {
    essenceUsed,
    essenceRemaining,
    cyberwareEssence,
    biowareEssence,
  }
}
