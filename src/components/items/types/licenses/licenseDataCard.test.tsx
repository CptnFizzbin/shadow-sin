import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { LicenseDataCard } from "./licenseDataCard.tsx"

const fakeLicense: LicenseData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: crypto.randomUUID(),
  name: "License: Ares Predator",
  itemType: ItemType.license,
  rating: 4,
}

const realLicense: LicenseData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: crypto.randomUUID(),
  name: "License: Legal Firearm",
  itemType: ItemType.license,
  rating: "real",
}

const renderLicenseCard = (license: LicenseData) => {
  const runnerStore = new RunnerDataStore(
    runnerDataFactory({ override: (runner) => ({ ...runner, gear: { [license.id]: license } }) }),
  )
  renderWithProviders(<LicenseDataCard license={license} />, { runnerStore })
  return runnerStore
}

describe("LicenseDataCard", () => {
  it("renders the license's own numeric rating on itself", () => {
    // Arrange / Act
    renderLicenseCard(fakeLicense)

    // Assert
    expect(screen.getByText("License: Ares Predator")).toBeDefined()
    expect(screen.getByText("Rating: 4")).toBeDefined()
  })

  it("renders the license's own rating when it's a Real License", () => {
    // Arrange / Act
    renderLicenseCard(realLicense)

    // Assert
    expect(screen.getByText("Rating: real")).toBeDefined()
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    renderWithProviders(<LicenseDataCard license={fakeLicense} onOpen={onOpen} />)

    // Act
    fireEvent.click(screen.getByText("License: Ares Predator"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("offers an Edit action that calls onEdit", () => {
    // Arrange
    const onEdit = vi.fn()
    renderWithProviders(<LicenseDataCard license={fakeLicense} onEdit={onEdit} />)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))

    // Assert
    expect(onEdit).toHaveBeenCalledOnce()
  })

  it("removing the license dispatches removeItem and updates the store", async () => {
    // Arrange
    const runnerStore = renderLicenseCard(fakeLicense)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    await waitFor(() => expect(getItemCatalog(runnerStore.getState())[fakeLicense.id]).toBeUndefined())
  })
})
