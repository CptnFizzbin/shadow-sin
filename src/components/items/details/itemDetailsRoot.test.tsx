import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { ItemDetailsRoot } from "./itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "./itemDetailsSlot.tsx"

const baseItem: ItemData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Ares Predator V",
  itemType: ItemType.other,
}

describe("ItemDetailsRoot", () => {
  it("renders the name and type", () => {
    render(
      <ItemDetailsRoot item={baseItem} type="Heavy Pistol">
        <ItemDetailsSlot.Stat label="DV" value="8P" type="damage" />
      </ItemDetailsRoot>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("Heavy Pistol")).toBeDefined()
  })

  it("auto-renders common ItemData fields the card doesn't show", () => {
    const item: ItemData = {
      ...baseItem,
      description: "A heavy pistol favored by street samurai.",
      notes: "Serial number filed off.",
      cost: 1200,
      quantity: 2,
      availability: { rating: 8, restricted: true },
      source: { book: "SR4A", page: 427 },
      effects: [{ type: "attribute", target: "BOD", value: 1 }],
    }

    render(<ItemDetailsRoot item={item} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("A heavy pistol favored by street samurai.")).toBeDefined()
    expect(screen.getByText("Serial number filed off.")).toBeDefined()
    expect(screen.getByText("1,200¥")).toBeDefined()
    expect(screen.getByText("Qty: 2")).toBeDefined()
    expect(screen.getByText("Avail: 8R")).toBeDefined()
    expect(screen.getByText("SR4A p.427")).toBeDefined()
    expect(screen.getByText(/BOD.*\+1/)).toBeDefined()
  })

  it("renders equipped and stashed status", () => {
    render(
      <ItemDetailsRoot item={{ ...baseItem, equipped: true, wireless: { enabled: false } }} />,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Equipped")).toBeDefined()
    expect(screen.getByText("Wireless Off")).toBeDefined()
  })

  it("composes stats, damage track, subitems, and footer slots", () => {
    const onDamageChange = vi.fn()
    const accessory: ItemData = {
      id: "00000000-0000-0000-0000-000000000002",
      name: "GPS Jammer",
      itemType: ItemType.other,
    }

    render(
      <ItemDetailsRoot item={baseItem}>
        <ItemDetailsSlot.Stat label="Handling" value="3" />
        <ItemDetailsSlot.DamageTrack label="Damage" max={12} current={2} onChange={onDamageChange} />
        <ItemDetailsSlot.Subitem item={accessory} />
        <ItemDetailsSlot.Footer>
          <span>Custom footer content</span>
        </ItemDetailsSlot.Footer>
      </ItemDetailsRoot>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Handling")).toBeDefined()
    expect(screen.getByText("3")).toBeDefined()
    expect(screen.getByText("Attachments")).toBeDefined()
    expect(screen.getByText("GPS Jammer")).toBeDefined()
    expect(screen.getByText("Custom footer content")).toBeDefined()
  })

  it("renders no Edit/Remove actions without onEdit or onRemove", () => {
    render(<ItemDetailsRoot item={baseItem} />, { wrapper: ThemeWrapper })

    expect(screen.queryByRole("button", { name: "Edit" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Remove" })).toBeNull()
  })

  it("invokes onEdit and onRemove from persistent action buttons", () => {
    const onEdit = vi.fn()
    const onRemove = vi.fn()
    render(<ItemDetailsRoot item={baseItem} onEdit={onEdit} onRemove={onRemove} />, { wrapper: ThemeWrapper })

    fireEvent.click(screen.getByRole("button", { name: "Edit" }))
    fireEvent.click(screen.getByRole("button", { name: "Remove" }))

    expect(onEdit).toHaveBeenCalledOnce()
    expect(onRemove).toHaveBeenCalledOnce()
  })
})
