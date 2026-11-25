import { describe, expect, it } from "vitest"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { EntityKind } from "#/data/entities/entityKind.ts"
import type { ItemData } from "#/data/items/itemData.ts"
import { ItemState } from "#/data/items/itemState.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { ItemCatalog } from "#/data/items/itemUtils.ts"

import {
  canApplyBulkStateAction,
  canRemoveItemOnItsOwn,
  getItemDescendantIds,
  orderParentsFirst,
} from "./itemBulkActions.ts"
import { ItemStateAction } from "./itemStateRules.ts"

const makeItem = (id: string, overrides: Partial<ItemData> = {}): ItemData => ({
  kind: EntityKind.item,
  id: id as UUID,
  name: id,
  itemType: ItemType.weapon,
  items: { parentId: null, childIds: [] },
  ...overrides,
})

/** A rifle carrying a scope, which in turn carries a laser sight. */
const makeRifleCatalog = (rifleState?: ItemState): ItemCatalog => ({
  rifle: makeItem("rifle", { state: rifleState, items: { parentId: null, childIds: ["scope" as UUID] } }),
  scope: makeItem("scope", {
    itemType: ItemType.firearmAccessory,
    state: rifleState === ItemState.stashed ? ItemState.stashed : undefined,
    items: { parentId: "rifle" as UUID, childIds: ["laser" as UUID] },
  }),
  laser: makeItem("laser", { itemType: ItemType.firearmAccessory, items: { parentId: "scope" as UUID, childIds: [] } }),
})

describe.concurrent("getItemDescendantIds", () => {
  it("lists every Attachment at any depth", () => {
    // Arrange
    const catalog = makeRifleCatalog()

    // Act
    const descendantIds = getItemDescendantIds(catalog, "rifle" as UUID)

    // Assert
    expect(descendantIds).toEqual(["scope", "laser"])
  })
})

describe.concurrent("orderParentsFirst", () => {
  it("lists each Item after its parent and drops unknown ids", () => {
    // Arrange
    const catalog = makeRifleCatalog()

    // Act
    const ordered = orderParentsFirst(catalog, ["laser", "missing", "rifle", "scope"] as UUID[])

    // Assert
    expect(ordered.map((item) => item.id)).toEqual(["rifle", "scope", "laser"])
  })
})

describe.concurrent("canApplyBulkStateAction", () => {
  it("allows Equip on an Item whose type can be Equipped", () => {
    // Arrange
    const catalog = makeRifleCatalog()

    // Act
    const canEquip = canApplyBulkStateAction(catalog, "rifle" as UUID, ItemStateAction.equip)

    // Assert
    expect(canEquip).toBe(true)
  })

  it("skips Equip on an Item whose type can't be Equipped", () => {
    // Arrange
    const catalog = makeRifleCatalog()

    // Act
    const canEquip = canApplyBulkStateAction(catalog, "scope" as UUID, ItemStateAction.equip)

    // Assert
    expect(canEquip).toBe(false)
  })

  it("skips Unstash on an Attachment whose parent is still Stashed", () => {
    // Arrange
    const catalog = makeRifleCatalog(ItemState.stashed)

    // Act
    const canUnstash = canApplyBulkStateAction(catalog, "scope" as UUID, ItemStateAction.unstash)

    // Assert
    expect(canUnstash).toBe(false)
  })
})

describe.concurrent("canRemoveItemOnItsOwn", () => {
  it("refuses a fixed Attachment", () => {
    // Arrange
    const catalog = makeRifleCatalog()
    catalog.scope = { ...catalog.scope, fixed: true }

    // Act / Assert
    expect(canRemoveItemOnItsOwn(catalog, "scope" as UUID)).toBe(false)
    expect(canRemoveItemOnItsOwn(catalog, "rifle" as UUID)).toBe(true)
  })
})
