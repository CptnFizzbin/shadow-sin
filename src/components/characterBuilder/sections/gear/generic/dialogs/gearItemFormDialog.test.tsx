import { waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { GearItemFormDialog } from "#/components/characterBuilder/sections/gear/generic/dialogs/gearItemFormDialog.tsx"
import type { ItemData } from "#/lib/system/itemData.ts"
import { ItemType } from "#/lib/system/itemType.ts"
import { fillNameAndClickSave, renderWithTheme } from "#testUtils/renderUtils.tsx"

describe("GearItemFormDialog", () => {
  it("submits a vehicle item when itemType=vehicle", async () => {
    const onSave = vi.fn()
    renderWithTheme(
      <GearItemFormDialog
        open
        itemType={ItemType.vehicle}
        label="Vehicle"
        onSave={onSave}
        onClose={vi.fn()}
      />,
    )

    fillNameAndClickSave("Eurocar Westwind 2000")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ItemData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.vehicle)
      expect(submitted.name).toBe("Eurocar Westwind 2000")
    })
  })

  it("submits an armor item when itemType=armor", async () => {
    const onSave = vi.fn()
    renderWithTheme(
      <GearItemFormDialog
        open
        itemType={ItemType.armor}
        label="Armor"
        onSave={onSave}
        onClose={vi.fn()}
      />,
    )

    fillNameAndClickSave("Armor Vest")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ItemData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.armor)
    })
  })

  it("submits a misc (other) item when no itemType is provided", async () => {
    const onSave = vi.fn()
    renderWithTheme(
      <GearItemFormDialog open label="Item" onSave={onSave} onClose={vi.fn()} />,
    )

    fillNameAndClickSave("Random Gear")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ItemData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.other)
    })
  })

  it("submits an explicit misc item when itemType=other", async () => {
    const onSave = vi.fn()
    renderWithTheme(
      <GearItemFormDialog
        open
        itemType={ItemType.other}
        label="Item"
        onSave={onSave}
        onClose={vi.fn()}
      />,
    )

    fillNameAndClickSave("Misc Item")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ItemData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.other)
    })
  })
})
