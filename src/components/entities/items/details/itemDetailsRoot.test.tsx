import { fireEvent, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { DeviceData } from "#/system/model/items/deviceData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { createItemMap } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { ItemDetailsRoot } from "./itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "./itemDetailsSlot.tsx"

const baseItem: ItemData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Ares Predator V",
  itemType: ItemType.other,
}

describe("ItemDetailsRoot", () => {
  it("renders the name and type", () => {
    renderWithRunner(
      <ItemDetailsRoot item={baseItem} type="Heavy Pistol">
        <ItemDetailsSlot.Stat label="DV" value="8P" type="damage" />
      </ItemDetailsRoot>,
      createItemMap(baseItem),
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

    renderWithRunner(<ItemDetailsRoot item={item} />, createItemMap(item))

    expect(screen.getByText("A heavy pistol favored by street samurai.")).toBeDefined()
    expect(screen.getByText("Serial number filed off.")).toBeDefined()
    expect(screen.getByText("1,200¥")).toBeDefined()
    expect(screen.getByText("Qty: 2")).toBeDefined()
    expect(screen.getByText("Avail: 8R")).toBeDefined()
    expect(screen.getByText("SR4A p.427")).toBeDefined()
    expect(screen.getByText(/BOD.*\+1/)).toBeDefined()
  })

  it("renders equipped, stashed, and wireless-off status", () => {
    // Arrange
    const item: ItemData = { ...baseItem, equipped: true, stashed: true, wireless: { enabled: false } }

    // Act
    renderWithRunner(<ItemDetailsRoot item={item} />, createItemMap(item))

    // Assert
    expect(screen.getByText("Equipped")).toBeDefined()
    expect(screen.getByText("Stashed")).toBeDefined()
    expect(screen.getByText("Wireless Off")).toBeDefined()
  })

  it("omits the equipped and stashed status when the item is neither", () => {
    // Arrange
    const item: ItemData = { ...baseItem, equipped: false, stashed: false }

    // Act
    renderWithRunner(<ItemDetailsRoot item={item} />, createItemMap(item))

    // Assert
    expect(screen.queryByText("Equipped")).toBeNull()
    expect(screen.queryByText("Stashed")).toBeNull()
  })

  it("composes stats, damage track, subitems, and footer slots", () => {
    // Arrange
    const onDamageChange = vi.fn()
    const accessory: ItemData = {
      kind: EntityKind.item, items: { parentId: null, childIds: [] },
      id: "00000000-0000-0000-0000-000000000002",
      name: "GPS Jammer",
      itemType: ItemType.software,
    }

    // Act
    renderWithRunner(
      <ItemDetailsRoot item={baseItem}>
        <ItemDetailsSlot.Stat label="Handling" value="3" />
        <ItemDetailsSlot.DamageTrack label="Damage" max={12} current={2} onChange={onDamageChange} />
        <ItemDetailsSlot.Subitem item={accessory} />
        <ItemDetailsSlot.Footer>
          <span>Custom footer content</span>
        </ItemDetailsSlot.Footer>
      </ItemDetailsRoot>,
      createItemMap(baseItem),
    )
    const damageTrack = screen.getByText("Damage").parentElement!
    fireEvent.click(within(damageTrack).getByRole("button", { name: "Reset" }))

    // Assert
    expect(screen.getByText("Handling")).toBeDefined()
    expect(screen.getByText("3")).toBeDefined()
    const damageButtons = within(damageTrack).getAllByRole("button")
    // One Reset button plus a cell per box of the 12-box track.
    expect(damageButtons).toHaveLength(13)
    expect(damageButtons.filter((button) => button.classList.contains("MuiButton-contained"))).toHaveLength(2)
    expect(onDamageChange).toHaveBeenCalledExactlyOnceWith(0)
    expect(screen.getByText("Attachments")).toBeDefined()
    expect(screen.getByText("GPS Jammer")).toBeDefined()
    expect(screen.getByText("Custom footer content")).toBeDefined()
  })

  it("renders no Edit/Remove actions without onEdit or onRemove", () => {
    renderWithRunner(<ItemDetailsRoot item={baseItem} />, createItemMap(baseItem))

    expect(screen.queryByRole("button", { name: "Edit" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Remove" })).toBeNull()
  })

  it("invokes onEdit and onRemove from persistent action buttons", () => {
    const onEdit = vi.fn()
    const onRemove = vi.fn()
    renderWithRunner(<ItemDetailsRoot item={baseItem} onEdit={onEdit} onRemove={onRemove} />, createItemMap(baseItem))

    fireEvent.click(screen.getByRole("button", { name: "Edit" }))
    fireEvent.click(screen.getByRole("button", { name: "Remove" }))

    expect(onEdit).toHaveBeenCalledOnce()
    expect(onRemove).toHaveBeenCalledOnce()
  })

  describe("Matrix section", () => {
    it("shows a default Rating 1 node for an item that sets no Matrix stats", () => {
      // Arrange
      const weapon: ItemData = { ...baseItem, itemType: ItemType.weapon }

      // Act
      renderWithRunner(<ItemDetailsRoot item={weapon} />, createItemMap(weapon))

      // Assert
      const matrixSection = screen.getByRole("region", { name: "Matrix" })
      for (const label of ["Rating", "Response", "System", "Firewall", "Signal"]) {
        expect(within(matrixSection).getByText(label).nextSibling?.textContent).toBe("1")
      }
      expect(within(matrixSection).getAllByText("default")).toHaveLength(5)
      expect(within(matrixSection).queryByText("Offline")).toBeNull()
    })

    it("marks only the stats a device doesn't set as default", () => {
      // Arrange
      const device: DeviceData = { ...baseItem, itemType: ItemType.device, deviceRating: 4, response: 3 }

      // Act
      renderWithRunner(<ItemDetailsRoot item={device} />, createItemMap(device))

      // Assert
      const matrixSection = screen.getByRole("region", { name: "Matrix" })
      expect(within(matrixSection).getByText("Rating").nextSibling?.textContent).toBe("4")
      expect(within(matrixSection).getByText("Response").nextSibling?.textContent).toBe("3")
      expect(within(matrixSection).getAllByText("default")).toHaveLength(3)
    })

    it("shows no Matrix section for an item that opted out", () => {
      // Arrange
      const weapon: ItemData = { ...baseItem, itemType: ItemType.weapon, matrixDisabled: true }

      // Act
      renderWithRunner(<ItemDetailsRoot item={weapon} />, createItemMap(weapon))

      // Assert
      expect(screen.queryByRole("region", { name: "Matrix" })).toBeNull()
    })

    it("marks the node offline while the item's wireless is off", () => {
      // Arrange
      const weapon: ItemData = { ...baseItem, itemType: ItemType.weapon, wireless: { enabled: false } }

      // Act
      renderWithRunner(<ItemDetailsRoot item={weapon} />, createItemMap(weapon))

      // Assert
      const matrixSection = screen.getByRole("region", { name: "Matrix" })
      expect(within(matrixSection).getByText("Offline")).toBeDefined()
    })

    it("renders Matrix slot content inside the Matrix section", () => {
      // Arrange
      const device: DeviceData = { ...baseItem, itemType: ItemType.device }

      // Act
      renderWithRunner(
        <ItemDetailsRoot item={device}>
          <ItemDetailsSlot.Matrix>
            <span>Programs go here</span>
          </ItemDetailsSlot.Matrix>
        </ItemDetailsRoot>,
        createItemMap(device),
      )

      // Assert
      const matrixSection = screen.getByRole("region", { name: "Matrix" })
      expect(within(matrixSection).getByText("Programs go here")).toBeDefined()
    })
  })
})
