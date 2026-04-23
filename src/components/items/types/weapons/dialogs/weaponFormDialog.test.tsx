import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { WeaponFormDialog } from "#/components/items/types/weapons/dialogs/weaponFormDialog.tsx"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { ItemType } from "#/system/itemType.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

describe("WeaponFormDialog", () => {
  it("submits an item with ItemType.weapon", async () => {
    const onSave = vi.fn()
    renderInBuilder(<WeaponFormDialog open onSave={onSave} onClose={vi.fn()} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
      target: { value: "Ares Predator V" },
    })
    // Firearm weapon type (the default) requires a Damage value
    fireEvent.change(within(dialog).getByLabelText(/^damage$/i), {
      target: { value: "8P" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: WeaponData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.weapon)
    })
  })
})
