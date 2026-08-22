import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

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
  sins,
  software,
  vehicles,
  weapons,
} from "./gearSlice.actions.ts"
import { gearReducer } from "./gearSlice.ts"

const makeItem = (overrides: Partial<ItemData> = {}): ItemData => ({
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: crypto.randomUUID() as UUID,
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  ...overrides,
})

describe.concurrent("licenses.create", () => {
  it("adds the licence under a freshly generated id", () => {
    // Arrange
    const licenseDraft: Omit<LicenseData, "id"> = {
      kind: EntityKind.item, items: { parentId: null, childIds: [] },
      itemType: ItemType.license,
      name: "License: Ares Predator V",
      rating: 3,
    }

    // Act
    const next = gearReducer({}, licenses.create(licenseDraft))

    // Assert
    const [stored] = Object.values(next)
    expect(stored).toMatchObject(licenseDraft)
    expect(stored.id).toBeDefined()
  })
})

describe.concurrent("licenses.destroy", () => {
  it("removes the licence item", () => {
    // Arrange
    const license = makeItem({ itemType: ItemType.license, rating: 3 })

    // Act
    const next = gearReducer({ [license.id]: license }, licenses.destroy(license.id))

    // Assert
    expect(next[license.id]).toBeUndefined()
  })
})

describe.concurrent("licenses.setLicenseForItem", () => {
  it("patches only licenseId on the target item", () => {
    // Arrange
    const item = makeItem({ equipped: true })
    const licenseId = crypto.randomUUID() as UUID

    // Act
    const next = gearReducer(
      { [item.id]: item },
      licenses.setLicenseForItem({ itemId: item.id, licenseId }),
    )

    // Assert
    expect(next[item.id]).toEqual({ ...item, licenseId })
  })

  it("overwrites a previously set licenseId", () => {
    // Arrange
    const oldLicenseId = crypto.randomUUID() as UUID
    const newLicenseId = crypto.randomUUID() as UUID
    const item = makeItem({ licenseId: oldLicenseId })

    // Act
    const next = gearReducer(
      { [item.id]: item },
      licenses.setLicenseForItem({ itemId: item.id, licenseId: newLicenseId }),
    )

    // Assert
    expect(next[item.id].licenseId).toBe(newLicenseId)
  })

  it("is a no-op when the item doesn't exist", () => {
    // Arrange
    const licenseId = crypto.randomUUID() as UUID

    // Act
    const next = gearReducer(
      {},
      licenses.setLicenseForItem({ itemId: crypto.randomUUID() as UUID, licenseId }),
    )

    // Assert
    expect(next).toEqual({})
  })
})

describe.concurrent("licenses.clearLicenseForItem", () => {
  it("clears an existing licenseId", () => {
    // Arrange
    const licenseId = crypto.randomUUID() as UUID
    const item = makeItem({ licenseId })

    // Act
    const next = gearReducer({ [item.id]: item }, licenses.clearLicenseForItem({ itemId: item.id }))

    // Assert
    expect(next[item.id].licenseId).toBeNull()
  })

  it("doesn't touch other fields on the item", () => {
    // Arrange
    const licenseId = crypto.randomUUID() as UUID
    const item = makeItem({ licenseId, equipped: true })

    // Act
    const next = gearReducer({ [item.id]: item }, licenses.clearLicenseForItem({ itemId: item.id }))

    // Assert
    expect(next[item.id]).toEqual({ ...item, licenseId: null })
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
])("$name", ({ namespace, itemType }) => {
  describe("create", () => {
    it("adds the item under a freshly generated id", () => {
      // Arrange
      const draft = { itemType, name: "Test Item", items: { parentId: null, childIds: [] } }

      // Act
      const next = gearReducer({}, namespace.create(draft as never))

      // Assert
      const [stored] = Object.values(next)
      expect(stored).toMatchObject(draft)
      expect(stored.id).toBeDefined()
    })
  })

  describe("destroy", () => {
    it("removes the item", () => {
      // Arrange
      const item = makeItem({ itemType })

      // Act
      const next = gearReducer({ [item.id]: item }, namespace.destroy(item.id))

      // Assert
      expect(next[item.id]).toBeUndefined()
    })
  })
})
