import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ArmorFormDialog } from "#/components/items/types/armor/dialogs/armorFormDialog.tsx"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

describe("ArmorFormDialog", () => {
  it("submits an item with ItemType.armor and default ballistic/impact of 0", async () => {
    const onSave = vi.fn()
    renderInBuilder(<ArmorFormDialog open onSave={onSave} onClose={vi.fn()} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
      target: { value: "Armor Vest" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ArmorData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.armor)
      expect(submitted.name).toBe("Armor Vest")
      expect(submitted.ballistic).toBe(0)
      expect(submitted.impact).toBe(0)
    })
  })

  it("submits with the provided ballistic and impact values", async () => {
    const onSave = vi.fn()
    renderInBuilder(<ArmorFormDialog open onSave={onSave} onClose={vi.fn()} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

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

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ArmorData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.armor)
      expect(submitted.name).toBe("Lined Coat")
      expect(submitted.ballistic).toBe(6)
      expect(submitted.impact).toBe(4)
    })
  })

  it("populates fields when editing an existing armor item", () => {
    const existingArmor: ArmorData = {
      id: "test-id" as ArmorData["id"],
      itemType: ItemType.armor,
      name: "Full Body Armor",
      ballistic: 8,
      impact: 6,
      cost: 11000,
      quantity: 1,
      description: "",
      availability: { rating: 14, restricted: true, forbidden: false },
      source: { book: "SR4", page: 162 },
      effects: [],
    }

    const onSave = vi.fn()
    renderInBuilder(
      <ArmorFormDialog open armor={existingArmor} onSave={onSave} onClose={vi.fn()} />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    expect(within(dialog).getByDisplayValue("Full Body Armor")).toBeDefined()
    expect(within(dialog).getByDisplayValue("8")).toBeDefined()
    expect(within(dialog).getByDisplayValue("6")).toBeDefined()
  })
})
