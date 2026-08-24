import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ArmorFormDialog } from "#/components/items/types/armor/dialogs/armorFormDialog.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { renderInBuilder, renderWithProviders } from "#testUtils/renderUtils.tsx"

const restrictedArmor: ArmorData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-0000000000a1",
  name: "Armor Jacket",
  itemType: ItemType.armor,
  ballistic: 6,
  impact: 4,
  availability: { rating: 8, restricted: true, forbidden: false },
}

const unrestrictedArmor: ArmorData = {
  ...restrictedArmor,
  id: "00000000-0000-0000-0000-0000000000a2",
  availability: { rating: 2, restricted: false, forbidden: false },
}

const fakeSin: SinData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000s01",
  name: "Fake SIN",
  itemType: ItemType.sin,
  rating: 4,
}

const existingLicense: LicenseData = {
  kind: EntityKind.item,
  id: "00000000-0000-0000-0000-00000000c001",
  name: "License: Armor Jacket",
  itemType: ItemType.license,
  rating: 4,
  items: { parentId: fakeSin.id, childIds: [] },
}

const secondLicense: LicenseData = {
  kind: EntityKind.item,
  id: "00000000-0000-0000-0000-00000000c002",
  name: "License: Other Gear",
  itemType: ItemType.license,
  rating: 2,
  items: { parentId: fakeSin.id, childIds: [] },
}

function getLastDialog() {
  const dialogs = screen.getAllByRole("dialog")
  return dialogs[dialogs.length - 1]
}

describe("GearFormLicenseSection (via ArmorFormDialog)", () => {
  it("renders nothing for a non-Restricted item", () => {
    // Arrange
    const ctrl = new DialogCtrl<ArmorData>()
    ctrl.open()

    // Act
    renderInBuilder(<ArmorFormDialog ctrl={ctrl} armor={unrestrictedArmor} />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ override: (r) => ({ ...r, gear: { [unrestrictedArmor.id]: unrestrictedArmor } }) })),
    })

    // Assert
    expect(screen.queryByText("License")).toBeNull()
  })

  it("shows an Add License trigger in the Builder for a Restricted, unlicensed item", () => {
    // Arrange
    const ctrl = new DialogCtrl<ArmorData>()
    ctrl.open()

    // Act
    renderInBuilder(<ArmorFormDialog ctrl={ctrl} armor={restrictedArmor} />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ override: (r) => ({ ...r, gear: { [restrictedArmor.id]: restrictedArmor } }) })),
    })

    // Assert
    expect(within(getLastDialog()).getByRole("button", { name: "Add License" })).toBeDefined()
  })

  it("shows an Acquire / Purchase License trigger in the Viewer for a Restricted, unlicensed item", () => {
    // Arrange
    const ctrl = new DialogCtrl<ArmorData>()
    ctrl.open()

    // Act
    renderWithProviders(<ArmorFormDialog ctrl={ctrl} armor={restrictedArmor} />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ override: (r) => ({ ...r, gear: { [restrictedArmor.id]: restrictedArmor } }) })),
    })

    // Assert
    expect(within(getLastDialog()).getByRole("button", { name: "Acquire / Purchase License" })).toBeDefined()
  })

  it("assigning an existing license from the gear form shows it as covered, with Change and Remove actions", async () => {
    // Arrange
    const ctrl = new DialogCtrl<ArmorData>()
    ctrl.open()
    renderInBuilder(<ArmorFormDialog ctrl={ctrl} armor={restrictedArmor} />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ override: (r) => ({
        ...r,
        gear: { [restrictedArmor.id]: restrictedArmor, [fakeSin.id]: fakeSin, [existingLicense.id]: existingLicense },
      }) })),
    })

    // Act
    fireEvent.click(within(getLastDialog()).getByRole("button", { name: "Add License" }))
    const assignDialog = getLastDialog()
    fireEvent.click(within(assignDialog).getByRole("button", { name: "Assign" }))

    // Assert
    await waitFor(() => {
      expect(within(getLastDialog()).getByText(existingLicense.name)).toBeDefined()
    })
    expect(within(getLastDialog()).getByRole("button", { name: "Change" })).toBeDefined()
    expect(within(getLastDialog()).getByRole("button", { name: "Remove" })).toBeDefined()
  })

  it("removing an assigned license unlinks it and reverts to the unlicensed state", async () => {
    // Arrange
    const licensedArmor: ArmorData = { ...restrictedArmor, licenseId: existingLicense.id }
    const ctrl = new DialogCtrl<ArmorData>()
    ctrl.open()
    renderInBuilder(<ArmorFormDialog ctrl={ctrl} armor={licensedArmor} />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ override: (r) => ({
        ...r,
        gear: { [licensedArmor.id]: licensedArmor, [fakeSin.id]: fakeSin, [existingLicense.id]: existingLicense },
      }) })),
    })
    expect(within(getLastDialog()).getByText(existingLicense.name)).toBeDefined()

    // Act
    fireEvent.click(within(getLastDialog()).getByRole("button", { name: "Remove" }))

    // Assert: the item is unlinked, not the license itself — only this item's covered-state reverts.
    await waitFor(() => {
      expect(within(getLastDialog()).getByRole("button", { name: "Add License" })).toBeDefined()
    })
  })

  it("changing to a different existing license reassigns coverage", async () => {
    // Arrange
    const licensedArmor: ArmorData = { ...restrictedArmor, licenseId: existingLicense.id }
    const ctrl = new DialogCtrl<ArmorData>()
    ctrl.open()
    renderInBuilder(<ArmorFormDialog ctrl={ctrl} armor={licensedArmor} />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ override: (r) => ({
        ...r,
        gear: {
          [licensedArmor.id]: licensedArmor,
          [fakeSin.id]: fakeSin,
          [existingLicense.id]: existingLicense,
          [secondLicense.id]: secondLicense,
        },
      }) })),
    })

    // Act
    fireEvent.click(within(getLastDialog()).getByRole("button", { name: "Change" }))
    const changeDialog = getLastDialog()
    fireEvent.mouseDown(within(changeDialog).getByRole("combobox"))
    fireEvent.click(screen.getByRole("option", { name: new RegExp(secondLicense.name) }))
    fireEvent.click(within(changeDialog).getByRole("button", { name: "Assign" }))

    // Assert
    await waitFor(() => {
      expect(within(getLastDialog()).getByText(secondLicense.name)).toBeDefined()
    })
    expect(within(getLastDialog()).queryByText(existingLicense.name)).toBeNull()
  })
})
