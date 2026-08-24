import { fireEvent, screen, waitFor } from "@testing-library/react"
import type { FC } from "react"
import { describe, expect, it, vi } from "vitest"

import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { OtherDataCard } from "./otherDataCard.tsx"

const survivalKit: ItemData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Survival Kit",
  itemType: ItemType.other,
  cost: 500,
}

const flashlight: ItemData = {
  kind: EntityKind.item,
  id: "00000000-0000-0000-0000-000000000002",
  name: "Flashlight",
  itemType: ItemType.other,
  items: { parentId: survivalKit.id, childIds: [] },
}

interface RemovableOtherCardProps {
  itemId: ItemData["id"]
}

/**
 * Stops rendering `OtherDataCard` once its item is gone from the store — the same guard every
 * real caller gets for free by mapping over the store's misc-item list. An `OtherDataCard` kept
 * mounted with an `item.id` no longer in gear would otherwise re-run its own `selectChildrenOf`
 * selector against a missing parent and throw.
 */
const RemovableOtherCard: FC<RemovableOtherCardProps> = ({ itemId }) => {
  const item = useRunnerStoreSelector(Selectors.gear.selectById(itemId)) as ItemData | undefined
  return item ? <OtherDataCard item={item} /> : null
}

const renderRemovableOtherCard = (item: ItemData, extraGear: Record<string, ItemData> = {}) =>
  renderWithRunner(<RemovableOtherCard itemId={item.id} />, { [item.id]: item, ...extraGear })

describe("OtherDataCard", () => {
  it("renders the item's name and cost", () => {
    // Arrange / Act
    renderWithRunner(<OtherDataCard item={survivalKit} />, { [survivalKit.id]: survivalKit })

    // Assert
    expect(screen.getByText("Survival Kit")).toBeDefined()
  })

  it("renders attached items as nested subitems", () => {
    // Arrange
    const survivalKitWithFlashlight = { ...survivalKit, items: { ...survivalKit.items, childIds: [flashlight.id] } }

    // Act
    renderWithRunner(
      <OtherDataCard item={survivalKitWithFlashlight} />,
      { [survivalKitWithFlashlight.id]: survivalKitWithFlashlight, [flashlight.id]: flashlight },
    )

    // Assert
    expect(screen.getByText("Flashlight")).toBeDefined()
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    renderWithRunner(<OtherDataCard item={survivalKit} onOpen={onOpen} />, { [survivalKit.id]: survivalKit })

    // Act
    fireEvent.click(screen.getByText("Survival Kit"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("removing the item dispatches removeItem for it and its subitems", async () => {
    // Arrange
    const runnerStore = renderRemovableOtherCard(
      { ...survivalKit, items: { ...survivalKit.items, childIds: [flashlight.id] } },
      { [flashlight.id]: flashlight },
    )

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    await waitFor(() => expect(getItemCatalog(runnerStore.getState())[survivalKit.id]).toBeUndefined())
    expect(getItemCatalog(runnerStore.getState())[flashlight.id]).toBeUndefined()
  })
})
