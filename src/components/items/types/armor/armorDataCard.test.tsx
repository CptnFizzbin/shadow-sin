import { fireEvent, screen, waitFor } from "@testing-library/react"
import type { FC } from "react"
import { describe, expect, it, vi } from "vitest"

import { ItemSelectors } from "#/stores/runner/gear/gearSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { ArmorDataCard } from "./armorDataCard.tsx"

const jacket: ArmorData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Armor Jacket",
  itemType: ItemType.armor,
  ballistic: 8,
  impact: 6,
  equipped: false,
}

const helmet: ItemData = {
  kind: EntityKind.item,
  id: "00000000-0000-0000-0000-000000000002",
  name: "Helmet",
  itemType: ItemType.armor,
  items: { parentId: jacket.id, childIds: [] },
}

const renderArmorCard = (armor: ArmorData, extraGear: Record<string, ItemData> = {}) =>
  renderWithRunner(<ArmorDataCard armor={armor} />, { [armor.id]: armor, ...extraGear })

interface RemovableArmorCardProps {
  armorId: ArmorData["id"]
}

/**
 * Stops rendering `ArmorDataCard` once its armor is gone from the store — the same guard every
 * real caller gets for free by mapping over the store's armor list. An `ArmorDataCard` kept
 * mounted with an `armor.id` no longer in gear would otherwise re-run its own `selectChildrenOf`
 * selector against a missing parent and throw.
 */
const RemovableArmorCard: FC<RemovableArmorCardProps> = ({ armorId }) => {
  const armor = useRunnerSelector(ItemSelectors.selectById, { itemId: armorId }) as ArmorData | undefined
  return armor ? <ArmorDataCard armor={armor} /> : null
}

const renderRemovableArmorCard = (armor: ArmorData, extraGear: Record<string, ItemData> = {}) =>
  renderWithRunner(<RemovableArmorCard armorId={armor.id} />, { [armor.id]: armor, ...extraGear })

describe("ArmorDataCard", () => {
  it("renders the armor's Ballistic and Impact stats", () => {
    // Arrange / Act
    renderArmorCard(jacket)

    // Assert
    expect(screen.getByText("Armor Jacket")).toBeDefined()
    expect(screen.getByText("B: 8")).toBeDefined()
    expect(screen.getByText("I: 6")).toBeDefined()
  })

  it("renders attached mods as nested subitems", () => {
    // Arrange / Act
    renderArmorCard({ ...jacket, items: { ...jacket.items, childIds: [helmet.id] } }, { [helmet.id]: helmet })

    // Assert
    expect(screen.getByText("Helmet")).toBeDefined()
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange: ArmorDataCard always has an Actions menu button (it self-handles Remove), so the
    // title text — which bubbles up to the card's own onClick — is the unambiguous target.
    const onOpen = vi.fn()
    renderWithRunner(<ArmorDataCard armor={jacket} onOpen={onOpen} />, { [jacket.id]: jacket })

    // Act
    fireEvent.click(screen.getByText("Armor Jacket"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("offers an Equip action when unequipped", () => {
    // Arrange
    renderArmorCard(jacket)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))

    // Assert
    expect(screen.getByRole("menuitem", { name: "Equip" })).toBeDefined()
  })

  it("offers an Unequip action when equipped, and dispatches the toggle", () => {
    // Arrange
    const runnerStore = renderArmorCard({ ...jacket, equipped: true })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Unequip" }))

    // Assert
    expect(getItemCatalog(runnerStore.getState())[jacket.id].equipped).toBe(false)
  })

  it("removing the armor dispatches removeItem for it and its mods", async () => {
    // Arrange
    const runnerStore = renderRemovableArmorCard({ ...jacket, items: { ...jacket.items, childIds: [helmet.id] } }, { [helmet.id]: helmet })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    await waitFor(() => expect(getItemCatalog(runnerStore.getState())[jacket.id]).toBeUndefined())
    expect(getItemCatalog(runnerStore.getState())[helmet.id]).toBeUndefined()
  })
})
