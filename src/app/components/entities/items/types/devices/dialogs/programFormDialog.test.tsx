import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { ProgramData } from "#/system/model/items/programData.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { ProgramFormDialog } from "./programFormDialog.tsx"

describe("ProgramFormDialog", () => {
  it("submits an item with ItemType.program", async () => {
    // Arrange
    const ctrl = new DialogCtrl<ProgramData>()
    ctrl.open()
    // ProgramFormDialog reads the gear store to populate the device dropdown,
    // so it needs the full RunnerDataProvider context.
    renderInBuilder(<ProgramFormDialog ctrl={ctrl} />)

    // Act
    fillNameAndClickSave("Exploit")

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toBe(ItemType.program)
    })
  })

  it("doesn't offer Agent as a Program Type", async () => {
    // Arrange
    const ctrl = new DialogCtrl<ProgramData>()
    ctrl.open()
    renderInBuilder(<ProgramFormDialog ctrl={ctrl} />)

    // Act: the Program Type select has no accessible name wired up, so find it by its default value.
    const programTypeSelect = screen.getAllByRole("combobox").find((combobox) => combobox.textContent === "Other")
    fireEvent.mouseDown(programTypeSelect!)

    // Assert
    const listbox = await screen.findByRole("listbox")
    expect(within(listbox).getByRole("option", { name: "Browse" })).toBeDefined()
    expect(within(listbox).queryByRole("option", { name: "Agent" })).toBeNull()
  })
})
