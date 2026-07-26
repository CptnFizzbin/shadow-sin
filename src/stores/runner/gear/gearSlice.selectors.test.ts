import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import {
  armor,
  credsticks,
  devices,
  firearmAccessories,
  firearms,
  implants,
  licenses,
  other,
  programs,
  selectAllGear,
  selectAvailable,
  selectById,
  selectEquipped,
  selectGear,
  selectGearOfType,
  selectStashed,
  sins,
  software,
  vehicles,
  weapons,
} from "./gearSlice.selectors.ts"

const item = { id: NullUuid, name: "Test Item", itemType: ItemType.other }

const makeItem = (overrides: Partial<ItemData> = {}): ItemData => ({
  id: crypto.randomUUID() as UUID,
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  ...overrides,
})

const withGear = (...items: ItemData[]) =>
  runnerDataFactory((data) => {
    data.gear = Object.fromEntries(items.map((gearItem) => [gearItem.id, gearItem]))
    return data
  })

describe("selectGear", () => {
  it("returns the gear record", () => {
    const sheet = runnerDataFactory((s) => {
      s.gear = { [item.id]: item }
      return s
    })

    expect(selectGear(sheet)).toBe(sheet.gear)
  })
})

describe("selectEquipped", () => {
  it("returns only items with equipped === true", () => {
    const sheet = runnerDataFactory((s) => {
      s.gear = {
        [item.id]: { ...item, equipped: true },
      }
      return s
    })

    expect(selectEquipped(sheet)).toEqual([{ ...item, equipped: true }])
  })

  it("excludes items with equipped false or absent", () => {
    const sheet = runnerDataFactory((s) => {
      s.gear = { [item.id]: item }
      return s
    })

    expect(selectEquipped(sheet)).toEqual([])
  })
})

describe("selectStashed", () => {
  it("always returns an empty array (stubbed pending #388)", () => {
    const sheet = runnerDataFactory((s) => {
      s.gear = { [item.id]: item }
      return s
    })

    expect(selectStashed(sheet)).toEqual([])
  })
})

describe("selectAvailable", () => {
  it("always returns every gear item (stubbed pending #388)", () => {
    const sheet = runnerDataFactory((s) => {
      s.gear = { [item.id]: item }
      return s
    })

    expect(selectAvailable(sheet)).toEqual([item])
  })
})

describe("selectAllGear", () => {
  it("returns the gear record", () => {
    // Arrange
    const gearItem = makeItem()
    const runner = withGear(gearItem)

    // Act / Assert
    expect(selectAllGear(runner)).toBe(runner.gear)
  })
})

describe("selectById", () => {
  it("finds an item by id", () => {
    // Arrange
    const gearItem = makeItem()
    const runner = withGear(gearItem)

    // Act / Assert
    expect(selectById(gearItem.id)(runner)).toEqual(gearItem)
  })

  it("returns undefined for an unknown id", () => {
    // Arrange
    const runner = withGear()

    // Act / Assert
    expect(selectById(crypto.randomUUID() as UUID)(runner)).toBeUndefined()
  })
})

describe("selectGearOfType", () => {
  it("filters gear down to the given item type", () => {
    // Arrange
    const weapon = makeItem({ itemType: ItemType.weapon })
    const armorItem = makeItem({ itemType: ItemType.armor })
    const runner = withGear(weapon, armorItem)

    // Act / Assert
    expect(selectGearOfType(ItemType.weapon)(runner)).toEqual({ [weapon.id]: weapon })
  })

  it("returns an empty record when nothing matches", () => {
    // Arrange
    const weapon = makeItem({ itemType: ItemType.weapon })
    const runner = withGear(weapon)

    // Act / Assert
    expect(selectGearOfType(ItemType.armor)(runner)).toEqual({})
  })
})

describe("licenses.selectById", () => {
  it("finds a licence by id", () => {
    // Arrange
    const license = makeItem({ itemType: ItemType.license, rating: 3 })
    const runner = withGear(license)

    // Act / Assert
    expect(licenses.selectById(license.id)(runner)).toEqual(license)
  })

  it("does not return a non-licence item even with a matching id", () => {
    // Arrange
    const gearItem = makeItem({ itemType: ItemType.weapon })
    const runner = withGear(gearItem)

    // Act / Assert
    expect(licenses.selectById(gearItem.id)(runner)).toBeUndefined()
  })
})

describe("licenses.selectForItem", () => {
  it("returns the licence an item points at", () => {
    // Arrange
    const license = makeItem({ itemType: ItemType.license, rating: 3 })
    const gearItem = makeItem({ licenseId: license.id })
    const runner = withGear(license, gearItem)

    // Act / Assert
    expect(licenses.selectForItem(gearItem.id)(runner)).toEqual(license)
  })

  it("returns null when the item has no licenceId", () => {
    // Arrange
    const gearItem = makeItem()
    const runner = withGear(gearItem)

    // Act / Assert
    expect(licenses.selectForItem(gearItem.id)(runner)).toBeNull()
  })

  it("returns undefined for a dangling licenceId whose licence no longer exists", () => {
    // Arrange
    const gearItem = makeItem({ licenseId: crypto.randomUUID() as UUID })
    const runner = withGear(gearItem)

    // Act / Assert
    expect(licenses.selectForItem(gearItem.id)(runner)).toBeUndefined()
  })
})

describe("licenses.selectItemsForId", () => {
  it("returns every item covered by a licence", () => {
    // Arrange
    const licenseId = crypto.randomUUID() as UUID
    const covered1 = makeItem({ licenseId })
    const covered2 = makeItem({ licenseId })
    const uncovered = makeItem()
    const runner = withGear(covered1, covered2, uncovered)

    // Act
    const items = licenses.selectItemsForId(licenseId)(runner)

    // Assert
    expect(items).toHaveLength(2)
    expect(items).toEqual(expect.arrayContaining([covered1, covered2]))
  })

  it("returns an empty array when nothing points at the licence", () => {
    // Arrange
    const gearItem = makeItem()
    const runner = withGear(gearItem)

    // Act / Assert
    expect(licenses.selectItemsForId(crypto.randomUUID() as UUID)(runner)).toEqual([])
  })
})

describe.each([
  { name: "armor", namespace: armor, itemType: ItemType.armor },
  { name: "implants", namespace: implants, itemType: ItemType.implant },
  { name: "firearms", namespace: firearms, itemType: ItemType.firearm },
  { name: "software", namespace: software, itemType: ItemType.software },
  { name: "vehicles", namespace: vehicles, itemType: ItemType.vehicle },
  { name: "weapons", namespace: weapons, itemType: ItemType.weapon },
  { name: "devices", namespace: devices, itemType: ItemType.device },
  { name: "firearmAccessories", namespace: firearmAccessories, itemType: ItemType.firearmAccessory },
  { name: "sins", namespace: sins, itemType: ItemType.sin },
  { name: "credsticks", namespace: credsticks, itemType: ItemType.credstick },
  { name: "programs", namespace: programs, itemType: ItemType.program },
  { name: "other", namespace: other, itemType: ItemType.other },
])("$name.selectById", ({ namespace, itemType }) => {
  it("finds an item of the matching type by id", () => {
    // Arrange
    const typedItem = makeItem({ itemType })
    const runner = withGear(typedItem)

    // Act / Assert
    expect(namespace.selectById(typedItem.id)(runner)).toEqual(typedItem)
  })

  it("does not return an item of a different type even with a matching id", () => {
    // Arrange
    const otherType = itemType === ItemType.weapon ? ItemType.armor : ItemType.weapon
    const gearItem = makeItem({ itemType: otherType })
    const runner = withGear(gearItem)

    // Act / Assert
    expect(namespace.selectById(gearItem.id)(runner)).toBeUndefined()
  })
})
