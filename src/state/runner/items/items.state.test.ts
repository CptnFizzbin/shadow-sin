import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { addItem, patchItem, removeItem, setItem, setState } from "./items.actions.ts"
import { gearReducer } from "./items.state.ts"

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
    // Arrange — the draft still carries an id, which add must replace rather than reuse
    const item = makeItem()
    const { id: draftId, ...itemWithoutId } = item

    // Act
    const next = gearReducer({}, addItem(item))

    // Assert
    const storedIds = Object.keys(next)
    expect(storedIds).toHaveLength(1)
    const [storedId] = storedIds
    expect(storedId).not.toBe(draftId)
    expect(storedId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    expect(next[storedId]).toEqual({ ...itemWithoutId, id: storedId })
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

  it("setState is a no-op when no item matches the id", () => {
    // Arrange
    const item = makeItem()

    // Act
    const next = gearReducer({ [item.id]: item }, setState({ id: crypto.randomUUID() as UUID, state: ItemState.stashed }))

    // Assert
    expect(next).toEqual({ [item.id]: item })
  })

  it("setState moves the item into the given state", () => {
    // Arrange
    const item = makeItem({ state: ItemState.available })

    // Act
    const next = gearReducer({ [item.id]: item }, setState({ id: item.id, state: ItemState.equipped }))

    // Assert
    expect(next[item.id].state).toBe(ItemState.equipped)
  })

  it("setState ignores a state the item's type doesn't allow", () => {
    // Arrange
    const sin = makeItem({ itemType: ItemType.sin, state: ItemState.available })

    // Act
    const next = gearReducer({ [sin.id]: sin }, setState({ id: sin.id, state: ItemState.equipped }))

    // Assert
    expect(next[sin.id].state).toBe(ItemState.available)
  })

  it("setItem falls back to the previous state when the saved one isn't allowed", () => {
    // Arrange
    const implant = makeItem({ itemType: ItemType.implant, state: ItemState.implanted })

    // Act
    const next = gearReducer({ [implant.id]: implant }, setItem({ ...implant, state: ItemState.equipped }))

    // Assert
    expect(next[implant.id].state).toBe(ItemState.implanted)
  })

  describe("state changes cascade to Attachments", () => {
    const makeTree = (parentOverrides: Partial<ItemData>, childOverrides: Partial<ItemData>) => {
      const parent = makeItem(parentOverrides)
      const child = makeItem({ ...childOverrides, items: { parentId: parent.id, childIds: [] } })
      parent.items = { parentId: null, childIds: [child.id] }
      return { parent, child, catalog: { [parent.id]: parent, [child.id]: child } }
    }

    it("stashing a parent stashes its Attachments", () => {
      // Arrange
      const { parent, child, catalog } = makeTree(
        { state: ItemState.equipped },
        { itemType: ItemType.firearmAccessory, state: ItemState.available },
      )

      // Act
      const next = gearReducer(catalog, setState({ id: parent.id, state: ItemState.stashed }))

      // Assert
      expect(next[child.id].state).toBe(ItemState.stashed)
    })

    it("unstashing a parent makes its stashed Attachments Available", () => {
      // Arrange
      const { parent, child, catalog } = makeTree(
        { state: ItemState.stashed },
        { itemType: ItemType.firearmAccessory, state: ItemState.stashed },
      )

      // Act
      const next = gearReducer(catalog, setState({ id: parent.id, state: ItemState.available }))

      // Assert
      expect(next[parent.id].state).toBe(ItemState.available)
      expect(next[child.id].state).toBe(ItemState.available)
    })

    it("implanting a parent implants its implant Attachments", () => {
      // Arrange
      const { parent, child, catalog } = makeTree(
        { itemType: ItemType.implant, state: ItemState.available },
        { itemType: ItemType.implant, state: ItemState.available },
      )

      // Act
      const next = gearReducer(catalog, setState({ id: parent.id, state: ItemState.implanted }))

      // Assert
      expect(next[child.id].state).toBe(ItemState.implanted)
    })

    it("equipping a parent leaves Attachments without an Equipped state Available", () => {
      // Arrange
      const { parent, child, catalog } = makeTree(
        { state: ItemState.available },
        { itemType: ItemType.firearmAccessory, state: ItemState.available },
      )

      // Act
      const next = gearReducer(catalog, setState({ id: parent.id, state: ItemState.equipped }))

      // Assert
      expect(next[child.id].state).toBe(ItemState.available)
    })

    it("equipping a parent leaves an independently stashed Attachment stashed", () => {
      // Arrange
      const { parent, child, catalog } = makeTree(
        { itemType: ItemType.armor, state: ItemState.available },
        { itemType: ItemType.other, state: ItemState.stashed },
      )

      // Act
      const next = gearReducer(catalog, setState({ id: parent.id, state: ItemState.equipped }))

      // Assert
      expect(next[child.id].state).toBe(ItemState.stashed)
    })

    it("unequipping a parent makes its equipped Attachments Available", () => {
      // Arrange
      const { parent, child, catalog } = makeTree(
        { itemType: ItemType.armor, state: ItemState.equipped },
        { itemType: ItemType.other, state: ItemState.equipped },
      )

      // Act
      const next = gearReducer(catalog, setState({ id: parent.id, state: ItemState.available }))

      // Assert
      expect(next[child.id].state).toBe(ItemState.available)
    })

    it("cascades through every level of Attachments", () => {
      // Arrange
      const { parent, child, catalog } = makeTree(
        { itemType: ItemType.implant, state: ItemState.implanted },
        { itemType: ItemType.implant, state: ItemState.implanted },
      )
      const grandchild = makeItem({
        itemType: ItemType.implant,
        state: ItemState.implanted,
        items: { parentId: child.id, childIds: [] },
      })
      child.items = { ...child.items, childIds: [grandchild.id] }

      // Act
      const next = gearReducer(
        { ...catalog, [grandchild.id]: grandchild },
        setState({ id: parent.id, state: ItemState.stashed }),
      )

      // Assert
      expect(next[grandchild.id].state).toBe(ItemState.stashed)
    })

    it("won't make an Attachment more active than its parent", () => {
      // Arrange
      const { child, catalog } = makeTree(
        { itemType: ItemType.armor, state: ItemState.available },
        { itemType: ItemType.other, state: ItemState.available },
      )

      // Act
      const next = gearReducer(catalog, setState({ id: child.id, state: ItemState.equipped }))

      // Assert
      expect(next[child.id].state).toBe(ItemState.available)
    })

    it("won't unstash an Attachment of a stashed parent", () => {
      // Arrange
      const { child, catalog } = makeTree(
        { state: ItemState.stashed },
        { itemType: ItemType.firearmAccessory, state: ItemState.stashed },
      )

      // Act
      const next = gearReducer(catalog, setState({ id: child.id, state: ItemState.available }))

      // Assert
      expect(next[child.id].state).toBe(ItemState.stashed)
    })

    it("lets an Attachment be stashed on its own while its parent stays active", () => {
      // Arrange
      const { parent, child, catalog } = makeTree(
        { state: ItemState.equipped },
        { itemType: ItemType.firearmAccessory, state: ItemState.available },
      )

      // Act
      const next = gearReducer(catalog, setState({ id: child.id, state: ItemState.stashed }))

      // Assert
      expect(next[parent.id].state).toBe(ItemState.equipped)
      expect(next[child.id].state).toBe(ItemState.stashed)
    })

    it("patchItem (a partial save) cascades a state change too", () => {
      // Arrange
      const { parent, child, catalog } = makeTree(
        { state: ItemState.available },
        { itemType: ItemType.firearmAccessory, state: ItemState.available },
      )

      // Act
      const next = gearReducer(catalog, patchItem({ itemId: parent.id, data: { state: ItemState.stashed } }))

      // Assert
      expect(next[child.id].state).toBe(ItemState.stashed)
    })

    it("adding an Attachment to a stashed parent stashes it", () => {
      // Arrange
      const parent = makeItem({ state: ItemState.stashed })
      const scope = makeItem({ itemType: ItemType.firearmAccessory, items: { parentId: parent.id, childIds: [] } })

      // Act
      const next = gearReducer({ [parent.id]: parent }, addItem(scope))

      // Assert
      const [storedId] = Object.keys(next).filter((id) => id !== parent.id)
      expect(next[storedId].state).toBe(ItemState.stashed)
    })
  })
})
