import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import { EntityKind } from "#/system/entityKind.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { ItemCard } from "./itemCard.tsx"
import { ItemCardElements } from "./itemCardElements.tsx"

const baseItem: ItemData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Ares Predator V",
  itemType: ItemType.other,
}

describe("ItemCard", () => {
  it("renders the item's name via EntityCard", () => {
    // Arrange / Act
    render(<ItemCard item={baseItem} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("Ares Predator V")).toBeDefined()
  })

  it("renders the item's availability, quantity, and cost", () => {
    // Arrange
    const item: ItemData = {
      ...baseItem,
      availability: { rating: 8, restricted: true },
      quantity: 3,
      cost: 1200,
    }

    // Act
    render(<ItemCard item={item} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("Avail: 8R")).toBeDefined()
    expect(screen.getByText("x3")).toBeDefined()
    expect(screen.getByText("1,200¥")).toBeDefined()
  })

  it("renders equipped and wireless-off status icons from the item", () => {
    // Arrange / Act
    render(
      <ItemCard item={{ ...baseItem, equipped: true, wireless: { enabled: false } }} />,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.getByLabelText("Equipped")).toBeDefined()
    expect(screen.getByLabelText("Wireless off")).toBeDefined()
  })

  it("renders a removed-wireless status icon when wireless was removed", () => {
    // Arrange / Act
    render(<ItemCard item={{ ...baseItem, wireless: { removed: true } }} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByLabelText("Wireless removed")).toBeDefined()
  })

  it("renders no status icons when the item has none set", () => {
    // Arrange / Act
    render(<ItemCard item={baseItem} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.queryByLabelText("Equipped")).toBeNull()
    expect(screen.queryByLabelText("Stashed")).toBeNull()
    expect(screen.queryByLabelText("Fixed")).toBeNull()
  })

  it("passes extra children through to EntityCard as additional Layout rows", () => {
    // Arrange / Act
    render(
      <ItemCard item={baseItem}>
        <ItemCard.Layout.BodyRow>
          <ItemCard.Stat label="Handling" value="3" />
        </ItemCard.Layout.BodyRow>
      </ItemCard>,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.getByText("Handling: 3")).toBeDefined()
  })

  it("exposes EntityCard's content elements it pulls in, by name", () => {
    // Arrange / Act / Assert
    expect(ItemCard.Title).toBe(EntityCard.Title)
    expect(ItemCard.Rating).toBe(EntityCard.Rating)
    expect(ItemCard.Source).toBe(EntityCard.Source)
    expect(ItemCard.Effects).toBe(EntityCard.Effects)
    expect(ItemCard.Stat).toBe(EntityCard.Stat)
    expect(ItemCard.Action).toBe(EntityCard.Action)
  })

  it("exposes its own incremental elements from ItemCardElements", () => {
    // Arrange / Act / Assert
    expect(ItemCard.Availability).toBe(ItemCardElements.Availability)
    expect(ItemCard.Cost).toBe(ItemCardElements.Cost)
    expect(ItemCard.Quantity).toBe(ItemCardElements.Quantity)
    expect(ItemCard.DamageTrack).toBe(ItemCardElements.DamageTrack)
    expect(ItemCard.Subitem).toBe(ItemCardElements.Subitem)
    expect(ItemCard.SubType).toBe(ItemCardElements.SubType)
    expect(ItemCard.StatusIcon).toBe(ItemCardElements.StatusIcon)
  })

  it("re-exposes EntityCard's Layout regions unchanged", () => {
    // Arrange / Act / Assert
    expect(ItemCard.Layout).toBe(EntityCard.Layout)
  })
})
