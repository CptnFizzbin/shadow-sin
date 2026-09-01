import { fireEvent, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { SinNameList } from "#/system/gear/sinNameList.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { SinFormDialog } from "./sinFormDialog.tsx"

describe("SinFormDialog", () => {
  it("fills the Name field with a suggestion from SinNameList when the dice button is clicked", () => {
    // Arrange
    const ctrl = new DialogCtrl<SinData>()
    ctrl.open()
    renderInBuilder(<SinFormDialog ctrl={ctrl} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    // Act
    fireEvent.click(within(dialog).getByRole("button", { name: /randomize name/i }))

    // Assert
    const nameInput = within(dialog).getByLabelText(/^name$/i) as HTMLInputElement
    expect(SinNameList).toContain(nameInput.value)
  })

  it("saves isReal: true when the Real toggle is selected", async () => {
    // Arrange
    const ctrl = new DialogCtrl<SinData>()
    const savedPromise = ctrl.open()
    renderInBuilder(<SinFormDialog ctrl={ctrl} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    // Act
    fireEvent.change(within(dialog).getByLabelText(/^name$/i), { target: { value: "Test SIN" } })
    fireEvent.click(within(dialog).getByRole("button", { name: /^real$/i }))
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert
    const saved = await savedPromise
    expect(saved?.isReal).toBe(true)
  })
})
