import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { WeaponData } from "#/system/model/items/weaponData.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { WeaponFormDialog } from "./weaponFormDialog.tsx"

describe("WeaponFormDialog", () => {
  it("submits an item with ItemType.weapon", async () => {
    // Arrange
    const ctrl = new DialogCtrl<WeaponData>()
    ctrl.open()
    renderInBuilder(<WeaponFormDialog ctrl={ctrl} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    // Act
    fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
      target: { value: "Ares Predator V" },
    })
    // Firearm weapon type (the default) requires a Damage value
    fireEvent.change(within(dialog).getByLabelText(/^damage$/i), {
      target: { value: "8P" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toBe(ItemType.weapon)
    })
  })
})
