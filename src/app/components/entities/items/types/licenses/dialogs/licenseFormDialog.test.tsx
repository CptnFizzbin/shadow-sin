import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityKind } from "#data/entities/entityKind.ts"
import { ItemType } from "#data/items/itemType.ts"
import type { LicenseData } from "#data/items/licenseData.ts"
import type { SinData } from "#data/items/sinData.ts"
import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import { DialogCtrl } from "#forms/dialog/dialogCtrl.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { LicenseFormDialog } from "./licenseFormDialog.tsx"

const fakeSin: SinData = {
  kind: EntityKind.item,
  items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "National ID (Fake)",
  itemType: ItemType.sin,
  isReal: false,
  rating: 4,
}

describe("LicenseFormDialog", () => {
  it("refuses to save a license that isn't attached to a SIN", async () => {
    // Arrange
    const ctrl = new DialogCtrl<LicenseData>()
    const closeSpy = vi.spyOn(ctrl, "close")
    ctrl.open()
    renderInBuilder(<LicenseFormDialog ctrl={ctrl} />, {
      runner: runnerDataFactory({ items: { [fakeSin.id]: fakeSin } }),
    })
    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    fireEvent.change(within(dialog).getByLabelText(/^name$/i), { target: { value: "Firearms" } })

    // Act
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert
    expect(await within(dialog).findByText("SIN is required")).toBeDefined()
    expect(closeSpy).not.toHaveBeenCalled()
  })

  it("keeps the Add License wizard on the Stats step until a SIN is chosen", async () => {
    // Arrange
    const ctrl = new DialogCtrl<LicenseData>()
    ctrl.open()
    renderInBuilder(<LicenseFormDialog ctrl={ctrl} wizard />, {
      runner: runnerDataFactory({ items: { [fakeSin.id]: fakeSin } }),
    })
    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    fireEvent.change(within(dialog).getByLabelText(/^name$/i), { target: { value: "Firearms" } })

    // Act
    fireEvent.click(within(dialog).getByRole("button", { name: /next/i }))

    // Assert
    expect(await within(dialog).findByText("SIN is required")).toBeDefined()
    expect(within(dialog).getByLabelText(/^name$/i)).toBeDefined()
  })

  it("saves a license attached to the given SIN", async () => {
    // Arrange
    const ctrl = new DialogCtrl<LicenseData>()
    const savedPromise = ctrl.open()
    renderInBuilder(<LicenseFormDialog ctrl={ctrl} sin={fakeSin} />, {
      runner: runnerDataFactory({ items: { [fakeSin.id]: fakeSin } }),
    })
    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    fireEvent.change(within(dialog).getByLabelText(/^name$/i), { target: { value: "Firearms" } })

    // Act
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert
    const saved = await savedPromise
    await waitFor(() => expect(saved?.items.parentId).toBe(fakeSin.id))
  })
})
