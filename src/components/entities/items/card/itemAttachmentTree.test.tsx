import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ItemActionsDialogProvider } from "#/components/entities/items/actions/itemActionsDialogProvider.tsx"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { ItemAttachmentTree } from "./itemAttachmentTree.tsx"

const makeItem = (id: string, name: string, parentId: string | null, childIds: string[], rating?: number): ItemData => ({
  kind: EntityKind.item,
  id: id as UUID,
  name,
  itemType: ItemType.other,
  rating,
  items: { parentId: parentId as UUID | null, childIds: childIds as UUID[] },
})

const rifle = makeItem("00000000-0000-0000-0000-000000000001", "Ares Alpha", null, ["00000000-0000-0000-0000-000000000002"])
const scope = makeItem("00000000-0000-0000-0000-000000000002", "Imaging Scope", rifle.id, ["00000000-0000-0000-0000-000000000003"])
const lowLight = makeItem("00000000-0000-0000-0000-000000000003", "Low-Light Vision", scope.id, [], 3)

const gear = { [rifle.id]: rifle, [scope.id]: scope, [lowLight.id]: lowLight }

describe("ItemAttachmentTree", () => {
  it("lists Attachments of Attachments with their ratings", () => {
    // Arrange / Act
    renderWithRunner(<ItemAttachmentTree itemId={rifle.id} />, gear)

    // Assert
    expect(screen.getByText("Imaging Scope")).toBeDefined()
    expect(screen.getByText("Low-Light Vision")).toBeDefined()
    expect(screen.getByText(/Rating: 3/)).toBeDefined()
  })

  it("opens an Attachment's own actions from its row", async () => {
    // Arrange
    renderWithRunner(
      <ItemActionsDialogProvider>
        <ItemAttachmentTree itemId={rifle.id} />
      </ItemActionsDialogProvider>,
      gear,
    )

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Low-Light Vision actions" }))

    // Assert
    const dialog = await screen.findByRole("dialog", { name: "Low-Light Vision" })
    expect(dialog.textContent).toContain("attached to Imaging Scope")
  })
})
