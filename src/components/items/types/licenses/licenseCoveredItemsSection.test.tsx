import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { LicenseFormDialog } from "./dialogs/licenseFormDialog.tsx"

const license: LicenseData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-00000000d001",
  name: "License: Ares Predator",
  itemType: ItemType.license,
  isReal: false,
  rating: 4,
}

const otherLicense: LicenseData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-00000000d002",
  name: "License: Other Gear",
  itemType: ItemType.license,
  isReal: false,
  rating: 2,
}

const coveredItem: ArmorData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-00000000d101",
  name: "Ares Predator #1",
  itemType: ItemType.armor,
  ballistic: 0,
  impact: 0,
  availability: { rating: 6, restricted: true, forbidden: false },
  licenseId: license.id,
}

const unlicensedItem: ArmorData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-00000000d102",
  name: "Ares Predator #2",
  itemType: ItemType.armor,
  ballistic: 0,
  impact: 0,
  availability: { rating: 6, restricted: true, forbidden: false },
}

const itemLicensedElsewhere: ArmorData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-00000000d103",
  name: "Ares Predator #3",
  itemType: ItemType.armor,
  ballistic: 0,
  impact: 0,
  availability: { rating: 6, restricted: true, forbidden: false },
  licenseId: otherLicense.id,
}

function getLastDialog() {
  const dialogs = screen.getAllByRole("dialog")
  return dialogs[dialogs.length - 1]
}

describe("LicenseCoveredItemsSection (via LicenseFormDialog)", () => {
  it("shows a message when the license covers no items yet", () => {
    // Arrange / Act
    const ctrl = new DialogCtrl<LicenseData>()
    ctrl.open()
    renderInBuilder(<LicenseFormDialog ctrl={ctrl} license={license} />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [license.id]: license } })),
    })

    // Assert
    expect(within(getLastDialog()).getByText(/doesn't cover any items yet/i)).toBeDefined()
  })

  it("shows the items currently covered by this license", () => {
    // Arrange / Act
    const ctrl = new DialogCtrl<LicenseData>()
    ctrl.open()
    renderInBuilder(<LicenseFormDialog ctrl={ctrl} license={license} />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [license.id]: license, [coveredItem.id]: coveredItem } })),
    })

    // Assert
    expect(within(getLastDialog()).getByText(coveredItem.name)).toBeDefined()
  })

  it("removing a covered item unlinks it", async () => {
    // Arrange
    const ctrl = new DialogCtrl<LicenseData>()
    ctrl.open()
    renderInBuilder(<LicenseFormDialog ctrl={ctrl} license={license} />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [license.id]: license, [coveredItem.id]: coveredItem } })),
    })

    // Act
    fireEvent.click(within(getLastDialog()).getByRole("button", { name: "Remove" }))

    // Assert
    await waitFor(() => {
      expect(within(getLastDialog()).getByText(/doesn't cover any items yet/i)).toBeDefined()
    })
  })

  it("adds an unlicensed item to the license, grouped separately from items covered elsewhere", async () => {
    // Arrange
    const ctrl = new DialogCtrl<LicenseData>()
    ctrl.open()
    renderInBuilder(<LicenseFormDialog ctrl={ctrl} license={license} />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: {
        [license.id]: license,
        [otherLicense.id]: otherLicense,
        [unlicensedItem.id]: unlicensedItem,
        [itemLicensedElsewhere.id]: itemLicensedElsewhere,
      } })),
    })

    // Act
    fireEvent.click(within(getLastDialog()).getByRole("button", { name: "Add Item" }))
    const addDialog = getLastDialog()
    fireEvent.mouseDown(within(addDialog).getByRole("combobox"))

    // Assert: the listbox groups candidates by whether they're already covered elsewhere.
    expect(screen.getByText("Unlicensed")).toBeDefined()
    expect(screen.getByText("Covered by another license")).toBeDefined()

    fireEvent.click(screen.getByRole("option", { name: unlicensedItem.name }))
    fireEvent.click(within(addDialog).getByRole("button", { name: "Add" }))

    // Assert
    await waitFor(() => {
      expect(within(getLastDialog()).getByText(unlicensedItem.name)).toBeDefined()
    })
  })

  it("silently moves an item already covered by a different license when added here", async () => {
    // Arrange
    const ctrl = new DialogCtrl<LicenseData>()
    ctrl.open()
    renderInBuilder(<LicenseFormDialog ctrl={ctrl} license={license} />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: {
        [license.id]: license,
        [otherLicense.id]: otherLicense,
        [itemLicensedElsewhere.id]: itemLicensedElsewhere,
      } })),
    })

    // Act
    fireEvent.click(within(getLastDialog()).getByRole("button", { name: "Add Item" }))
    const addDialog = getLastDialog()
    fireEvent.mouseDown(within(addDialog).getByRole("combobox"))
    fireEvent.click(screen.getByRole("option", { name: itemLicensedElsewhere.name }))
    fireEvent.click(within(addDialog).getByRole("button", { name: "Add" }))

    // Assert: now covered by `license`, no longer needing to be excluded as "elsewhere"
    await waitFor(() => {
      expect(within(getLastDialog()).getByText(itemLicensedElsewhere.name)).toBeDefined()
    })
  })
})
