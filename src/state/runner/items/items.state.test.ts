import { describe, expect, it } from "vitest"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { EntityKind } from "#/data/entities/entityKind.ts"
import type { ItemData } from "#/data/items/itemData.ts"
import { ItemState } from "#/data/items/itemState.ts"
import { ItemType } from "#/data/items/itemType.ts"
import { ItemStateAction } from "#/rules/items/itemStateRules.ts"

import { addItem, applyBulkStateAction, removeItems, consumeItem, patchItem, removeItem, sellItem, setItem, setState } from "./items.actions.ts"
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

  describe("consumeItem", () => {
    it("makes an Available Consumable Active and uses up one unit", () => {
      // Arrange
      const drug = makeItem({ itemType: ItemType.consumable, state: ItemState.available, quantity: 3 })

      // Act
      const next = gearReducer({ [drug.id]: drug }, consumeItem({ id: drug.id }))

      // Assert
      expect(next[drug.id].state).toBe(ItemState.active)
      expect(next[drug.id].quantity).toBe(2)
    })

    it("treats a Consumable with no stored quantity as having one unit", () => {
      // Arrange
      const drug = makeItem({ itemType: ItemType.consumable })

      // Act
      const next = gearReducer({ [drug.id]: drug }, consumeItem({ id: drug.id }))

      // Assert
      expect(next[drug.id].state).toBe(ItemState.active)
      expect(next[drug.id].quantity).toBe(0)
    })

    it("does nothing when the Consumable has no units left", () => {
      // Arrange
      const drug = makeItem({ itemType: ItemType.consumable, state: ItemState.available, quantity: 0 })

      // Act
      const next = gearReducer({ [drug.id]: drug }, consumeItem({ id: drug.id }))

      // Assert
      expect(next[drug.id]).toEqual(drug)
    })

    it.each([ItemState.active, ItemState.stashed])("does nothing when the Consumable is %s", (state) => {
      // Arrange
      const drug = makeItem({ itemType: ItemType.consumable, state, quantity: 2 })

      // Act
      const next = gearReducer({ [drug.id]: drug }, consumeItem({ id: drug.id }))

      // Assert
      expect(next[drug.id]).toEqual(drug)
    })

    it("does nothing to an Item that isn't a Consumable", () => {
      // Arrange
      const weapon = makeItem({ state: ItemState.available, quantity: 2 })

      // Act
      const next = gearReducer({ [weapon.id]: weapon }, consumeItem({ id: weapon.id }))

      // Assert
      expect(next[weapon.id]).toEqual(weapon)
    })

    it("ending the effect makes an Active Consumable Available without restoring the unit", () => {
      // Arrange
      const drug = makeItem({ itemType: ItemType.consumable, state: ItemState.active, quantity: 2 })

      // Act
      const next = gearReducer({ [drug.id]: drug }, setState({ id: drug.id, state: ItemState.available }))

      // Assert
      expect(next[drug.id].state).toBe(ItemState.available)
      expect(next[drug.id].quantity).toBe(2)
    })
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

/** Builds a parent Item with `childCount` Attachments, linked both ways. */
const makeAttachmentTree = (parentOverrides: Partial<ItemData> = {}, childOverrides: Partial<ItemData>[] = [{}]) => {
  const parentId = crypto.randomUUID() as UUID
  const children = childOverrides.map((overrides) => makeItem({
    name: "Smartgun System",
    ...overrides,
    items: { parentId, childIds: [] },
  }))
  const parent = makeItem({
    ...parentOverrides,
    id: parentId,
    items: { parentId: null, childIds: children.map((child) => child.id) },
  })
  const catalog = Object.fromEntries([parent, ...children].map((item) => [item.id, item]))

  return { parent, children, catalog }
}

describe.concurrent("gearReducer sellItem", () => {
  it("removes the Item and its Attachments when selling attachments", () => {
    // Arrange
    const { parent, children: [child], catalog } = makeAttachmentTree()

    // Act
    const next = gearReducer(catalog, sellItem({ id: parent.id, salePrice: 100, sellAttachments: true }))

    // Assert
    expect(next).toEqual({})
    expect(next[child.id]).toBeUndefined()
  })

  it("keeps unfixed Attachments as top-level Items when not selling attachments", () => {
    // Arrange
    const { parent, children: [kept], catalog } = makeAttachmentTree({}, [{ name: "Laser Sight" }])

    // Act
    const next = gearReducer(catalog, sellItem({ id: parent.id, salePrice: 100, sellAttachments: false }))

    // Assert
    expect(next[parent.id]).toBeUndefined()
    expect(next[kept.id].items.parentId).toBeNull()
  })

  it("always sells fixed Attachments with their parent", () => {
    // Arrange
    const { parent, children: [fixed], catalog } = makeAttachmentTree({}, [{ name: "Integral Smartlink", fixed: true }])

    // Act
    const next = gearReducer(catalog, sellItem({ id: parent.id, salePrice: 100, sellAttachments: false }))

    // Assert
    expect(next[fixed.id]).toBeUndefined()
  })

  it("selling an Attachment removes it from its parent's childIds", () => {
    // Arrange
    const { parent, children: [child], catalog } = makeAttachmentTree()

    // Act
    const next = gearReducer(catalog, sellItem({ id: child.id, salePrice: 50, sellAttachments: true }))

    // Assert
    expect(next[child.id]).toBeUndefined()
    expect(next[parent.id].items.childIds).toEqual([])
  })
})

describe.concurrent("gearReducer applyBulkStateAction", () => {
  const makeRifleWithScope = () => {
    const rifle = makeItem({ name: "Rifle" })
    const scope = makeItem({
      name: "Scope",
      itemType: ItemType.firearmAccessory,
      items: { parentId: rifle.id, childIds: [] },
    })
    rifle.items = { parentId: null, childIds: [scope.id] }
    return { rifle, scope }
  }

  it("Equip only reaches the selected Items that can be Equipped", () => {
    // Arrange
    const pistol = makeItem({ name: "Pistol" })
    const license = makeItem({ name: "Gun License", itemType: ItemType.license })

    // Act
    const next = gearReducer(
      { [pistol.id]: pistol, [license.id]: license },
      applyBulkStateAction({ ids: [pistol.id, license.id], action: ItemStateAction.equip }),
    )

    // Assert
    expect(next[pistol.id].state).toBe(ItemState.equipped)
    expect(next[license.id].state).toBeUndefined()
  })

  it("Stash takes a selected parent's Attachments with it", () => {
    // Arrange
    const { rifle, scope } = makeRifleWithScope()

    // Act
    const next = gearReducer(
      { [rifle.id]: rifle, [scope.id]: scope },
      applyBulkStateAction({ ids: [rifle.id], action: ItemStateAction.stash }),
    )

    // Assert
    expect(next[rifle.id].state).toBe(ItemState.stashed)
    expect(next[scope.id].state).toBe(ItemState.stashed)
  })

  it("Unstash brings back a selected Attachment listed before its Stashed parent", () => {
    // Arrange
    const { rifle, scope } = makeRifleWithScope()
    const stashed = gearReducer(
      { [rifle.id]: rifle, [scope.id]: scope },
      applyBulkStateAction({ ids: [rifle.id], action: ItemStateAction.stash }),
    )

    // Act
    const next = gearReducer(
      stashed,
      applyBulkStateAction({ ids: [scope.id, rifle.id], action: ItemStateAction.unstash }),
    )

    // Assert
    expect(next[rifle.id].state).toBe(ItemState.available)
    expect(next[scope.id].state).toBe(ItemState.available)
  })

  it("Unequip leaves selected Items that aren't Equipped alone", () => {
    // Arrange
    const equipped = makeItem({ name: "Pistol", state: ItemState.equipped })
    const stashed = makeItem({ name: "Shotgun", state: ItemState.stashed })

    // Act
    const next = gearReducer(
      { [equipped.id]: equipped, [stashed.id]: stashed },
      applyBulkStateAction({ ids: [equipped.id, stashed.id], action: ItemStateAction.unequip }),
    )

    // Assert
    expect(next[equipped.id].state).toBe(ItemState.available)
    expect(next[stashed.id].state).toBe(ItemState.stashed)
  })
})

describe.concurrent("gearReducer removeItems", () => {
  it("removes each Item with its Attachments but leaves a fixed Attachment selected on its own", () => {
    // Arrange
    const rifle = makeItem({ name: "Rifle" })
    const scope = makeItem({ name: "Scope", itemType: ItemType.firearmAccessory, items: { parentId: rifle.id, childIds: [] } })
    rifle.items = { parentId: null, childIds: [scope.id] }
    const pistol = makeItem({ name: "Pistol" })
    const grip = makeItem({ name: "Grip", itemType: ItemType.firearmAccessory, fixed: true, items: { parentId: pistol.id, childIds: [] } })
    pistol.items = { parentId: null, childIds: [grip.id] }

    // Act
    const next = gearReducer(
      { [rifle.id]: rifle, [scope.id]: scope, [pistol.id]: pistol, [grip.id]: grip },
      removeItems({ ids: [rifle.id, grip.id] }),
    )

    // Assert
    expect(Object.keys(next).sort()).toEqual([grip.id, pistol.id].sort())
  })
})
