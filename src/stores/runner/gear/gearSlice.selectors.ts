import type { Selector as StandardSelector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector, createSelector } from "#/integrations/reselect/selectorUtils.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import { SelectorOptions } from "#/stores/runner/selectorOptions.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import type { ArmorRating } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { ItemCatalog, ItemDataFor } from "#/system/items/itemUtils.ts"
import { filterRecordByType, itemIsType, toItemCatalogTree } from "#/system/items/itemUtils.ts"

export namespace ItemSelectors {
  export type ItemSelector<TReturn, TOptions extends object | never = never> = StandardSelector<
    { items: ItemCatalog }, TReturn, TOptions
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

  export const selectAvailable = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    (items) => Object.values(items).filter((item) => !item.stashed),
  )

  export const selectEquipped = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    (items) => Object.values(items).filter((item) => item.equipped),
  )

  export const selectStashed = createMemoizedSelector(
    ViewerStateSelectors.selectItems,
    (items) => Object.values(items).filter((item) => item.stashed),
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
      (armor) => armor.filter((item) => item.equipped),
    ) satisfies ItemSelector<ItemDataFor<ItemType.armor>[]>

    export const selectTotal = createMemoizedSelector(
      selectEquipped,
      (equipped): ArmorRating => ({
        ballistic: equipped.reduce((sum, item) => sum + item.ballistic, 0),
        impact: equipped.reduce((sum, item) => sum + item.impact, 0),
      }),
    ) satisfies ItemSelector<ArmorRating>

    export const selectEffective = createMemoizedSelector(
      selectEquipped,
      (equipped): ArmorRating => ({
        ballistic: Math.max(0, ...equipped.map((item) => item.ballistic)),
        impact: Math.max(0, ...equipped.map((item) => item.impact)),
      }),
    ) satisfies ItemSelector<ArmorRating>
  }

  export namespace Implants {
    export const selectById = createMemoizedSelector(
      ViewerStateSelectors.selectItems,
      SelectorOptions.itemId,
      (items, itemId) => itemOfType(items, itemId, ItemType.implant),
    )
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
