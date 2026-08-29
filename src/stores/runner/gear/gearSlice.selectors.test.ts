import { describe, expect, it } from "vitest"

import type { UUID } from "#/lib/uuidUtils.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import type { ItemCatalog } from "#/system/items/itemUtils.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"

import { ItemSelectors } from "./gearSlice.selectors.ts"

const item: ItemData = {
  kind: EntityKind.item,
  id: NullUuid,
  name: "Test Item",
  itemType: ItemType.other,
  items: { parentId: null, childIds: [] },
}

const makeItem = (overrides: Partial<ItemData> = {}): ItemData => ({
  kind: EntityKind.item,
  id: crypto.randomUUID() as UUID,
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  items: { parentId: null, childIds: [] },
  ...overrides,
})

const stateFor = (items: ItemCatalog) => ({ items })

const withGear = (...items: ItemData[]): ItemCatalog =>
  getItemCatalog(runnerDataFactory({
    items: Object.fromEntries(items.map((gearItem) => [gearItem.id, gearItem])),
  }))

describe.concurrent("ItemSelectors.selectEquipped", () => {
  it("returns only items with equipped === true", () => {
    const catalog = withGear({ ...item, equipped: true })

    expect(ItemSelectors.selectEquipped(stateFor(catalog))).toEqual([{ ...item, equipped: true }])
  })

  it("excludes items with equipped false or absent", () => {
    const catalog = withGear(item)

    expect(ItemSelectors.selectEquipped(stateFor(catalog))).toEqual([])
  })
})

describe.concurrent("ItemSelectors.selectStashed", () => {
  it("returns only stashed items", () => {
    const catalog = withGear({ ...item, stashed: true })

    expect(ItemSelectors.selectStashed(stateFor(catalog))).toEqual([{ ...item, stashed: true }])
  })

  it("excludes items with stashed false or absent", () => {
    const catalog = withGear(item)

    expect(ItemSelectors.selectStashed(stateFor(catalog))).toEqual([])
  })
})

describe.concurrent("ItemSelectors.selectAvailable", () => {
  it("returns items that are not stashed", () => {
    const catalog = withGear(item)

    expect(ItemSelectors.selectAvailable(stateFor(catalog))).toEqual([item])
  })

  it("excludes stashed items", () => {
    const catalog = withGear({ ...item, stashed: true })

    expect(ItemSelectors.selectAvailable(stateFor(catalog))).toEqual([])
  })
})

describe.concurrent("ItemSelectors.selectAll", () => {
  it("returns the item catalog", () => {
    // Arrange
    const gearItem = makeItem()
    const catalog = withGear(gearItem)

    // Act / Assert
    expect(ItemSelectors.selectAll(stateFor(catalog))).toBe(catalog)
  })
})

describe.concurrent("ItemSelectors.selectById", () => {
  it("finds an item by id", () => {
    // Arrange
    const gearItem = makeItem()
    const catalog = withGear(gearItem)

    // Act / Assert
    expect(ItemSelectors.selectById(stateFor(catalog), { itemId: gearItem.id })).toEqual(gearItem)
  })

  it("returns undefined for an unknown id", () => {
    // Arrange
    const catalog = withGear()

    // Act / Assert
    expect(ItemSelectors.selectById(stateFor(catalog), { itemId: crypto.randomUUID() as UUID })).toBeUndefined()
  })
})

describe.concurrent("ItemSelectors.selectByType", () => {
  it("filters gear down to the given item type", () => {
    // Arrange
    const weapon = makeItem({ itemType: ItemType.weapon })
    const armorItem = makeItem({ itemType: ItemType.armor })
    const catalog = withGear(weapon, armorItem)

    // Act / Assert
    expect(ItemSelectors.selectByType(stateFor(catalog), { itemType: ItemType.weapon })).toEqual({ [weapon.id]: weapon })
  })

  it("returns an empty record when nothing matches", () => {
    // Arrange
    const weapon = makeItem({ itemType: ItemType.weapon })
    const catalog = withGear(weapon)

    // Act / Assert
    expect(ItemSelectors.selectByType(stateFor(catalog), { itemType: ItemType.armor })).toEqual({})
  })
})

describe.concurrent("ItemSelectors.Licenses.selectById", () => {
  it("finds a licence by id", () => {
    // Arrange
    const license = makeItem({ itemType: ItemType.license, rating: 3 })
    const catalog = withGear(license)

    // Act / Assert
    expect(ItemSelectors.Licenses.selectById(stateFor(catalog), { itemId: license.id })).toEqual(license)
  })

  it("does not return a non-licence item even with a matching id", () => {
    // Arrange
    const gearItem = makeItem({ itemType: ItemType.weapon })
    const catalog = withGear(gearItem)

    // Act / Assert
    expect(ItemSelectors.Licenses.selectById(stateFor(catalog), { itemId: gearItem.id })).toBeUndefined()
  })
})

describe.concurrent("ItemSelectors.Licenses.selectForItem", () => {
  it("returns the licence an item points at", () => {
    // Arrange
    const license = makeItem({ itemType: ItemType.license, rating: 3 })
    const gearItem = makeItem({ licenseId: license.id })
    const catalog = withGear(license, gearItem)

    // Act / Assert
    expect(ItemSelectors.Licenses.selectForItem(stateFor(catalog), { itemId: gearItem.id })).toEqual(license)
  })

  it("returns null when the item has no licenceId", () => {
    // Arrange
    const gearItem = makeItem()
    const catalog = withGear(gearItem)

    // Act / Assert
    expect(ItemSelectors.Licenses.selectForItem(stateFor(catalog), { itemId: gearItem.id })).toBeNull()
  })

  it("returns null for a dangling licenceId whose licence no longer exists", () => {
    // Arrange
    const gearItem = makeItem({ licenseId: crypto.randomUUID() as UUID })
    const catalog = withGear(gearItem)

    // Act / Assert
    expect(ItemSelectors.Licenses.selectForItem(stateFor(catalog), { itemId: gearItem.id })).toBeNull()
  })

  it("returns null for an item id that isn't in gear at all", () => {
    // Arrange
    const catalog = withGear()

    // Act / Assert
    expect(ItemSelectors.Licenses.selectForItem(stateFor(catalog), { itemId: crypto.randomUUID() as UUID })).toBeNull()
  })
})

describe.concurrent("ItemSelectors.Licenses.selectItemsForId", () => {
  it("returns every item covered by a licence", () => {
    // Arrange
    const licenseId = crypto.randomUUID() as UUID
    const covered1 = makeItem({ licenseId })
    const covered2 = makeItem({ licenseId })
    const uncovered = makeItem()
    const catalog = withGear(covered1, covered2, uncovered)

    // Act
    const items = ItemSelectors.Licenses.selectItemsForId(stateFor(catalog), { licenseId })

    // Assert
    expect(items).toHaveLength(2)
    expect(items).toEqual(expect.arrayContaining([covered1, covered2]))
  })

  it("returns an empty array when nothing points at the licence", () => {
    // Arrange
    const gearItem = makeItem()
    const catalog = withGear(gearItem)

    // Act / Assert
    expect(ItemSelectors.Licenses.selectItemsForId(stateFor(catalog), { licenseId: crypto.randomUUID() as UUID }))
      .toEqual([])
  })
})

describe.each([
  { name: "Armor", namespace: ItemSelectors.Armor, itemType: ItemType.armor },
  { name: "Implants", namespace: ItemSelectors.Implants, itemType: ItemType.implant },
  { name: "Software", namespace: ItemSelectors.Software, itemType: ItemType.software },
  { name: "Vehicles", namespace: ItemSelectors.Vehicles, itemType: ItemType.vehicle },
  { name: "Weapons", namespace: ItemSelectors.Weapons, itemType: ItemType.weapon },
  { name: "Devices", namespace: ItemSelectors.Devices, itemType: ItemType.device },
  { name: "FirearmAccessories", namespace: ItemSelectors.FirearmAccessories, itemType: ItemType.firearmAccessory },
  { name: "Sins", namespace: ItemSelectors.Sins, itemType: ItemType.sin },
  { name: "Credsticks", namespace: ItemSelectors.Credsticks, itemType: ItemType.credstick },
  { name: "Programs", namespace: ItemSelectors.Programs, itemType: ItemType.program },
  { name: "Other", namespace: ItemSelectors.Other, itemType: ItemType.other },
])("ItemSelectors.$name.selectById", ({ namespace, itemType }) => {
  it("finds an item of the matching type by id", () => {
    // Arrange
    const typedItem = makeItem({ itemType })
    const catalog = withGear(typedItem)

    // Act / Assert
    expect(namespace.selectById(stateFor(catalog), { itemId: typedItem.id })).toEqual(typedItem)
  })

  it("does not return an item of a different type even with a matching id", () => {
    // Arrange
    const otherType = itemType === ItemType.weapon ? ItemType.armor : ItemType.weapon
    const gearItem = makeItem({ itemType: otherType })
    const catalog = withGear(gearItem)

    // Act / Assert
    expect(namespace.selectById(stateFor(catalog), { itemId: gearItem.id })).toBeUndefined()
  })
})
