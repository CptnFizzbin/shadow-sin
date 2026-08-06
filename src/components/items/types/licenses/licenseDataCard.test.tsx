import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { LicenseDataCard } from "./licenseDataCard.tsx"

const fakeLicense: LicenseData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "License: Ares Predator",
  itemType: ItemType.license,
  rating: 4,
}

const realLicense: LicenseData = {
  id: "00000000-0000-0000-0000-000000000002",
  name: "License: Legal Firearm",
  itemType: ItemType.license,
  rating: "real",
}

const renderLicenseCard = (license: LicenseData) => {
  const runnerStore = new RunnerDataStore(
    runnerDataFactory((runner) => ({ ...runner, gear: { [license.id]: license } })),
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
    expect(screen.getByText("4")).toBeDefined()
  })

  it("renders the license's own rating when it's a Real License", () => {
    // Arrange / Act
    renderLicenseCard(realLicense)

    // Assert
    expect(screen.getByText("real")).toBeDefined()
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    renderWithProviders(<LicenseDataCard license={fakeLicense} onOpen={onOpen} />)

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("offers an Edit quick action that calls onEdit", () => {
    // Arrange
    const onEdit = vi.fn()
    renderWithProviders(<LicenseDataCard license={fakeLicense} onEdit={onEdit} />)

    // Act
    fireEvent.contextMenu(screen.getByText("License: Ares Predator"))
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))

    // Assert
    expect(onEdit).toHaveBeenCalledOnce()
  })

  it("removing the license dispatches removeItem and updates the store", async () => {
    // Arrange
    const runnerStore = renderLicenseCard(fakeLicense)

    // Act
    fireEvent.contextMenu(screen.getByText("License: Ares Predator"))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    await waitFor(() => expect(runnerStore.getState().gear[fakeLicense.id]).toBeUndefined())
  })
})
