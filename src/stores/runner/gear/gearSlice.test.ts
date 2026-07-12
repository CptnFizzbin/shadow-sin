import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { addItem, removeItem, setItem } from "./gearSlice.actions.ts"
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
})
