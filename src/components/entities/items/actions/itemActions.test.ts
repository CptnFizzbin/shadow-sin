import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { getCarryStatusLabel, getItemActions, ItemAction } from "./itemActions.ts"

const makeItem = (overrides: Partial<ItemData> = {}): ItemData => ({
  kind: EntityKind.item,
  id: crypto.randomUUID() as UUID,
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  items: { parentId: null, childIds: [] },
  ...overrides,
})

describe.concurrent("getItemActions", () => {
  it("offers every action for a carried weapon while playing", () => {
    // Arrange
    const item = makeItem()

    // Act
    const actions = getItemActions(item, { isAttachment: false, isViewer: true })

    // Assert
    expect(actions).toEqual([
      ItemAction.equip,
      ItemAction.stash,
      ItemAction.attack,
      ItemAction.edit,
      ItemAction.sell,
      ItemAction.delete,
    ])
  })

  it("offers Run for a Program and Unequip for an equipped Item", () => {
    // Arrange
    const item = makeItem({ itemType: ItemType.program, equipped: true })

    // Act
    const actions = getItemActions(item, { isAttachment: false, isViewer: true })

    // Assert
    expect(actions).toContain(ItemAction.run)
    expect(actions).toContain(ItemAction.unequip)
    expect(actions).not.toContain(ItemAction.attack)
  })

  it("offers only Unstash, Edit, Sell and Delete for a stashed Item", () => {
    // Arrange
    const item = makeItem({ stashed: true })

    // Act
    const actions = getItemActions(item, { isAttachment: false, isViewer: true })

    // Assert
    expect(actions).toEqual([ItemAction.unstash, ItemAction.edit, ItemAction.sell, ItemAction.delete])
  })

  it("leaves Equip and Stash to an Attachment's parent", () => {
    // Arrange
    const item = makeItem({ name: "Laser Sight" })

    // Act
    const actions = getItemActions(item, { isAttachment: true, isViewer: true })

    // Assert
    expect(actions).not.toContain(ItemAction.equip)
    expect(actions).not.toContain(ItemAction.stash)
  })

  it("never sells or deletes a fixed Attachment on its own", () => {
    // Arrange
    const item = makeItem({ name: "Integral Smartlink", fixed: true })

    // Act
    const actions = getItemActions(item, { isAttachment: true, isViewer: true })

    // Assert
    expect(actions).not.toContain(ItemAction.sell)
    expect(actions).not.toContain(ItemAction.delete)
  })

  it("offers no play-time actions while building", () => {
    // Arrange
    const item = makeItem()

    // Act
    const actions = getItemActions(item, { isAttachment: false, isViewer: false })

    // Assert
    expect(actions).not.toContain(ItemAction.attack)
    expect(actions).not.toContain(ItemAction.sell)
  })
})

describe.concurrent("getCarryStatusLabel", () => {
  it.each([
    [{ stashed: true }, "Stashed"],
    [{ equipped: true }, "Equipped"],
    [{}, "Carried"],
  ])("labels %o as %s", (overrides, label) => {
    // Arrange
    const item = makeItem(overrides)

    // Act
    const result = getCarryStatusLabel(item)

    // Assert
    expect(result).toBe(label)
  })
})
