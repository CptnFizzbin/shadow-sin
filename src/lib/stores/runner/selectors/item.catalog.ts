import { getImplantEffectiveEssenceCost } from "#/components/items/types/implants/implantUtils.ts"
import { armor as armorSelectors, selectById, selectEquipped, selectGearOfType } from "#/lib/stores/runner/gear/gearSlice.selectors.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { ArmorRating } from "#/system/gear/armorData.ts"
import { ImplantType } from "#/system/gear/implantData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { ItemDataFor } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import type { RunnerAttributeCatalog } from "./attribute.catalog.ts"

export interface ItemEssenceFacets {
  used: number
  remaining: number
  cyberwareEssence: number
  biowareEssence: number
}

export interface RunnerItemCatalog {
  (id: UUID): ItemData | undefined
  byType: <T extends ItemType>(type: T) => ItemDataFor<T>[]
  equipped: ItemData[]
  armor: {
    total: ArmorRating
    effective: ArmorRating
  }
  essence: ItemEssenceFacets
}

function selectArmorTotal(state: RunnerData): ArmorRating {
  const equippedArmor = armorSelectors.selectEquipped(state)
  return {
    ballistic: equippedArmor.reduce((sum, armor) => sum + armor.ballistic, 0),
    impact: equippedArmor.reduce((sum, armor) => sum + armor.impact, 0),
  }
}

function selectArmorEffective(state: RunnerData): ArmorRating {
  const equippedArmor = armorSelectors.selectEquipped(state)
  return {
    ballistic: Math.max(0, ...equippedArmor.map((armor) => armor.ballistic)),
    impact: Math.max(0, ...equippedArmor.map((armor) => armor.impact)),
  }
}

function selectEssence(state: RunnerData, essenceMax: number): ItemEssenceFacets {
  // Accessory implants (parentId set) cost Capacity on their host, not Essence — see
  // getImplantEffectiveEssenceCost.
  const implants = Object.values(selectGearOfType(ItemType.implant)(state))
    .filter((implant) => !implant.parentId)

  const cyberwareEssence = implants
    .filter((implant) => implant.implantType === ImplantType.cyberware)
    .reduce((sum, implant) => sum + getImplantEffectiveEssenceCost(implant), 0)

  const biowareEssence = implants
    .filter((implant) => implant.implantType === ImplantType.bioware)
    .reduce((sum, implant) => sum + getImplantEffectiveEssenceCost(implant), 0)

  // Whichever of cyberware/bioware essence cost is smaller only counts at half.
  const used = cyberwareEssence >= biowareEssence
    ? cyberwareEssence + (biowareEssence / 2)
    : biowareEssence + (cyberwareEssence / 2)

  return {
    used,
    remaining: essenceMax - used,
    cyberwareEssence,
    biowareEssence,
  }
}

/**
 * `essence` reads its cap through the `attribute` namespace (`attribute(AttributeKey.essence).info.max`)
 * rather than a hardcoded constant — a Selector Catalog entry composing another namespace's Selector
 * instead of reimplementing it.
 */
export function buildItemCatalog(state: RunnerData, attribute: RunnerAttributeCatalog): RunnerItemCatalog {
  const catalog = (id: UUID): ItemData | undefined => selectById(id)(state)

  return Object.assign(catalog, {
    byType: <T extends ItemType>(type: T): ItemDataFor<T>[] => Object.values(selectGearOfType(type)(state)),
    equipped: selectEquipped(state),
    armor: {
      total: selectArmorTotal(state),
      effective: selectArmorEffective(state),
    },
    essence: selectEssence(state, attribute(AttributeKey.essence).info.max),
  })
}
