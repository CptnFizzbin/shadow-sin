import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DataCard } from "#/components/dataCard/dataCard.tsx"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { ItemDataCardRoot } from "./itemDataCardRoot.tsx"

const baseItem: ItemData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Ares Predator V",
  itemType: ItemType.other,
}

describe("ItemDataCardRoot", () => {
  it("renders the item's name and itemType", () => {
    render(<ItemDataCardRoot item={baseItem} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText(ItemType.other)).toBeDefined()
  })

  it("renders subType alongside the itemType", () => {
    render(<ItemDataCardRoot item={baseItem} subType="Heavy Pistol" />, { wrapper: ThemeWrapper })

    expect(screen.getByText(/Heavy Pistol/)).toBeDefined()
  })

  it("renders the item's source, availability, quantity, cost, and rating", () => {
    const item: ItemData = {
      ...baseItem,
      source: { book: "SR4A", page: 427 },
      availability: { rating: 8, restricted: true },
      quantity: 3,
      cost: 1200,
      rating: 4,
    }

    render(<ItemDataCardRoot item={item} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("SR4A p.427")).toBeDefined()
    expect(screen.getByText("Avail: 8R")).toBeDefined()
    expect(screen.getByText("x3")).toBeDefined()
    expect(screen.getByText("1,200¥")).toBeDefined()
    expect(screen.getByText("4")).toBeDefined()
  })

  it("renders equipped and wireless-off status icons from the item", () => {
    render(
      <ItemDataCardRoot item={{ ...baseItem, equipped: true, wireless: { enabled: false } }} />,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByLabelText("Equipped")).toBeDefined()
    expect(screen.getByLabelText("Wireless off")).toBeDefined()
  })

  it("renders a removed-wireless status icon when wireless was removed", () => {
    render(
      <ItemDataCardRoot item={{ ...baseItem, wireless: { removed: true } }} />,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByLabelText("Wireless removed")).toBeDefined()
  })

  it("renders Stashed instead of Equipped for a stashed-but-equipped item", () => {
    render(
      <ItemDataCardRoot item={{ ...baseItem, equipped: true, stashed: true }} />,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByLabelText("Stashed")).toBeDefined()
    expect(screen.queryByLabelText("Equipped")).toBeNull()
  })

  it("renders no status icons when the item has none set", () => {
    render(<ItemDataCardRoot item={baseItem} />, { wrapper: ThemeWrapper })

    expect(screen.queryByLabelText("Equipped")).toBeNull()
    expect(screen.queryByLabelText("Stashed")).toBeNull()
    expect(screen.queryByLabelText("Fixed")).toBeNull()
  })

  it("passes extra children through to DataCard as additional slots", () => {
    render(
      <ItemDataCardRoot item={baseItem}>
        <DataCard.Stat label="Handling" value="3" />
      </ItemDataCardRoot>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Handling: 3")).toBeDefined()
  })
})
