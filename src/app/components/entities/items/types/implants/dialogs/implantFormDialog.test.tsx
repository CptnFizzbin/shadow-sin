import { screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import type { ImplantData } from "#/system/model/items/implantData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { ImplantFormDialog } from "./implantFormDialog.tsx"

describe("ImplantFormDialog", () => {
  it("submits an item with ItemType.implant", async () => {
    // Arrange
    const ctrl = new DialogCtrl<ImplantData>()
    ctrl.open()
    renderInBuilder(<ImplantFormDialog ctrl={ctrl} />)

    // Act
    fillNameAndClickSave("Wired Reflexes 1")

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toBe(ItemType.implant)
    })
  })

  it("hides the carry status choice, since an implant can't be unequipped", () => {
    // Arrange
    const ctrl = new DialogCtrl<ImplantData>()
    ctrl.open()

    // Act
    renderInBuilder(<ImplantFormDialog ctrl={ctrl} />)

    // Assert
    expect(screen.queryByRole("group", { name: "Carry status" })).toBeNull()
  })

  it("puts the implant's Type directly after its Name", () => {
    // Arrange
    const ctrl = new DialogCtrl<ImplantData>()
    ctrl.open()

    // Act
    renderInBuilder(<ImplantFormDialog ctrl={ctrl} />)

    // Assert
    const name = screen.getByLabelText(/^name$/i)
    // MUI selects carry no accessible name here, so locate them by their visible labels.
    const type = screen.getByText("Type", { selector: "label" })
    const rating = screen.getByLabelText(/^rating$/i)
    const grade = screen.getByText("Grade", { selector: "label" })
    expect(name.compareDocumentPosition(type) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(type.compareDocumentPosition(rating) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(rating.compareDocumentPosition(grade) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
