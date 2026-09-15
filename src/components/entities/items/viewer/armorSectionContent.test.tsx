import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ArmorData } from "#/system/model/items/armorData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { ArmorSectionContent } from "./armorSectionContent.tsx"

const jacket: ArmorData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Armor Jacket",
  itemType: ItemType.armor,
  ballistic: 8,
  impact: 6,
}

describe("ArmorSectionContent", () => {
  it("shows armor from the store", () => {
    // Arrange / Act
    renderInBuilder(<ArmorSectionContent />, {
      runner: runnerDataFactory({ items: { [jacket.id]: jacket } }),
    })

    // Assert
    expect(screen.getByText("Armor Jacket")).toBeDefined()
  })

  it("tapping armor opens the edit dialog directly — the Builder has no details page", () => {
    // Arrange
    renderInBuilder(<ArmorSectionContent />, {
      runner: runnerDataFactory({ items: { [jacket.id]: jacket } }),
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: /armor jacket/i }))

    // Assert: the armor form dialog opened, pre-filled for editing.
    expect(screen.getByRole("dialog", { name: /edit armor/i })).toBeDefined()
  })

  it("removing armor dispatches removeItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<ArmorSectionContent />, {
      runner: runnerDataFactory({ items: { [jacket.id]: jacket } }),
    })
    expect(screen.getByText("Armor Jacket")).toBeDefined()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Armor Jacket")).toBeNull())
  })
})
