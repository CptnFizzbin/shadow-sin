import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { useGearByType } from "#/hooks/items/gearHooks.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import {
  calculateArmorBulk,
  calculateArmorTotals,
  calculateEncumbrancePenalty,
} from "#/system/formulas/items/encumbranceUtils.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { ArmorData } from "#/system/model/items/armorData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"

export interface EncumbranceInfo {
  totalBallistic: number
  totalImpact: number
  threshold: number
  penalty: number
  isEncumbered: boolean
}

export function useEncumbrance(): EncumbranceInfo {
  const allArmor = useGearByType<ArmorData>(ItemType.armor)
  const body = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.body })

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
