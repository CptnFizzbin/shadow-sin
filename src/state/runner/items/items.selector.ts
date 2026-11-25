import type { UUID } from "#/common/uuid/uuidUtils.ts"
import type { ArmorRating } from "#/data/items/armorData.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { ItemCatalog, ItemDataFor } from "#/data/items/itemUtils.ts"
import { filterRecordByType, itemIsType } from "#/data/items/itemUtils.ts"
import type { FocusData } from "#/data/items/magicalData.ts"
import { isFocusData } from "#/data/items/magicalData.ts"
import type { DiceGroup } from "#/rules/dicePool/diceGroup.tsx"
import { calculateArmorBulk } from "#/rules/items/encumbranceUtils.ts"
import { toItemCatalogTree } from "#/rules/items/itemCatalogTree.ts"
import type { ItemMatrixStats } from "#/rules/items/itemMatrixStats.ts"
import { getItemMatrixStats } from "#/rules/items/itemMatrixStats.ts"
import { isItemActive, isItemEquipped, isItemImplanted, isItemOnHand, isItemStashed } from "#/rules/items/itemStateRules.ts"
import type { Selector as StandardSelector } from "#/state/reselect/selectorUtils.ts"
import { createMemoizedSelector, createSelector } from "#/state/reselect/selectorUtils.ts"
import { SelectorOptions } from "#/state/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/state/runner/viewerSelector.ts"

export namespace ItemSelectors {
  export type ItemSelector<TReturn, TOptions extends object | never = never> = StandardSelector<
    { items: ItemCatalog },
    TReturn,
    TOptions
  >

  export const selectAll = createSelector(
    ViewerStateSelectors.selectItems,
  )

  export const selectCatalog = createSelector(
    ViewerStateSelectors.selectItems,
  )

  export const selectCatalogTree = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    (items) => toItemCatalogTree(items),
  )

  export const selectByFilter = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    SelectorOptions.filter.item,
    (items, filter) => {
      return Object.values(items).filter(filter)
    },
  )

  /** Every Item On Hand: Available, Equipped, or Implanted — anything but Stashed. */
  export const selectOnHand = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    (items) => Object.values(items).filter(isItemOnHand),
  )

  /** Every active Item: Equipped or Implanted. */
  export const selectActive = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    (items) => Object.values(items).filter(isItemActive),
  )

  export const selectStashed = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    (items) => Object.values(items).filter(isItemStashed),
  )

  export const selectById = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    SelectorOptions.itemId,
    (items, itemId) => items[itemId],
  )

  export const selectByType = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    SelectorOptions.itemType,
    (items, itemType) => filterRecordByType(items, itemType),
  )

  export const selectChildrenOf = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    SelectorOptions.itemId,
    (items, itemId) => {
      const parent = items[itemId]
      const children: ItemCatalog = {}

      for (const childId of parent?.items.childIds ?? []) {
        const child = items[childId]
        if (child) children[childId] = child
      }

      return children
    },
  )

  /** {@link selectChildrenOf} as an array, in `childIds` order. */
  export const selectChildListOf = createMemoizedSelector(
    selectChildrenOf,
    (children) => Object.values(children),
  )

  /**
   * The item at `itemId`, narrowed to `type` — `undefined` if no such item exists or it isn't of
   * that type. Shared by every per-type sub-namespace below.
   */
  function itemOfType<T extends ItemType>(items: ItemCatalog, itemId: UUID, type: T): ItemDataFor<T> | undefined {
    const item = items[itemId]
    return item !== undefined && itemIsType(item, type) ? item : undefined
  }

  export namespace Armor {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.armor),
    )

    export const selectAll = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      (items) => Object.values(filterRecordByType(items, ItemType.armor)),
    ) satisfies ItemSelector<ItemDataFor<ItemType.armor>[]>

    export const selectEquipped = createMemoizedSelector(
      selectAll,
      (armor) => armor.filter(isItemEquipped),
    ) satisfies ItemSelector<ItemDataFor<ItemType.armor>[]>

    export const selectTotal = createMemoizedSelector(
      selectEquipped,
      (equipped): ArmorRating => ({
        ballistic: equipped.reduce((sum, item) => sum + item.ballistic, 0),
        impact: equipped.reduce((sum, item) => sum + item.impact, 0),
      }),
    ) satisfies ItemSelector<ArmorRating>

    /** The summed printed ratings of all equipped armor, which drives Encumbrance. */
    export const selectBulk = createMemoizedSelector(
      selectEquipped,
      calculateArmorBulk,
    ) satisfies ItemSelector<ArmorRating>

    export const selectEffective = createMemoizedSelector(
      selectEquipped,
      (equipped): ArmorRating => ({
        ballistic: Math.max(0, ...equipped.map((item) => item.ballistic)),
        impact: Math.max(0, ...equipped.map((item) => item.impact)),
      }),
    ) satisfies ItemSelector<ArmorRating>
    /** The Dice Groups worn armor contributes to a dice pool. See `createDicePoolSelector`. */
    export namespace DiceGroups {
      /** The best equipped armor's `armor` rating. */
      export const selectArmor = createMemoizedSelector(
        selectEffective,
        SelectorOptions.armor,
        (ratings, armor): DiceGroup[] => [{ name: `Armor (${armor})`, size: ratings[armor] ?? 0 }],
      )
    }
  }

  export namespace Implants {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.implant),
    )

    /** Every implant currently Implanted in the Runner's body. */
    export const selectImplanted = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      (items) => Object.values(filterRecordByType(items, ItemType.implant)).filter(isItemImplanted),
    )
  }

  export namespace Foci {
    /** Every Focus the Runner owns, whatever its state. */
    export const selectAll = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      (items) => Object.values(filterRecordByType(items, ItemType.magical)).filter(isFocusData),
    ) satisfies ItemSelector<FocusData[]>
  }

  export namespace Software {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.software),
    )
  }

  export namespace Vehicles {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.vehicle),
    )
  }

  export namespace Weapons {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.weapon),
    )
  }

  export namespace Devices {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.device),
    )
  }

  /** An Item's Matrix presence. Every caller reads it from here, whatever stores the node. */
  export namespace Matrix {
    /**
     * The Matrix node of the Item at `itemId`: its own stats where set, the default otherwise.
     * `undefined` when the Item doesn't exist, opted out, or shares its parent's node.
     */
    export const selectStats = createMemoizedSelector(
      ItemSelectors.selectById,
      (item) => (item ? getItemMatrixStats(item) : undefined),
    ) satisfies ItemSelector<ItemMatrixStats | undefined, { itemId: UUID }>
  }

  export namespace FirearmAccessories {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.firearmAccessory),
    )
  }

  export namespace Sins {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.sin),
    )
  }

  export namespace Credsticks {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.credstick),
    )
  }

  export namespace Programs {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.program),
    )
  }

  export namespace Other {
    // Note: `ItemDataFor<ItemType.other>` resolves to `never` — `AnyItemData` has no dedicated
    // subtype for "other" items (they're plain `ItemData`), even though real items do carry
    // `itemType: ItemType.other`. `ItemData` is the accurate type here, not a narrower one, so this
    // doesn't use the `itemOfType` helper (which is typed for the `ItemDataFor<T>` case).
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => {
        const item = items[itemId]
        return item?.itemType === ItemType.other ? item : undefined
      },
    )
  }

  export namespace Licenses {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.license),
    )

    export const selectForItem = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => {
        const item = items[itemId]
        if (!item?.licenseId) return null
        return itemOfType(items, item.licenseId, ItemType.license) ?? null
      },
    )

    export const selectItemsForId = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.licenseId,
      (items, licenseId) => Object.values(items).filter((item) => item.licenseId === licenseId),
    )
  }
}
