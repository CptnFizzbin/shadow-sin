import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { ItemDialogSubitemsTab } from "./itemDialogSubitemsTab.tsx"

const parent: ItemData = {
  kind: EntityKind.item,
  id: "00000000-0000-0000-0000-000000000001",
  name: "Combat Vest",
  itemType: ItemType.armor,
  items: { parentId: null, childIds: ["00000000-0000-0000-0000-000000000002"] },
}

const child: ItemData = {
  kind: EntityKind.item,
  id: "00000000-0000-0000-0000-000000000002",
  name: "Plate Insert",
  itemType: ItemType.other,
  items: { parentId: parent.id, childIds: [] },
}

describe("ItemDialogSubitemsTab", () => {
  it("renders a card for each subitem attached to the given item", () => {
    // Arrange
    renderWithRunner(<ItemDialogSubitemsTab itemId={parent.id} />, {
      [parent.id]: parent,
      [child.id]: child,
    })

    // Assert
    expect(screen.getByText("Plate Insert")).toBeDefined()
  })

  it("renders no subitem cards when the item has none", () => {
    // Arrange — the other item is in the catalog but attached to nothing, so it mustn't appear
    const childlessParent: ItemData = { ...parent, items: { parentId: null, childIds: [] } }
    const unattached: ItemData = { ...child, items: { parentId: null, childIds: [] } }

    // Act
    renderWithRunner(<ItemDialogSubitemsTab itemId={childlessParent.id} />, {
      [childlessParent.id]: childlessParent,
      [unattached.id]: unattached,
    })

    // Assert
    expect(screen.queryByText("Plate Insert")).toBeNull()
    expect(screen.queryByText("Combat Vest")).toBeNull()
    const addItemButton = screen.getByRole("button", { name: /add item/i })
    expect(addItemButton.parentElement!.children).toHaveLength(1)
  })

  it("opens the Add Item workflow's type picker when Add Item is clicked", () => {
    // Arrange
    renderWithRunner(<ItemDialogSubitemsTab itemId={parent.id} />, {
      [parent.id]: parent,
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add item/i }))

    // Assert — the shared workflow's type picker (mounted by AddItemDialogProvider) opens
    expect(screen.getByRole("dialog")).toBeDefined()
    expect(screen.getByText("Weapons")).toBeDefined()
  })
})
