import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { LicenseData } from "#/system/model/items/licenseData.ts"
import type { SinData } from "#/system/model/items/sinData.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { SinsAndLicensesSection } from "./sinsAndLicensesSection.tsx"

const fakeSin: SinData = {
  kind: EntityKind.item,
  items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "National ID (Fake)",
  itemType: ItemType.sin,
  isReal: false,
  rating: 4,
}

const unattachedLicense: LicenseData = {
  kind: EntityKind.item,
  items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000002",
  name: "Firearms License",
  itemType: ItemType.license,
  isReal: false,
  rating: 3,
}

describe("SinsAndLicensesSection", () => {
  it("shows licenses that aren't attached to a SIN", () => {
    // Arrange / Act
    renderInBuilder(<SinsAndLicensesSection />, {
      runner: runnerDataFactory({ items: { [unattachedLicense.id]: unattachedLicense } }),
    })

    // Assert
    expect(screen.getByText("Firearms License")).toBeDefined()
  })

  it("shows a license whose SIN no longer exists", () => {
    // Arrange
    const orphanedLicense: LicenseData = {
      ...unattachedLicense,
      items: { parentId: "00000000-0000-0000-0000-0000000000ff", childIds: [] },
    }

    // Act
    renderInBuilder(<SinsAndLicensesSection />, {
      runner: runnerDataFactory({ items: { [orphanedLicense.id]: orphanedLicense } }),
    })

    // Assert
    expect(screen.getByText("Firearms License")).toBeDefined()
  })

  it("shows SINs from the store", () => {
    // Arrange / Act
    renderInBuilder(<SinsAndLicensesSection />, {
      runner: runnerDataFactory({ items: { [fakeSin.id]: fakeSin } }),
    })

    // Assert
    expect(screen.getByText("National ID (Fake)")).toBeDefined()
  })

  it("removing a SIN with no licenses dispatches removeItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<SinsAndLicensesSection />, {
      runner: runnerDataFactory({ items: { [fakeSin.id]: fakeSin } }),
    })
    expect(screen.getByText("National ID (Fake)")).toBeDefined()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert: the UI re-rendered off the updated store (SIN with no licenses removes without confirming).
    await waitFor(() => expect(screen.queryByText("National ID (Fake)")).toBeNull())
  })
})
