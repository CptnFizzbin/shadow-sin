import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { FocusData } from "#/system/model/items/magicalData.ts"
import { MagicalType } from "#/system/model/items/magicalData.ts"
import { FocusType } from "#/system/model/magic/focusData.ts"
import { SpiritType } from "#/system/model/magic/spiritData.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { FocusFormDialog } from "./focusFormDialog.tsx"

const pickOption = (dialog: HTMLElement, comboboxIndex: number, option: string) => {
  fireEvent.mouseDown(within(dialog).getAllByRole("combobox")[comboboxIndex])
  fireEvent.click(screen.getByRole("option", { name: option }))
}

describe("FocusFormDialog", () => {
  it("submits a Focus with the picked type and the spirit type it's tied to", async () => {
    // Arrange
    const ctrl = new DialogCtrl<FocusData>()
    ctrl.open()
    renderInBuilder(<FocusFormDialog ctrl={ctrl} />)
    const dialog = screen.getByRole("dialog", { name: "Add Focus" })

    // Act
    fireEvent.change(within(dialog).getByLabelText(/^name$/i), { target: { value: "Ember Totem" } })
    pickOption(dialog, 0, FocusType.Summoning)
    pickOption(dialog, 1, "Spirit of Fire")
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert
    const savedFocus = await ctrl.result()
    await waitFor(() => {
      expect(savedFocus).toMatchObject({
        itemType: ItemType.magical,
        magicalType: MagicalType.focus,
        name: "Ember Totem",
        focusType: FocusType.Summoning,
        spiritType: SpiritType.fire,
        force: 1,
        bonded: false,
      })
    })
  })

  it("shows the Karma it costs to Bond the Focus", () => {
    // Arrange
    const ctrl = new DialogCtrl<FocusData>()
    ctrl.open()
    renderInBuilder(<FocusFormDialog ctrl={ctrl} />)
    const dialog = screen.getByRole("dialog", { name: "Add Focus" })

    // Act
    pickOption(dialog, 0, FocusType.Spellcasting)

    // Assert
    expect(within(dialog).getByText("Bonding costs 4 Karma.")).toBeDefined()
  })
})
