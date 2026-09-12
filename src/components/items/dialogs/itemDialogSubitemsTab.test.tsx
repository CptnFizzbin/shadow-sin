import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
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
    // Arrange
    renderWithRunner(<ItemDialogSubitemsTab itemId={parent.id} />, {
      [parent.id]: parent,
    })

    // Assert
    expect(screen.queryByText("Plate Insert")).toBeNull()
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
