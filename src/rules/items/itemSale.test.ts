import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { ItemCatalog } from "#/system/model/items/itemUtils.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { getDefaultSalePrice, planItemSale } from "./itemSale.ts"

const makeItem = (id: string, overrides: Partial<ItemData> = {}): ItemData => ({
  kind: EntityKind.item,
  id: id as UUID,
  name: id,
  itemType: ItemType.weapon,
  items: { parentId: null, childIds: [] },
  ...overrides,
})

/** A pistol with a fixed smartlink and a removable laser sight, which itself has a battery. */
const makeCatalog = (): ItemCatalog => ({
  ["pistol" as UUID]: makeItem("pistol", { cost: 500, items: { parentId: null, childIds: ["smartlink", "laser"] as UUID[] } }),
  ["smartlink" as UUID]: makeItem("smartlink", { cost: 200, fixed: true, items: { parentId: "pistol" as UUID, childIds: [] } }),
  ["laser" as UUID]: makeItem("laser", { cost: 100, items: { parentId: "pistol" as UUID, childIds: ["battery"] as UUID[] } }),
  ["battery" as UUID]: makeItem("battery", { cost: 10, quantity: 2, items: { parentId: "laser" as UUID, childIds: [] } }),
})

describe.concurrent("planItemSale", () => {
  it("sells the whole Attachment tree when selling attachments", () => {
    // Arrange
    const catalog = makeCatalog()

    // Act
    const plan = planItemSale(catalog, "pistol" as UUID, true)

    // Assert
    expect(plan).toEqual({ soldIds: ["pistol", "smartlink", "laser", "battery"], detachedIds: [] })
  })

  it("sells fixed Attachments and detaches the rest when not selling attachments", () => {
    // Arrange
    const catalog = makeCatalog()

    // Act
    const plan = planItemSale(catalog, "pistol" as UUID, false)

    // Assert
    expect(plan).toEqual({ soldIds: ["pistol", "smartlink"], detachedIds: ["laser"] })
  })
})

describe.concurrent("getDefaultSalePrice", () => {
  it("offers half of what everything sold is worth, counting quantity", () => {
    // Arrange
    const catalog = makeCatalog()

    // Act
    const price = getDefaultSalePrice(catalog, "pistol" as UUID, true)

    // Assert — (500 + 200 + 100 + 10 × 2) / 2
    expect(price).toBe(410)
  })

  it("leaves detached Attachments out of the price", () => {
    // Arrange
    const catalog = makeCatalog()

    // Act
    const price = getDefaultSalePrice(catalog, "pistol" as UUID, false)

    // Assert — (500 + 200) / 2
    expect(price).toBe(350)
  })
})
