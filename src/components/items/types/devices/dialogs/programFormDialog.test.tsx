import { waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { ProgramFormDialog } from "./programFormDialog.tsx"

describe("ProgramFormDialog", () => {
  it("submits an item with ItemType.program", async () => {
    // Arrange
    const ctrl = new DialogCtrl<ProgramData>()
    ctrl.open()
    // ProgramFormDialog reads the gear store to populate the device dropdown,
    // so it needs the full CharacterSheetProvider context.
    renderInBuilder(<ProgramFormDialog ctrl={ctrl} />)

    // Act
    fillNameAndClickSave("Exploit")

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toEqual([ItemType.program])
    })
  })
})
