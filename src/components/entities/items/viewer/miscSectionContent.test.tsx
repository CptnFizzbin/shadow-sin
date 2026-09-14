import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/runnerDataStore.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { MiscSectionContent } from "./miscSectionContent.tsx"

const trodes: ItemData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Trodes",
  itemType: ItemType.other,
}

describe("MiscSectionContent", () => {
  it("shows items from the store", () => {
    // Arrange / Act
    renderInBuilder(<MiscSectionContent />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [trodes.id]: trodes } })),
    })

    // Assert
    expect(screen.getByText("Trodes")).toBeDefined()
  })

  it("tapping an item opens the edit dialog directly — the Builder has no details page", async () => {
    // Arrange
    renderInBuilder(<MiscSectionContent />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [trodes.id]: trodes } })),
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: /trodes/i }))

    // Assert: the item form dialog opened, pre-filled for editing.
    expect(await screen.findByRole("dialog", { name: /edit item/i })).toBeDefined()
  })

  it("removing an item dispatches removeItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<MiscSectionContent />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [trodes.id]: trodes } })),
    })
    expect(screen.getByText("Trodes")).toBeDefined()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Trodes")).toBeNull())
  })
})
