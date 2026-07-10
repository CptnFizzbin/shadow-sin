import { waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { ItemFormDialog } from "./itemFormDialog.tsx"

describe("ItemFormDialog", () => {
  it("submits a vehicle item when itemType=vehicle", async () => {
    // Arrange
    const ctrl = new DialogCtrl<ItemData>()
    ctrl.open()
    renderInBuilder(<ItemFormDialog ctrl={ctrl} itemType={ItemType.vehicle} label="Vehicle" />)

    // Act
    fillNameAndClickSave("Eurocar Westwind 2000")

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toBe(ItemType.vehicle)
      expect(savedItem?.name).toBe("Eurocar Westwind 2000")
    })
  })

  it("submits an armor item when itemType=armor", async () => {
    // Arrange
    const ctrl = new DialogCtrl<ItemData>()
    ctrl.open()
    renderInBuilder(<ItemFormDialog ctrl={ctrl} itemType={ItemType.armor} label="Armor" />)

    // Act
    fillNameAndClickSave("Armor Vest")

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toBe(ItemType.armor)
    })
  })

  it("submits a misc (other) item when no itemType is provided", async () => {
    // Arrange
    const ctrl = new DialogCtrl<ItemData>()
    ctrl.open()
    renderInBuilder(<ItemFormDialog ctrl={ctrl} label="Item" />)

    // Act
    fillNameAndClickSave("Random Gear")

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toBe(ItemType.other)
    })
  })

  it("submits an explicit misc item when itemType=other", async () => {
    // Arrange
    const ctrl = new DialogCtrl<ItemData>()
    ctrl.open()
    renderInBuilder(<ItemFormDialog ctrl={ctrl} itemType={ItemType.other} label="Item" />)

    // Act
    fillNameAndClickSave("Misc Item")

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toBe(ItemType.other)
    })
  })
})
