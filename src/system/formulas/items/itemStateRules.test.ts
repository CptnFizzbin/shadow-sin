import { describe, expect, it } from "vitest"

import { ItemState } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"

import {
  getActiveItemState,
  getAllowedItemStates,
  getItemState,
  getItemStateActions,
  getItemStateLabel,
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
    [ItemType.program, [ItemState.available, ItemState.stashed]],
    [ItemType.vehicle, [ItemState.available, ItemState.stashed]],
    [ItemType.firearmAccessory, [ItemState.available, ItemState.stashed]],
  ])("gives %s the states %j", (itemType, states) => {
    // Arrange / Act / Assert
    expect(getAllowedItemStates(itemType)).toEqual(states)
  })
})

describe.concurrent("getActiveItemState", () => {
  it("is Equipped for armor, Implanted for an implant, and absent for a vehicle", () => {
    // Arrange / Act / Assert
    expect(getActiveItemState(ItemType.armor)).toBe(ItemState.equipped)
    expect(getActiveItemState(ItemType.implant)).toBe(ItemState.implanted)
    expect(getActiveItemState(ItemType.vehicle)).toBeUndefined()
  })
})

describe.concurrent("isItemActive / isItemOnHand", () => {
  it.each([
    [ItemState.equipped, true, true],
    [ItemState.implanted, true, true],
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
