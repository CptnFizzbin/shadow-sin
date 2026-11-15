import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AnyItemCard } from "#/components/ui/cards/itemCard/anyItemCard.tsx"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ItemActionsDialogProvider } from "./itemActionsDialogProvider.tsx"

const medkit: ItemData = {
  kind: EntityKind.item,
  id: "00000000-0000-0000-0000-000000000001" as UUID,
  name: "Medkit",
  itemType: ItemType.other,
  cost: 1000,
  items: { parentId: null, childIds: [] },
}

const renderCard = (nuyen = 100) => renderWithProviders(
  <ItemActionsDialogProvider>
    <AnyItemCard item={medkit} />
  </ItemActionsDialogProvider>,
  {
    runner: runnerDataFactory({
      items: { [medkit.id]: medkit },
      afterBuild: (data) => {
        data.nuyen.current = nuyen
      },
    }),
  },
)

describe("ItemActionsDialogProvider", () => {
  it("the card's menu button lists the Item's actions", async () => {
    // Arrange
    renderCard()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))

    // Assert
    const dialog = await screen.findByRole("dialog", { name: "Medkit" })
    expect(dialog.textContent).toContain("Carried")
    for (const label of ["Equip", "Stash", "Edit", "Sell", "Delete"]) {
      expect(screen.getByRole("button", { name: label })).toBeDefined()
    }
  })

  it("Stash stashes the Item", async () => {
    // Arrange
    const store = renderCard()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(await screen.findByRole("button", { name: "Stash" }))

    // Assert
    await waitFor(() => expect(getItemCatalog(store.getState().runner)[medkit.id].stashed).toBe(true))
  })

  it("Sell offers half the cost, credits it, and removes the Item", async () => {
    // Arrange
    const store = renderCard(100)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(await screen.findByRole("button", { name: "Sell" }))
    fireEvent.click(await screen.findByRole("button", { name: "Sell for 500¥" }))

    // Assert
    await waitFor(() => expect(getItemCatalog(store.getState().runner)[medkit.id]).toBeUndefined())
    expect(store.getState().runner.nuyen.current).toBe(600)
  })

  it("Delete removes the Item once confirmed", async () => {
    // Arrange
    const store = renderCard()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(await screen.findByRole("button", { name: "Delete" }))
    const confirmDialog = await screen.findByRole("dialog", { name: "Delete Medkit?" })
    fireEvent.click(within(confirmDialog).getByRole("button", { name: "Delete" }))

    // Assert
    await waitFor(() => expect(getItemCatalog(store.getState().runner)[medkit.id]).toBeUndefined())
  })
})
