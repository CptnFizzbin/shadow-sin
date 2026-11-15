import type { ItemData } from "#/system/model/items/itemData.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

/** The share of an Item's cost a sale returns unless the Player names another price. */
const defaultSaleRate = 0.5

/** Which Items a sale removes, and which Attachments it leaves behind as top-level Items. */
export interface ItemSalePlan {
  /** The sold Item and every Attachment sold with it. */
  soldIds: UUID[]
  /** Attachments of a sold Item that stay in the inventory, detached as top-level Items. */
  detachedIds: UUID[]
}

/**
 * Plans the sale of `itemId`. Fixed Attachments are always sold with their parent; other
 * Attachments are sold too when `sellAttachments` is set, and otherwise stay behind (with their
 * own Attachments) as top-level Items.
 */
export function planItemSale(catalog: ItemCatalog, itemId: UUID, sellAttachments: boolean): ItemSalePlan {
  const plan: ItemSalePlan = { soldIds: [], detachedIds: [] }

  const visit = (id: UUID) => {
    const item = catalog[id]
    if (!item) return

    plan.soldIds.push(id)

    for (const childId of item.items.childIds) {
      const child = catalog[childId]
      if (!child) continue

      if (sellAttachments || child.fixed) {
        visit(childId)
      } else {
        plan.detachedIds.push(childId)
      }
    }
  }

  visit(itemId)
  return plan
}

/** What an Item is worth in total: its per-unit cost times its quantity. */
function itemValue(item: ItemData): number {
  return (item.cost ?? 0) * (item.quantity ?? 1)
}

/**
 * The price a sale of `itemId` offers by default: half of what every Item it sells is worth,
 * rounded down to whole nuyen.
 */
export function getDefaultSalePrice(catalog: ItemCatalog, itemId: UUID, sellAttachments: boolean): number {
  const { soldIds } = planItemSale(catalog, itemId, sellAttachments)
  const total = soldIds.reduce((sum, id) => sum + itemValue(catalog[id]), 0)
  return Math.floor(total * defaultSaleRate)
}
