import { describe, expect, it } from "vitest"

import { DamageTrackKey } from "#/system/model/entities/damageTrackKey.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { LicenseData } from "#/system/model/items/licenseData.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { makeAgent } from "#testUtils/fixtures/makeAgent.ts"

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
  setDamage,
  sins,
  software,
  vehicles,
  weapons,
} from "./items.actions.ts"
import { gearReducer } from "./items.state.ts"

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

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
      isReal: false,
      name: "License: Ares Predator V",
      rating: 3,
    }
    const staleId = crypto.randomUUID() as UUID
    // A draft that still carries an id (e.g. copied from an existing licence) must not reuse it
    const draftWithStaleId = { ...licenseDraft, id: staleId }

    // Act
    const next = gearReducer({}, licenses.create(draftWithStaleId))

    // Assert
    const [[storedKey, stored]] = Object.entries(next)
    expect(Object.keys(next)).toHaveLength(1)
    expect(stored).toMatchObject(licenseDraft)
    expect(stored.id).toMatch(UUID_PATTERN)
    expect(stored.id).not.toBe(staleId)
    expect(storedKey).toBe(stored.id)
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
    const item = makeItem({ state: ItemState.equipped })
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
    const item = makeItem({ licenseId, state: ItemState.equipped })

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
      const staleId = crypto.randomUUID() as UUID
      const draftWithStaleId = { ...draft, id: staleId }

      // Act
      const next = gearReducer({}, namespace.create(draftWithStaleId as never))

      // Assert
      const [[storedKey, stored]] = Object.entries(next)
      expect(Object.keys(next)).toHaveLength(1)
      expect(stored).toMatchObject(draft)
      expect(stored.id).toMatch(UUID_PATTERN)
      expect(stored.id).not.toBe(staleId)
      expect(storedKey).toBe(stored.id)
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

describe("setDamage", () => {
  it("sets the named track on an item that implements EntityWithDamage", () => {
    // Arrange
    const agent = makeAgent()

    // Act
    const next = gearReducer(
      { [agent.id]: agent },
      setDamage({ itemId: agent.id, track: DamageTrackKey.matrix, value: 3 }),
    )

    // Assert
    expect((next[agent.id] as AgentData).damage.matrix).toBe(3)
  })

  it("clamps a negative value to 0", () => {
    // Arrange
    const agent = makeAgent({ damage: { matrix: 2 } })

    // Act
    const next = gearReducer(
      { [agent.id]: agent },
      setDamage({ itemId: agent.id, track: DamageTrackKey.matrix, value: -1 }),
    )

    // Assert
    expect((next[agent.id] as AgentData).damage.matrix).toBe(0)
  })

  it("is a no-op when the item doesn't exist", () => {
    // Arrange / Act
    const next = gearReducer(
      {},
      setDamage({ itemId: crypto.randomUUID() as UUID, track: DamageTrackKey.matrix, value: 3 }),
    )

    // Assert
    expect(next).toEqual({})
  })

  it("is a no-op when the item doesn't implement EntityWithDamage", () => {
    // Arrange
    const weapon = makeItem({ itemType: ItemType.weapon })

    // Act
    const next = gearReducer(
      { [weapon.id]: weapon },
      setDamage({ itemId: weapon.id, track: DamageTrackKey.matrix, value: 3 }),
    )

    // Assert
    expect(next[weapon.id]).toEqual(weapon)
  })
})
