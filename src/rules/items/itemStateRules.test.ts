import { describe, expect, it } from "vitest"

import { ItemState } from "#/data/items/itemState.ts"
import { ItemType } from "#/data/items/itemType.ts"

import {
  getActiveItemState,
  getAllowedItemStates,
  getItemState,
  getItemStateActions,
  getItemStateLabel,
  hasUnitsToConsume,
  isItemActive,
  isItemOnHand,
  isItemStateWithinParent,
  ItemStateAction,
} from "./itemStateRules.ts"

describe.concurrent("getItemState", () => {
  it("treats an Item with no stored state as Available", () => {
    // Arrange / Act / Assert
    expect(getItemState({})).toBe(ItemState.available)
  })
})

describe.concurrent("getAllowedItemStates", () => {
  it.each([
    [ItemType.weapon, [ItemState.equipped, ItemState.available, ItemState.stashed]],
    [ItemType.other, [ItemState.equipped, ItemState.available, ItemState.stashed]],
    [ItemType.implant, [ItemState.implanted, ItemState.available, ItemState.stashed]],
    [ItemType.consumable, [ItemState.active, ItemState.available, ItemState.stashed]],
    [ItemType.program, [ItemState.available, ItemState.stashed]],
    [ItemType.vehicle, [ItemState.available, ItemState.stashed]],
    [ItemType.firearmAccessory, [ItemState.available, ItemState.stashed]],
  ])("gives %s the states %j", (itemType, states) => {
    // Arrange / Act / Assert
    expect(getAllowedItemStates(itemType)).toEqual(states)
  })
})

describe.concurrent("getActiveItemState", () => {
  it("is Equipped for armor, Implanted for an implant, Active for a Consumable, and absent for a vehicle", () => {
    // Arrange / Act / Assert
    expect(getActiveItemState(ItemType.armor)).toBe(ItemState.equipped)
    expect(getActiveItemState(ItemType.implant)).toBe(ItemState.implanted)
    expect(getActiveItemState(ItemType.consumable)).toBe(ItemState.active)
    expect(getActiveItemState(ItemType.vehicle)).toBeUndefined()
  })
})

describe.concurrent("isItemActive / isItemOnHand", () => {
  it.each([
    [ItemState.equipped, true, true],
    [ItemState.implanted, true, true],
    [ItemState.active, true, true],
    [ItemState.available, false, true],
    [ItemState.stashed, false, false],
  ])("treats %s as active=%s, on hand=%s", (state, active, onHand) => {
    // Arrange / Act / Assert
    expect(isItemActive({ state })).toBe(active)
    expect(isItemOnHand({ state })).toBe(onHand)
  })
})

describe.concurrent("getItemStateLabel", () => {
  it("calls a Program's or Software's Available state Loaded", () => {
    // Arrange / Act / Assert
    expect(getItemStateLabel(ItemType.program, ItemState.available)).toBe("Loaded")
    expect(getItemStateLabel(ItemType.software, ItemState.available)).toBe("Loaded")
    expect(getItemStateLabel(ItemType.vehicle, ItemState.available)).toBe("Available")
  })

  it("calls a Consumable's active state Active", () => {
    // Arrange / Act / Assert
    expect(getItemStateLabel(ItemType.consumable, ItemState.active)).toBe("Active")
  })
})

describe.concurrent("hasUnitsToConsume", () => {
  it.each([
    [undefined, true],
    [3, true],
    [1, true],
    [0, false],
  ])("treats quantity %s as having units to consume: %s", (quantity, expected) => {
    // Arrange / Act / Assert
    expect(hasUnitsToConsume({ quantity })).toBe(expected)
  })
})

describe.concurrent("getItemStateActions", () => {
  it("offers Equip and Stash for an Available weapon", () => {
    // Arrange / Act / Assert
    expect(getItemStateActions({ itemType: ItemType.weapon, state: ItemState.available }))
      .toEqual([ItemStateAction.equip, ItemStateAction.stash])
  })

  it("offers Implant and Stash for an Available implant", () => {
    // Arrange / Act / Assert
    expect(getItemStateActions({ itemType: ItemType.implant, state: ItemState.available }))
      .toEqual([ItemStateAction.implant, ItemStateAction.stash])
  })

  it("offers only Stash for an Available vehicle", () => {
    // Arrange / Act / Assert
    expect(getItemStateActions({ itemType: ItemType.vehicle })).toEqual([ItemStateAction.stash])
  })

  it("offers Unequip and Stash for an Equipped item, Extract and Stash for an Implanted one", () => {
    // Arrange / Act / Assert
    expect(getItemStateActions({ itemType: ItemType.armor, state: ItemState.equipped }))
      .toEqual([ItemStateAction.unequip, ItemStateAction.stash])
    expect(getItemStateActions({ itemType: ItemType.implant, state: ItemState.implanted }))
      .toEqual([ItemStateAction.extract, ItemStateAction.stash])
  })

  it("offers Consume and Stash for an Available Consumable with units left", () => {
    // Arrange / Act / Assert
    expect(getItemStateActions({ itemType: ItemType.consumable, state: ItemState.available, quantity: 2 }))
      .toEqual([ItemStateAction.consume, ItemStateAction.stash])
  })

  it("offers only Stash for an Available Consumable with no units left", () => {
    // Arrange / Act / Assert
    expect(getItemStateActions({ itemType: ItemType.consumable, state: ItemState.available, quantity: 0 }))
      .toEqual([ItemStateAction.stash])
  })

  it("offers only End Effect for an Active Consumable", () => {
    // Arrange / Act / Assert
    expect(getItemStateActions({ itemType: ItemType.consumable, state: ItemState.active, quantity: 0 }))
      .toEqual([ItemStateAction.endEffect])
  })

  it.each([
    [false, [ItemStateAction.stash]],
    [true, [ItemStateAction.equip, ItemStateAction.stash]],
  ])("offers Equip to an Available Focus only once it's Bonded (bonded=%s)", (bonded, expected) => {
    // Arrange / Act / Assert
    expect(getItemStateActions({ itemType: ItemType.magical, state: ItemState.available, bonded }))
      .toEqual(expected)
  })

  it("offers only Unstash for a Stashed item", () => {
    // Arrange / Act / Assert
    expect(getItemStateActions({ itemType: ItemType.weapon, state: ItemState.stashed }))
      .toEqual([ItemStateAction.unstash])
  })
})

describe.concurrent("isItemStateWithinParent", () => {
  it("never lets an Attachment be more present than its parent", () => {
    // Arrange / Act / Assert
    expect(isItemStateWithinParent(ItemState.equipped, ItemState.available)).toBe(false)
    expect(isItemStateWithinParent(ItemState.available, ItemState.stashed)).toBe(false)
    expect(isItemStateWithinParent(ItemState.stashed, ItemState.equipped)).toBe(true)
    expect(isItemStateWithinParent(ItemState.equipped, ItemState.implanted)).toBe(true)
  })

  it("leaves a top-level Item unconstrained", () => {
    // Arrange / Act / Assert
    expect(isItemStateWithinParent(ItemState.equipped, undefined)).toBe(true)
  })
})
