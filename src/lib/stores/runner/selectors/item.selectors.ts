import type { Selector } from "reselect"
import { createSelector } from "reselect"

import { BASE_ESSENCE, getImplantEffectiveEssenceCost } from "#/components/items/types/implants/implantUtils.ts"
import { armor as armorSelectors, selectGearOfType } from "#/lib/stores/runner/gear/gearSlice.selectors.ts"
import type { ArmorRating } from "#/system/gear/armorData.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantType } from "#/system/gear/implantData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface ItemEssenceFacets {
  used: number
  remaining: number
  cyberwareEssence: number
  biowareEssence: number
}

export const selectItemsOfType: Selector<RunnerData, ItemData[], [type: ItemType]> = createSelector(
  [(state: RunnerData, type: ItemType) => selectGearOfType(type)(state)],
  (itemsById) => Object.values(itemsById),
)

export const selectArmorTotal: Selector<RunnerData, ArmorRating> = createSelector(
  [armorSelectors.selectEquipped],
  (equippedArmor) => ({
    ballistic: equippedArmor.reduce((sum, armor) => sum + armor.ballistic, 0),
    impact: equippedArmor.reduce((sum, armor) => sum + armor.impact, 0),
  }),
)

export const selectArmorEffective: Selector<RunnerData, ArmorRating> = createSelector(
  [armorSelectors.selectEquipped],
  (equippedArmor) => ({
    ballistic: Math.max(0, ...equippedArmor.map((armor) => armor.ballistic)),
    impact: Math.max(0, ...equippedArmor.map((armor) => armor.impact)),
  }),
)

export const selectEssence: Selector<RunnerData, ItemEssenceFacets> = createSelector(
  [(state: RunnerData) => selectItemsOfType(state, ItemType.implant) as ImplantData[]],
  (implants): ItemEssenceFacets => {
    // Accessory implants (parentId set) cost Capacity on their host, not Essence — see
    // getImplantEffectiveEssenceCost.
    const rootImplants = implants.filter((implant) => !implant.parentId)

    const cyberwareEssence = rootImplants
      .filter((implant) => implant.implantType === ImplantType.cyberware)
      .reduce((sum, implant) => sum + getImplantEffectiveEssenceCost(implant), 0)

    const biowareEssence = rootImplants
      .filter((implant) => implant.implantType === ImplantType.bioware)
      .reduce((sum, implant) => sum + getImplantEffectiveEssenceCost(implant), 0)

    // Whichever of cyberware/bioware essence cost is smaller only counts at half.
    const used = cyberwareEssence >= biowareEssence
      ? cyberwareEssence + (biowareEssence / 2)
      : biowareEssence + (cyberwareEssence / 2)

    return {
      used,
      remaining: BASE_ESSENCE - used,
      cyberwareEssence,
      biowareEssence,
    }
  },
)
