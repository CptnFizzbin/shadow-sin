import { AttributeKey } from "#data/attributes/attributeKey.ts"
import type { ArmorData } from "#data/items/armorData.ts"
import { ItemType } from "#data/items/itemType.ts"
import {
  calculateArmorBulk,
  calculateArmorTotals,
  calculateEncumbrancePenalty,
} from "#rules/items/encumbranceUtils.ts"
import { isItemEquipped } from "#rules/items/itemStateRules.ts"
import { useEntitySelector } from "#state/entity/useEntitySelector.ts"
import { AttrSelectors } from "#state/runner/attributes/attributes.selector.ts"
import { useGearByType } from "#state/runner/items/gearHooks.ts"

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

  const equippedArmor = allArmor.filter(isItemEquipped)
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
