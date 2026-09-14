import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import type { VehicleData } from "#/system/model/items/vehicleData.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { VehicleFormDialog } from "./vehicleFormDialog.tsx"

describe("VehicleFormDialog", () => {
  it("accepts a negative Handling rating", async () => {
    // Arrange
    const ctrl = new DialogCtrl<VehicleData>()
    ctrl.open()
    renderInBuilder(<VehicleFormDialog ctrl={ctrl} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    // Act
    fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
      target: { value: "Barge" },
    })
    fireEvent.change(within(dialog).getByLabelText(/^handling$/i), {
      target: { value: "-2" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.name).toBe("Barge")
      expect(savedItem?.handling).toBe(-2)
    })
  })
})
