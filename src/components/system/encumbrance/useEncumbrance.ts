import { useGearByType } from "#/components/items/gearHooks.ts"
import { useAttrValue } from "#/components/runner/attributes/attributesProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { calculateArmorBulk, calculateArmorTotals, calculateEncumbrancePenalty } from "#/system/gear/encumbranceUtils.ts"
import { ItemType } from "#/system/itemType.ts"

export interface EncumbranceInfo {
  totalBallistic: number
  totalImpact: number
  threshold: number
  penalty: number
  isEncumbered: boolean
}

export function useEncumbrance(): EncumbranceInfo {
  const allArmor = useGearByType<ArmorData>(ItemType.armor)
  const body = useAttrValue(AttributeKey.body)

  const equippedArmor = allArmor.filter((a) => a.equipped)
  const { ballistic: totalBallistic, impact: totalImpact } = calculateArmorTotals(equippedArmor)
  const bulk = calculateArmorBulk(equippedArmor)
  const threshold = body * 2
  const penalty = calculateEncumbrancePenalty(bulk.ballistic, bulk.impact, body)

  return {
    totalBallistic,
    totalImpact,
    threshold,
    penalty,
    isEncumbered: penalty > 0,
  }
}
