import { describe, expect, it } from "vitest"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { EntityKind } from "#/data/entities/entityKind.ts"
import type { ItemData } from "#/data/items/itemData.ts"
import { ItemState } from "#/data/items/itemState.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { FocusData } from "#/data/items/magicalData.ts"
import { MagicalType } from "#/data/items/magicalData.ts"
import { FocusType } from "#/data/magic/focusData.ts"

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

  it("offers Consume first for an Available Consumable, and only End Effect once it's Active", () => {
    // Arrange
    const availableDrug = makeItem({ itemType: ItemType.consumable, state: ItemState.available, quantity: 2 })
    const activeDrug = makeItem({ itemType: ItemType.consumable, state: ItemState.active, quantity: 1 })

    // Act
    const availableActions = getItemActions(availableDrug, { isAttachment: false, isViewer: true })
    const activeActions = getItemActions(activeDrug, { isAttachment: false, isViewer: true })

    // Assert
    expect(availableActions[0]).toBe(ItemAction.consume)
    expect(availableActions).not.toContain(ItemAction.endEffect)
    expect(activeActions[0]).toBe(ItemAction.endEffect)
    expect(activeActions).not.toContain(ItemAction.consume)
    expect(activeActions).not.toContain(ItemAction.stash)
  })

  it("offers Bond first for an unbonded Focus, and Equip and Unbond once it's Bonded", () => {
    // Arrange
    const unbonded: FocusData = {
      ...makeItem({ state: ItemState.available }),
      itemType: ItemType.magical,
      magicalType: MagicalType.focus,
      focusType: FocusType.Power,
      force: 1,
    }
    const bonded: FocusData = { ...unbonded, bonded: true }

    // Act
    const unbondedActions = getItemActions(unbonded, { isAttachment: false, isViewer: true })
    const bondedActions = getItemActions(bonded, { isAttachment: false, isViewer: true })

    // Assert
    expect(unbondedActions[0]).toBe(ItemAction.bond)
    expect(unbondedActions).not.toContain(ItemAction.equip)
    expect(unbondedActions).not.toContain(ItemAction.unbond)
    expect(bondedActions[0]).toBe(ItemAction.equip)
    expect(bondedActions).toContain(ItemAction.unbond)
    expect(bondedActions).not.toContain(ItemAction.bond)
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
    expect(getItemActionTargetState(ItemAction.consume)).toBe(ItemState.active)
    expect(getItemActionTargetState(ItemAction.endEffect)).toBe(ItemState.available)
    expect(getItemActionTargetState(ItemAction.sell)).toBeUndefined()
  })
})
