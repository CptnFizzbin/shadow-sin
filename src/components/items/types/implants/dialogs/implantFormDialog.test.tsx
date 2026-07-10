import { waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"
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
})
