import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { ArmorFormDialog } from "./armorFormDialog.tsx"

describe("ArmorFormDialog", () => {
  it("submits an item with ItemType.armor and default ballistic/impact of 0", async () => {
    // Arrange
    const ctrl = new DialogCtrl<ArmorData>()
    ctrl.open()
    renderInBuilder(<ArmorFormDialog ctrl={ctrl} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    // Act
    fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
      target: { value: "Armor Vest" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toEqual([ItemType.armor])
      expect(savedItem?.name).toBe("Armor Vest")
      expect(savedItem?.ballistic).toBe(0)
      expect(savedItem?.impact).toBe(0)
    })
  })

  it("submits with the provided ballistic and impact values", async () => {
    // Arrange
    const ctrl = new DialogCtrl<ArmorData>()
    ctrl.open()
    renderInBuilder(<ArmorFormDialog ctrl={ctrl} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    // Act
    fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
      target: { value: "Lined Coat" },
    })
    fireEvent.change(within(dialog).getByLabelText(/^ballistic$/i), {
      target: { value: "6" },
    })
    fireEvent.change(within(dialog).getByLabelText(/^impact$/i), {
      target: { value: "4" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toEqual([ItemType.armor])
      expect(savedItem?.name).toBe("Lined Coat")
      expect(savedItem?.ballistic).toBe(6)
      expect(savedItem?.impact).toBe(4)
    })
  })

  it("populates fields when editing an existing armor item", () => {
    // Arrange
    const existingArmor: ArmorData = {
      id: "test-id" as ArmorData["id"],
      itemType: [ItemType.armor],
      name: "Full Body Armor",
      ballistic: 8,
      impact: 6,
      cost: 11000,
      quantity: 1,
      description: "",
      availability: { rating: 14, restricted: true, forbidden: false },
      source: { book: "SR4A", page: 162 },
      effects: [],
    }

    const ctrl = new DialogCtrl<ArmorData>()
    ctrl.open()
    renderInBuilder(<ArmorFormDialog ctrl={ctrl} armor={existingArmor} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    // Assert
    expect(within(dialog).getByDisplayValue("Full Body Armor")).toBeDefined()
    expect(within(dialog).getByDisplayValue("8")).toBeDefined()
    expect(within(dialog).getByDisplayValue("6")).toBeDefined()
  })
})
