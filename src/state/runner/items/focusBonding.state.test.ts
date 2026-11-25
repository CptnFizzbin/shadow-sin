import { describe, expect, it } from "vitest"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { EntityKind } from "#/data/entities/entityKind.ts"
import type { ItemData } from "#/data/items/itemData.ts"
import { ItemState } from "#/data/items/itemState.ts"
import { ItemType } from "#/data/items/itemType.ts"
import type { FocusData } from "#/data/items/magicalData.ts"
import { MagicalType } from "#/data/items/magicalData.ts"
import { FocusType } from "#/data/magic/focusData.ts"
import { karmaReducer } from "#/state/runner/karma/karma.state.ts"

import { bondFocus, setItem, setState, unbondFocus } from "./items.actions.ts"
import { gearReducer } from "./items.state.ts"

const makeFocus = (overrides: Partial<FocusData> = {}): FocusData => ({
  kind: EntityKind.item,
  id: crypto.randomUUID() as UUID,
  name: "Sword Focus",
  itemType: ItemType.magical,
  magicalType: MagicalType.focus,
  focusType: FocusType.Weapon,
  force: 2,
  items: { parentId: null, childIds: [] },
  ...overrides,
})

const makeKarma = (current: number) => ({ current, total: current, log: [] })

describe.concurrent("bondFocus", () => {
  it("marks the Focus Bonded", () => {
    // Arrange
    const focus = makeFocus()

    // Act
    const next = gearReducer({ [focus.id]: focus }, bondFocus(focus))

    // Assert
    expect((next[focus.id] as FocusData).bonded).toBe(true)
  })

  it("spends Force × the type's multiplier in Karma and records it on the ledger", () => {
    // Arrange
    const focus = makeFocus({ focusType: FocusType.Weapon, force: 2 })

    // Act
    const next = karmaReducer(makeKarma(10), bondFocus(focus))

    // Assert
    expect(next.current).toBe(4)
    expect(next.total).toBe(10)
    expect(next.log).toHaveLength(1)
    expect(next.log[0]).toMatchObject({ amount: -6, source: "bondFocus" })
  })

  it("throws when the Runner has too little Karma", () => {
    // Arrange
    const focus = makeFocus({ focusType: FocusType.Power, force: 2 })

    // Act / Assert
    expect(() => karmaReducer(makeKarma(15), bondFocus(focus))).toThrow(/Insufficient karma/)
  })

  it("does nothing to an Item that isn't a Focus", () => {
    // Arrange
    const weapon: ItemData = { ...makeFocus(), itemType: ItemType.weapon }

    // Act
    const next = gearReducer({ [weapon.id]: weapon }, bondFocus(makeFocus({ id: weapon.id })))

    // Assert
    expect(next[weapon.id]).toEqual(weapon)
  })
})

describe.concurrent("unbondFocus", () => {
  it("breaks the bond and unequips an Equipped Focus", () => {
    // Arrange
    const focus = makeFocus({ bonded: true, state: ItemState.equipped })

    // Act
    const next = gearReducer({ [focus.id]: focus }, unbondFocus({ id: focus.id }))

    // Assert
    expect(next[focus.id]).toMatchObject({ bonded: false, state: ItemState.available })
  })

  it("leaves a Stashed Focus Stashed", () => {
    // Arrange
    const focus = makeFocus({ bonded: true, state: ItemState.stashed })

    // Act
    const next = gearReducer({ [focus.id]: focus }, unbondFocus({ id: focus.id }))

    // Assert
    expect(next[focus.id]).toMatchObject({ bonded: false, state: ItemState.stashed })
  })
})

describe.concurrent("an unbonded Focus", () => {
  it("can't be Equipped", () => {
    // Arrange
    const focus = makeFocus({ state: ItemState.available })

    // Act
    const next = gearReducer({ [focus.id]: focus }, setState({ id: focus.id, state: ItemState.equipped }))

    // Assert
    expect(next[focus.id].state).toBe(ItemState.available)
  })

  it("can't be saved as Equipped", () => {
    // Arrange
    const focus = makeFocus({ state: ItemState.equipped })

    // Act
    const next = gearReducer({}, setItem(focus))

    // Assert
    expect(next[focus.id].state).toBe(ItemState.available)
  })

  it("isn't Equipped along with the weapon it's attached to, while a Bonded one is", () => {
    // Arrange
    const weaponId = crypto.randomUUID() as UUID
    const unbonded = makeFocus({ state: ItemState.available, items: { parentId: weaponId, childIds: [] } })
    const bonded = makeFocus({ bonded: true, state: ItemState.available, items: { parentId: weaponId, childIds: [] } })
    const weapon: ItemData = {
      kind: EntityKind.item,
      id: weaponId,
      name: "Katana",
      itemType: ItemType.weapon,
      state: ItemState.available,
      items: { parentId: null, childIds: [unbonded.id, bonded.id] },
    }
    const catalog = { [weapon.id]: weapon, [unbonded.id]: unbonded, [bonded.id]: bonded }

    // Act
    const next = gearReducer(catalog, setState({ id: weapon.id, state: ItemState.equipped }))

    // Assert
    expect(next[unbonded.id].state).toBe(ItemState.available)
    expect(next[bonded.id].state).toBe(ItemState.equipped)
  })
})
