import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { licenses } from "./gearSlice.actions.ts"
import { gearReducer } from "./gearSlice.ts"

const makeItem = (overrides: Partial<ItemData> = {}): ItemData => ({
  id: crypto.randomUUID() as UUID,
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  ...overrides,
})

describe("licenses.create", () => {
  it("adds the licence under a freshly generated id", () => {
    // Arrange
    const licenseDraft: Omit<LicenseData, "id"> = {
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

describe("licenses.destroy", () => {
  it("removes the licence item", () => {
    // Arrange
    const license = makeItem({ itemType: ItemType.license, rating: 3 })

    // Act
    const next = gearReducer({ [license.id]: license }, licenses.destroy(license.id))

    // Assert
    expect(next[license.id]).toBeUndefined()
  })
})

describe("licenses.setLicenseForItem", () => {
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

describe("licenses.clearLicenseForItem", () => {
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
