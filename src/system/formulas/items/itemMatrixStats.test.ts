import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { getItemMatrixStats } from "./itemMatrixStats.ts"

const makeItem = (overrides: Partial<ItemData> = {}): ItemData => ({
  kind: EntityKind.item,
  id: crypto.randomUUID() as UUID,
  name: "Item",
  itemType: ItemType.other,
  items: { parentId: null, childIds: [] },
  ...overrides,
})

describe.concurrent("getItemMatrixStats", () => {
  it.each([
    [ItemType.other, undefined, true],
    [ItemType.other, true, false],
    [ItemType.other, false, true],
    [ItemType.magical, undefined, false],
    [ItemType.magical, true, false],
    [ItemType.magical, false, true],
  ])("gives a top-level %s item with matrixDisabled=%s a Matrix node: %s", (itemType, matrixDisabled, hasNode) => {
    // Arrange
    const item = makeItem({ itemType, matrixDisabled })

    // Act
    const stats = getItemMatrixStats(item)

    // Assert
    expect(stats !== undefined).toBe(hasNode)
  })

  it("gives an Attachment no Matrix node of its own", () => {
    // Arrange
    const item = makeItem({ items: { parentId: crypto.randomUUID() as UUID, childIds: [] } })

    // Act
    const stats = getItemMatrixStats(item)

    // Assert
    expect(stats).toBeUndefined()
  })
})
