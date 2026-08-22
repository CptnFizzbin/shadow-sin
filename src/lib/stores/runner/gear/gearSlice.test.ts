import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { addItem, patchItem, removeItem, setEquipped, setItem, setStashed } from "./gearSlice.actions.ts"
import { gearReducer } from "./gearSlice.ts"

const makeItem = (overrides: Partial<ItemData> = {}): ItemData => ({
  kind: EntityKind.item,
  id: crypto.randomUUID() as UUID,
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  items: { parentId: null, childIds: [] },
  ...overrides,
})

describe.concurrent("gearReducer", () => {
  it("add stores the item under a freshly generated id", () => {
    // Arrange
    const item = makeItem()
    const { id: _discarded, ...itemWithoutId } = item

    // Act
    const next = gearReducer({}, addItem(itemWithoutId))

    // Assert
    const [stored] = Object.values(next)
    expect(stored).toMatchObject(itemWithoutId)
    expect(stored.id).toBeDefined()
  })

  it("set upserts the item by id", () => {
    // Arrange
    const original = makeItem({ name: "Ares Predator V" })
    const updated = { ...original, name: "Ares Predator V (customized)" }

    // Act
    const next = gearReducer({ [original.id]: original }, setItem(updated))

    // Assert
    expect(next[original.id]).toEqual(updated)
  })

  it("set on a real store's frozen output doesn't throw when the payload's items field is untouched", () => {
    // Arrange — Immer freezes every dispatch's resulting state (including nested objects like
    // `items`) in development; a save that never touches attachment fields (e.g. the item edit
    // form when the item isn't a sub-item) reuses that exact frozen `items` reference in its
    // payload. relinkItem must replace `items` wholesale rather than mutate it in place, or this
    // throws "Cannot assign to read only property" on dispatch.
    const added = gearReducer({}, addItem(makeItem({ name: "Engineering Shop" })))
    const [stored] = Object.values(added)
    const renamed = { ...stored, name: "Medkit" }

    // Act
    const next = gearReducer(added, setItem(renamed))

    // Assert
    expect(next[stored.id].name).toBe("Medkit")
  })

  it("set adds the item's id to its parent's childIds", () => {
    // Arrange
    const parent = makeItem({ name: "Smartgun" })
    const child = makeItem({ name: "Gas-Vent 3 System", items: { parentId: parent.id, childIds: [] } })

    // Act
    const next = gearReducer({ [parent.id]: parent }, setItem(child))

    // Assert
    expect(next[parent.id].items.childIds).toEqual([child.id])
  })

  it("set removes the item's id from a former parent's childIds when parentId changes", () => {
    // Arrange
    const oldParent = makeItem({ name: "Smartgun" })
    const newParent = makeItem({ name: "Backpack" })
    const child = makeItem({ name: "Gas-Vent 3 System", items: { parentId: oldParent.id, childIds: [] } })
    oldParent.items.childIds = [child.id]

    // Act
    const next = gearReducer(
      { [oldParent.id]: oldParent, [newParent.id]: newParent, [child.id]: child },
      setItem({ ...child, items: { ...child.items, parentId: newParent.id } }),
    )

    // Assert
    expect(next[oldParent.id].items.childIds).toEqual([])
    expect(next[newParent.id].items.childIds).toEqual([child.id])
  })

  it("set syncs children's parentId when the item explicitly declares childIds", () => {
    // Arrange
    const child = makeItem({ name: "Gas-Vent 3 System" })
    const parent = makeItem({ name: "Smartgun", items: { parentId: null, childIds: [child.id] } })

    // Act
    const next = gearReducer({ [child.id]: child, [parent.id]: parent }, setItem(parent))

    // Assert
    expect(next[child.id].items.parentId).toBe(parent.id)
  })

  it("set clears a child's parentId when dropped from the parent's declared childIds", () => {
    // Arrange
    const child = makeItem({ name: "Gas-Vent 3 System" })
    const parent = makeItem({ name: "Smartgun", items: { parentId: null, childIds: [child.id] } })
    child.items.parentId = parent.id

    // Act
    const next = gearReducer(
      { [child.id]: child, [parent.id]: parent },
      setItem({ ...parent, items: { ...parent.items, childIds: [] } }),
    )

    // Assert
    expect(next[child.id].items.parentId).toBeNull()
  })

  it("remove deletes the item", () => {
    // Arrange
    const item = makeItem()

    // Act
    const next = gearReducer({ [item.id]: item }, removeItem({ id: item.id }))

    // Assert
    expect(next[item.id]).toBeUndefined()
  })

  it("remove drops the item from its parent's childIds", () => {
    // Arrange
    const child = makeItem({ name: "Gas-Vent 3 System" })
    const parent = makeItem({ name: "Smartgun", items: { parentId: null, childIds: [child.id] } })
    child.items.parentId = parent.id

    // Act
    const next = gearReducer(
      { [child.id]: child, [parent.id]: parent },
      removeItem({ id: child.id }),
    )

    // Assert
    expect(next[parent.id].items.childIds).toEqual([])
  })

  it("remove without removeChildren orphans children instead of deleting them", () => {
    // Arrange
    const child = makeItem({ name: "Gas-Vent 3 System" })
    const parent = makeItem({ name: "Smartgun", items: { parentId: null, childIds: [child.id] } })
    child.items.parentId = parent.id

    // Act
    const next = gearReducer(
      { [child.id]: child, [parent.id]: parent },
      removeItem({ id: parent.id }),
    )

    // Assert
    expect(next[child.id]).toBeDefined()
    expect(next[parent.id]).toBeUndefined()
  })

  it("remove with removeChildren deletes the whole subtree", () => {
    // Arrange
    const grandchild = makeItem({ name: "Smartgun Interface" })
    const child = makeItem({ name: "Gas-Vent 3 System", items: { parentId: null, childIds: [grandchild.id] } })
    const parent = makeItem({ name: "Smartgun", items: { parentId: null, childIds: [child.id] } })
    grandchild.items.parentId = child.id
    child.items.parentId = parent.id

    // Act
    const next = gearReducer(
      { [grandchild.id]: grandchild, [child.id]: child, [parent.id]: parent },
      removeItem({ id: parent.id, removeChildren: true }),
    )

    // Assert
    expect(next).toEqual({})
  })

  it("remove is a no-op when no item matches the id", () => {
    // Arrange
    const item = makeItem()

    // Act
    const next = gearReducer({ [item.id]: item }, removeItem({ id: crypto.randomUUID() as UUID }))

    // Assert
    expect(next).toEqual({ [item.id]: item })
  })

  it("setEquipped sets the equipped field", () => {
    // Arrange
    const item = makeItem()

    // Act
    const next = gearReducer({ [item.id]: item }, setEquipped({ id: item.id, equipped: true }))

    // Assert
    expect(next[item.id].equipped).toBe(true)
  })

  it("setEquipped is a no-op when no item matches the id", () => {
    // Arrange
    const item = makeItem()

    // Act
    const next = gearReducer(
      { [item.id]: item },
      setEquipped({ id: crypto.randomUUID() as UUID, equipped: true }),
    )

    // Assert
    expect(next).toEqual({ [item.id]: item })
  })

  it("setStashed is a no-op when no item matches the id", () => {
    // Arrange
    const item = makeItem()

    // Act
    const next = gearReducer(
      { [item.id]: item },
      setStashed({ id: crypto.randomUUID() as UUID, stashed: true }),
    )

    // Assert
    expect(next).toEqual({ [item.id]: item })
  })

  describe("stashing forces equipped off and remembers it for restore", () => {
    it("setStashed(true) on an equipped item sets stashed, clears equipped, and records equipOnUnstash", () => {
      // Arrange
      const item = makeItem({ equipped: true })

      // Act
      const next = gearReducer({ [item.id]: item }, setStashed({ id: item.id, stashed: true }))

      // Assert
      expect(next[item.id].stashed).toBe(true)
      expect(next[item.id].equipped).toBe(false)
      expect(next[item.id]._state).toEqual({ equipOnUnstash: true })
    })

    it("setStashed(true) on a non-equipped item records equipOnUnstash as false", () => {
      // Arrange
      const item = makeItem({ equipped: false })

      // Act
      const next = gearReducer({ [item.id]: item }, setStashed({ id: item.id, stashed: true }))

      // Assert
      expect(next[item.id]._state).toEqual({ equipOnUnstash: false })
    })

    it("setStashed(false) restores equipped from equipOnUnstash", () => {
      // Arrange — already stashed, with a recorded pre-stash equipped value
      const item = makeItem({ stashed: true, equipped: false, _state: { equipOnUnstash: true } })

      // Act
      const next = gearReducer({ [item.id]: item }, setStashed({ id: item.id, stashed: false }))

      // Assert
      expect(next[item.id].stashed).toBe(false)
      expect(next[item.id].equipped).toBe(true)
      expect(next[item.id]._state).toEqual({ equipOnUnstash: undefined })
    })

    it("setStashed(false) restores equipped to false when it wasn't equipped before stashing", () => {
      // Arrange
      const item = makeItem({ stashed: true, equipped: false, _state: { equipOnUnstash: false } })

      // Act
      const next = gearReducer({ [item.id]: item }, setStashed({ id: item.id, stashed: false }))

      // Assert
      expect(next[item.id].equipped).toBe(false)
    })

    it("setStashed(true) is idempotent — re-stashing an already-stashed item doesn't re-capture equipOnUnstash", () => {
      // Arrange — already stashed with equipOnUnstash recorded; equipped is (unusually) true again
      const item = makeItem({ stashed: true, equipped: true, _state: { equipOnUnstash: false } })

      // Act
      const next = gearReducer({ [item.id]: item }, setStashed({ id: item.id, stashed: true }))

      // Assert — no re-capture: equipped and equipOnUnstash both untouched
      expect(next[item.id].equipped).toBe(true)
      expect(next[item.id]._state).toEqual({ equipOnUnstash: false })
    })

    it("setItem (the item edit form's save path) also enforces the invariant when stashed flips on", () => {
      // Arrange
      const item = makeItem({ equipped: true })

      // Act — form save sets stashed directly, without going through setStashed
      const next = gearReducer({ [item.id]: item }, setItem({ ...item, stashed: true }))

      // Assert
      expect(next[item.id].equipped).toBe(false)
      expect(next[item.id]._state).toEqual({ equipOnUnstash: true })
    })

    it("setItem also restores equipped when stashed flips off", () => {
      // Arrange
      const item = makeItem({ stashed: true, equipped: false, _state: { equipOnUnstash: true } })

      // Act
      const next = gearReducer({ [item.id]: item }, setItem({ ...item, stashed: false }))

      // Assert
      expect(next[item.id].equipped).toBe(true)
    })

    it("patchItem enforces the invariant when stashed flips on", () => {
      // Arrange
      const item = makeItem({ equipped: true })

      // Act
      const next = gearReducer(
        { [item.id]: item },
        patchItem({ itemId: item.id, data: { stashed: true } }),
      )

      // Assert
      expect(next[item.id].equipped).toBe(false)
      expect(next[item.id]._state).toEqual({ equipOnUnstash: true })
    })

    it("addItem doesn't treat a brand-new stashed item as a transition needing restore later", () => {
      // Arrange — a new item created already stashed and (inconsistently) marked equipped
      const item = makeItem({ stashed: true, equipped: true })
      const { id: _discarded, ...itemWithoutId } = item

      // Act
      const next = gearReducer({}, addItem(itemWithoutId))

      // Assert — still forces equipped off and records the pre-stash value, same as any other write
      const [stored] = Object.values(next)
      expect(stored.equipped).toBe(false)
      expect(stored._state).toEqual({ equipOnUnstash: true })
    })
  })
})
