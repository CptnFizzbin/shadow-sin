import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { addItem, patchItem, removeItem, setEquipped, setItem, setStashed } from "./gearSlice.actions.ts"
import { gearReducer } from "./gearSlice.ts"

const makeItem = (overrides: Partial<ItemData> = {}): ItemData => ({
  id: crypto.randomUUID() as UUID,
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  ...overrides,
})

describe("gearReducer", () => {
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

  it("set adds the item's id to its parent's childIds", () => {
    // Arrange
    const parent = makeItem({ name: "Smartgun" })
    const child = makeItem({ name: "Gas-Vent 3 System", parentId: parent.id })

    // Act
    const next = gearReducer({ [parent.id]: parent }, setItem(child))

    // Assert
    expect(next[parent.id].childIds).toEqual([child.id])
  })

  it("set removes the item's id from a former parent's childIds when parentId changes", () => {
    // Arrange
    const oldParent = makeItem({ name: "Smartgun", childIds: [] })
    const newParent = makeItem({ name: "Backpack" })
    const child = makeItem({ name: "Gas-Vent 3 System", parentId: oldParent.id })
    oldParent.childIds = [child.id]

    // Act
    const next = gearReducer(
      { [oldParent.id]: oldParent, [newParent.id]: newParent, [child.id]: child },
      setItem({ ...child, parentId: newParent.id }),
    )

    // Assert
    expect(next[oldParent.id].childIds).toEqual([])
    expect(next[newParent.id].childIds).toEqual([child.id])
  })

  it("set syncs children's parentId when the item explicitly declares childIds", () => {
    // Arrange
    const child = makeItem({ name: "Gas-Vent 3 System" })
    const parent = makeItem({ name: "Smartgun", childIds: [child.id] })

    // Act
    const next = gearReducer({ [child.id]: child, [parent.id]: parent }, setItem(parent))

    // Assert
    expect(next[child.id].parentId).toBe(parent.id)
  })

  it("set clears a child's parentId when dropped from the parent's declared childIds", () => {
    // Arrange
    const child = makeItem({ name: "Gas-Vent 3 System" })
    const parent = makeItem({ name: "Smartgun", childIds: [child.id] })
    child.parentId = parent.id

    // Act
    const next = gearReducer(
      { [child.id]: child, [parent.id]: parent },
      setItem({ ...parent, childIds: [] }),
    )

    // Assert
    expect(next[child.id].parentId).toBeUndefined()
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
    const parent = makeItem({ name: "Smartgun", childIds: [child.id] })
    child.parentId = parent.id

    // Act
    const next = gearReducer(
      { [child.id]: child, [parent.id]: parent },
      removeItem({ id: child.id }),
    )

    // Assert
    expect(next[parent.id].childIds).toEqual([])
  })

  it("remove without removeChildren orphans children instead of deleting them", () => {
    // Arrange
    const child = makeItem({ name: "Gas-Vent 3 System" })
    const parent = makeItem({ name: "Smartgun", childIds: [child.id] })
    child.parentId = parent.id

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
    const child = makeItem({ name: "Gas-Vent 3 System", childIds: [grandchild.id] })
    const parent = makeItem({ name: "Smartgun", childIds: [child.id] })
    grandchild.parentId = child.id
    child.parentId = parent.id

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

  it("setEquipped sets both equipped and its _state mirror", () => {
    // Arrange
    const item = makeItem()

    // Act
    const next = gearReducer({ [item.id]: item }, setEquipped({ id: item.id, equipped: true }))

    // Assert
    expect(next[item.id].equipped).toBe(true)
    expect(next[item.id]._state).toEqual({ equipped: true })
  })

  it("setEquipped preserves the item's existing _state.stashed value", () => {
    // Arrange
    const item = makeItem({ _state: { stashed: true } })

    // Act
    const next = gearReducer({ [item.id]: item }, setEquipped({ id: item.id, equipped: true }))

    // Assert
    expect(next[item.id]._state).toEqual({ stashed: true, equipped: true })
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

  it("setStashed sets both stashed and its _state mirror", () => {
    // Arrange
    const item = makeItem()

    // Act
    const next = gearReducer({ [item.id]: item }, setStashed({ id: item.id, stashed: true }))

    // Assert
    expect(next[item.id].stashed).toBe(true)
    expect(next[item.id]._state).toEqual({ stashed: true })
  })

  it("setStashed preserves the item's existing _state.equipped value", () => {
    // Arrange
    const item = makeItem({ _state: { equipped: true } })

    // Act
    const next = gearReducer({ [item.id]: item }, setStashed({ id: item.id, stashed: true }))

    // Assert
    expect(next[item.id]._state).toEqual({ equipped: true, stashed: true })
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

  describe("equipped/stashed <-> _state sync", () => {
    it("set mirrors a top-level equipped value onto _state", () => {
      // Arrange
      const item = makeItem({ equipped: true })

      // Act
      const next = gearReducer({}, setItem(item))

      // Assert
      expect(next[item.id]._state?.equipped).toBe(true)
    })

    it("set mirrors a top-level stashed value onto _state", () => {
      // Arrange
      const item = makeItem({ stashed: true })

      // Act
      const next = gearReducer({}, setItem(item))

      // Assert
      expect(next[item.id]._state?.stashed).toBe(true)
    })

    it("set mirrors an _state-only equipped value onto the top-level field", () => {
      // Arrange — simulates a write that only set _state, not the top-level field
      const item = makeItem({ _state: { equipped: true } })

      // Act
      const next = gearReducer({}, setItem(item))

      // Assert
      expect(next[item.id].equipped).toBe(true)
    })

    it("add mirrors a top-level equipped value onto _state", () => {
      // Arrange
      const item = makeItem({ equipped: true })
      const { id: _discarded, ...itemWithoutId } = item

      // Act
      const next = gearReducer({}, addItem(itemWithoutId))

      // Assert
      const [stored] = Object.values(next)
      expect(stored._state?.equipped).toBe(true)
    })

    it("patch mirrors a patched top-level equipped value onto _state", () => {
      // Arrange
      const item = makeItem()

      // Act
      const next = gearReducer(
        { [item.id]: item },
        patchItem({ itemId: item.id, data: { equipped: true } }),
      )

      // Assert
      expect(next[item.id]._state?.equipped).toBe(true)
    })
  })
})
