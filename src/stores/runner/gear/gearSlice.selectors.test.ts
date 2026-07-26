import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { licenses, selectAllGear, selectById, selectGearOfType } from "./gearSlice.selectors.ts"

const makeItem = (overrides: Partial<ItemData> = {}): ItemData => ({
  id: crypto.randomUUID() as UUID,
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  ...overrides,
})

const withGear = (...items: ItemData[]) =>
  runnerDataFactory((data) => {
    data.gear = Object.fromEntries(items.map((item) => [item.id, item]))
    return data
  })

describe("selectAllGear", () => {
  it("returns the gear record", () => {
    // Arrange
    const item = makeItem()
    const runner = withGear(item)

    // Act / Assert
    expect(selectAllGear(runner)).toBe(runner.gear)
  })
})

describe("selectById", () => {
  it("finds an item by id", () => {
    // Arrange
    const item = makeItem()
    const runner = withGear(item)

    // Act / Assert
    expect(selectById(item.id)(runner)).toEqual(item)
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
    const armor = makeItem({ itemType: ItemType.armor })
    const runner = withGear(weapon, armor)

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
    const item = makeItem({ itemType: ItemType.weapon })
    const runner = withGear(item)

    // Act / Assert
    expect(licenses.selectById(item.id)(runner)).toBeUndefined()
  })
})

describe("licenses.selectForItem", () => {
  it("returns the licence an item points at", () => {
    // Arrange
    const license = makeItem({ itemType: ItemType.license, rating: 3 })
    const item = makeItem({ licenseId: license.id })
    const runner = withGear(license, item)

    // Act / Assert
    expect(licenses.selectForItem(item.id)(runner)).toEqual(license)
  })

  it("returns null when the item has no licenceId", () => {
    // Arrange
    const item = makeItem()
    const runner = withGear(item)

    // Act / Assert
    expect(licenses.selectForItem(item.id)(runner)).toBeNull()
  })

  it("returns undefined for a dangling licenceId whose licence no longer exists", () => {
    // Arrange
    const item = makeItem({ licenseId: crypto.randomUUID() as UUID })
    const runner = withGear(item)

    // Act / Assert
    expect(licenses.selectForItem(item.id)(runner)).toBeUndefined()
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
    const item = makeItem()
    const runner = withGear(item)

    // Act / Assert
    expect(licenses.selectItemsForId(crypto.randomUUID() as UUID)(runner)).toEqual([])
  })
})
