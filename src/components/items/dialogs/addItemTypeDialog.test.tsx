import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GearSection } from "#/components/runner/gearPage/gearSectionTypes.ts"
import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"
import type { AddItemSelection } from "#/system/items/addItemSelection.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { AddItemTypeDialog } from "./addItemTypeDialog.tsx"

describe("AddItemTypeDialog", () => {
  it("resolves immediately for a category with no subtype", async () => {
    // Arrange
    const ctrl = new DialogCtrl<AddItemSelection>()
    ctrl.open()
    renderWithProviders(<AddItemTypeDialog ctrl={ctrl} />)

    // Act
    fireEvent.click(screen.getByText(GearSection.Armor))

    // Assert
    await waitFor(async () => {
      expect(await ctrl.result()).toEqual({ section: GearSection.Armor })
    })
  })

  it("shows a subtype step for Weapons and resolves with the chosen weaponType", async () => {
    // Arrange
    const ctrl = new DialogCtrl<AddItemSelection>()
    ctrl.open()
    renderWithProviders(<AddItemTypeDialog ctrl={ctrl} />)

    // Act
    fireEvent.click(screen.getByText(GearSection.Weapons))
    fireEvent.click(screen.getByText("Firearm"))

    // Assert
    await waitFor(async () => {
      expect(await ctrl.result()).toEqual({ section: GearSection.Weapons, weaponType: WeaponType.firearm })
    })
  })

  it("shows a subtype step for Vehicles and resolves with the chosen vehicleCategory", async () => {
    // Arrange
    const ctrl = new DialogCtrl<AddItemSelection>()
    ctrl.open()
    renderWithProviders(<AddItemTypeDialog ctrl={ctrl} />)

    // Act
    fireEvent.click(screen.getByText(GearSection.Vehicles))
    fireEvent.click(screen.getByText("Drone"))

    // Assert
    await waitFor(async () => {
      expect(await ctrl.result()).toEqual({ section: GearSection.Vehicles, vehicleCategory: VehicleCategory.drone })
    })
  })

  it("shows a subtype step for Licenses and resolves with the chosen licenseKind", async () => {
    // Arrange
    const ctrl = new DialogCtrl<AddItemSelection>()
    ctrl.open()
    renderWithProviders(<AddItemTypeDialog ctrl={ctrl} />)

    // Act
    fireEvent.click(screen.getByText(GearSection.Licenses))
    fireEvent.click(screen.getByText("License"))

    // Assert
    await waitFor(async () => {
      expect(await ctrl.result()).toEqual({ section: GearSection.Licenses, licenseKind: "license" })
    })
  })

  it("returns to the category step when Back is clicked from a subtype step", () => {
    // Arrange
    const ctrl = new DialogCtrl<AddItemSelection>()
    ctrl.open()
    renderWithProviders(<AddItemTypeDialog ctrl={ctrl} />)

    // Act
    fireEvent.click(screen.getByText(GearSection.Weapons))
    fireEvent.click(screen.getByRole("button", { name: /back/i }))

    // Assert — every category is showing again, including ones the subtype step doesn't list
    expect(screen.getByText(GearSection.Armor)).toBeDefined()
  })

  it("resolves undefined when Cancel is clicked", async () => {
    // Arrange
    const ctrl = new DialogCtrl<AddItemSelection>()
    ctrl.open()
    renderWithProviders(<AddItemTypeDialog ctrl={ctrl} />)

    // Act
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }))

    // Assert
    expect(await ctrl.result()).toBeUndefined()
  })
})
