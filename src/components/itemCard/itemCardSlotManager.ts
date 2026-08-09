import { EntityCardSlotManager } from "#/components/entityCard/entityCardSlotManager.ts"

import { ItemCardElements } from "./itemCardElements.tsx"

/**
 * `EntityCardSlotManager` plus getters for `ItemCard`'s own incremental elements (availability,
 * cost, quantity, ...) — `layout` and the `EntityData`-level getters (`title`, `rating`, ...) come
 * from the base class unchanged, the same way `ItemCardElements` pulls `EntityCardElements` in by
 * name rather than duplicating them.
 */
export class ItemCardSlotManager extends EntityCardSlotManager {
  get availability() {
    return this.find(ItemCardElements.Availability)
  }

  get cost() {
    return this.find(ItemCardElements.Cost)
  }

  get quantity() {
    return this.find(ItemCardElements.Quantity)
  }

  get damageTrack() {
    return this.find(ItemCardElements.DamageTrack)
  }

  get subitems() {
    return this.filter(ItemCardElements.Subitem)
  }

  get subType() {
    return this.find(ItemCardElements.SubType)
  }

  get statusIcons() {
    return this.filter(ItemCardElements.StatusIcon)
  }
}
