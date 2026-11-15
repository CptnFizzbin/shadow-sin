import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { getItemActions, getItemActionTargetState, getItemStateDisplayLabel, ItemAction } from "./itemActions.ts"

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

  it("offers Run but no Equip for a Program", () => {
    // Arrange
    const item = makeItem({ itemType: ItemType.program })

    // Act
    const actions = getItemActions(item, { isAttachment: false, isViewer: true })

    // Assert
    expect(actions).toContain(ItemAction.run)
    expect(actions).not.toContain(ItemAction.equip)
    expect(actions).not.toContain(ItemAction.attack)
  })

  it("offers Unequip for an equipped Item and Extract for an implanted one", () => {
    // Arrange
    const weapon = makeItem({ state: ItemState.equipped })
    const implant = makeItem({ itemType: ItemType.implant, state: ItemState.implanted })

    // Act
    const weaponActions = getItemActions(weapon, { isAttachment: false, isViewer: true })
    const implantActions = getItemActions(implant, { isAttachment: false, isViewer: true })

    // Assert
    expect(weaponActions).toContain(ItemAction.unequip)
    expect(implantActions).toContain(ItemAction.extract)
  })

  it("offers only Unstash, Edit, Sell and Delete for a stashed Item", () => {
    // Arrange
    const item = makeItem({ state: ItemState.stashed })

    // Act
    const actions = getItemActions(item, { isAttachment: false, isViewer: true })

    // Assert
    expect(actions).toEqual([ItemAction.unstash, ItemAction.edit, ItemAction.sell, ItemAction.delete])
  })

  it("never offers an Attachment a state more active than its parent's", () => {
    // Arrange
    const item = makeItem({ name: "Laser Sight", itemType: ItemType.other })

    // Act
    const actions = getItemActions(item, { isAttachment: true, parentState: ItemState.available, isViewer: true })

    // Assert
    expect(actions).not.toContain(ItemAction.equip)
    expect(actions).toContain(ItemAction.stash)
  })

  it("offers an Attachment of a stashed parent no Unstash", () => {
    // Arrange
    const item = makeItem({ name: "Laser Sight", state: ItemState.stashed })

    // Act
    const actions = getItemActions(item, { isAttachment: true, parentState: ItemState.stashed, isViewer: true })

    // Assert
    expect(actions).not.toContain(ItemAction.unstash)
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

describe.concurrent("getItemStateDisplayLabel", () => {
  it.each([
    [{ state: ItemState.stashed }, "Stashed"],
    [{ state: ItemState.equipped }, "Equipped"],
    [{}, "Available"],
    [{ itemType: ItemType.program }, "Loaded"],
  ])("labels %o as %s", (overrides, label) => {
    // Arrange
    const item = makeItem(overrides)

    // Act
    const result = getItemStateDisplayLabel(item)

    // Assert
    expect(result).toBe(label)
  })
})

describe.concurrent("getItemActionTargetState", () => {
  it("maps state actions to their target state and other actions to none", () => {
    // Arrange / Act / Assert
    expect(getItemActionTargetState(ItemAction.implant)).toBe(ItemState.implanted)
    expect(getItemActionTargetState(ItemAction.unstash)).toBe(ItemState.available)
    expect(getItemActionTargetState(ItemAction.sell)).toBeUndefined()
  })
})
