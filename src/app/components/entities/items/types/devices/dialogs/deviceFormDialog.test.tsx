import { waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import type { DeviceData } from "#/data/items/deviceData.ts"
import { ItemType } from "#/data/items/itemType.ts"
import { DialogCtrl } from "#/forms/dialog/dialogCtrl.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { DeviceFormDialog } from "./deviceFormDialog.tsx"

describe("DeviceFormDialog", () => {
  it("submits an item with ItemType.device", async () => {
    // Arrange
    const ctrl = new DialogCtrl<DeviceData>()
    ctrl.open()
    renderInBuilder(<DeviceFormDialog ctrl={ctrl} />)

    // Act
    fillNameAndClickSave("Renraku Sensei")

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toBe(ItemType.device)
    })
  })
})
