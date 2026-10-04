import { fireEvent, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { toRunnerData } from "#/state/toRunnerData.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { LicenseData } from "#/system/model/items/licenseData.ts"
import type { SinData } from "#/system/model/items/sinData.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { getItemCatalog } from "#/system/model/runnerTraits.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { LicenseCheckProvider } from "./licenseCheckContext.tsx"
import { LicenseCheckSetupView } from "./licenseCheckSetupView.tsx"

const alphaSinId = "00000000-0000-0000-0000-000000000001" as UUID
const betaSinId = "00000000-0000-0000-0000-000000000002" as UUID
const alphaLicenseId = "00000000-0000-0000-0000-000000000011" as UUID
const betaLicenseId = "00000000-0000-0000-0000-000000000012" as UUID
const pistolId = "00000000-0000-0000-0000-000000000021" as UUID
const rifleId = "00000000-0000-0000-0000-000000000022" as UUID
const grenadeId = "00000000-0000-0000-0000-000000000023" as UUID
const rocketId = "00000000-0000-0000-0000-000000000024" as UUID

const noChildren = { parentId: null, childIds: [] }

function makeSin(id: UUID, name: string): SinData {
  return { kind: EntityKind.item, items: noChildren, id, name, itemType: ItemType.sin, isReal: false, rating: 3 }
}

function makeLicense(id: UUID, name: string, sinId: UUID): LicenseData {
  return { kind: EntityKind.item, items: { parentId: sinId, childIds: [] }, id, name, itemType: ItemType.license, isReal: false, rating: 3 }
}

function makeRestricted(id: UUID, name: string, licenseId?: UUID): ItemData {
  return { kind: EntityKind.item, items: noChildren, id, name, itemType: ItemType.weapon, availability: { rating: 6, restricted: true }, licenseId }
}

function renderSetupView() {
  const items: ItemData[] = [
    makeSin(alphaSinId, "Alpha SIN"),
    makeSin(betaSinId, "Beta SIN"),
    makeLicense(alphaLicenseId, "Alpha Permit", alphaSinId),
    makeLicense(betaLicenseId, "Beta Permit", betaSinId),
    makeRestricted(pistolId, "Ares Predator", alphaLicenseId),
    makeRestricted(rifleId, "Ares Alpha", betaLicenseId),
    makeRestricted(grenadeId, "Frag Grenade"),
    { ...makeRestricted(rocketId, "Stinger Rocket"), availability: { rating: 20, forbidden: true } },
  ]

  return renderWithProviders(
    <LicenseCheckProvider><LicenseCheckSetupView /></LicenseCheckProvider>,
    {
      runner: runnerDataFactory({ afterBuild: (sheet) => {
        for (const item of items) getItemCatalog(sheet)[item.id] = item
      } }),
    },
  )
}

const lane = (name: string) => within(screen.getByRole("group", { name }))

describe("LicenseCheckSetupView — a Runner with multiple SINs and licensed gear", () => {
  it("shows every SIN, selecting the first as the active one via a radio button", () => {
    // Arrange / Act
    renderSetupView()

    // Assert
    const alphaRadio = screen.getByRole("radio", { name: "Active SIN: Alpha SIN" }) as HTMLInputElement
    const betaRadio = screen.getByRole("radio", { name: "Active SIN: Beta SIN" }) as HTMLInputElement
    expect(screen.getAllByRole("radio", { name: /^Active SIN:/ })).toHaveLength(2)
    expect(alphaRadio.checked).toBe(true)
    expect(betaRadio.checked).toBe(false)
  })

  it("lists each item's license-covered gear under the SIN its license is linked to", () => {
    // Arrange / Act
    renderSetupView()

    // Assert
    expect(lane("SIN: Alpha SIN").getByText("Ares Predator")).toBeTruthy()
    expect(lane("SIN: Alpha SIN").queryByText("Ares Alpha")).toBeNull()
    expect(lane("SIN: Beta SIN").getByText("Ares Alpha")).toBeTruthy()
    expect(lane("SIN: Beta SIN").queryByText("Ares Predator")).toBeNull()
  })

  it("shows unlicensed restricted items — including those tied to an inactive SIN's license — as a minor warning", () => {
    // Arrange / Act
    renderSetupView()

    // Assert
    const unlicensed = lane("Unlicensed Gear")
    expect(unlicensed.getByRole("alert").className).toContain("MuiAlert-colorWarning")
    expect(unlicensed.getByText("Frag Grenade")).toBeTruthy()
    expect(unlicensed.getByText("Ares Alpha")).toBeTruthy()
    expect(unlicensed.queryByText("Ares Predator")).toBeNull()
  })

  it("shows forbidden items as a major warning", () => {
    // Arrange / Act
    renderSetupView()

    // Assert
    const forbidden = lane("Forbidden Gear")
    expect(forbidden.getByRole("alert").className).toContain("MuiAlert-colorError")
    expect(forbidden.getByText("Stinger Rocket")).toBeTruthy()
  })

  it("re-evaluates which gear is unlicensed when a different SIN is made active", () => {
    // Arrange
    renderSetupView()

    // Act
    fireEvent.click(screen.getByRole("radio", { name: "Active SIN: Beta SIN" }))

    // Assert
    expect((screen.getByRole("radio", { name: "Active SIN: Beta SIN" }) as HTMLInputElement).checked).toBe(true)
    const unlicensed = lane("Unlicensed Gear")
    expect(unlicensed.getByText("Ares Predator")).toBeTruthy()
    expect(unlicensed.getByText("Frag Grenade")).toBeTruthy()
    expect(unlicensed.queryByText("Ares Alpha")).toBeNull()
  })

  it("stashes every unlicensed and forbidden item, leaving licensed gear carried", () => {
    // Arrange
    const store = renderSetupView()

    // Act
    fireEvent.click(screen.getByRole("button", { name: /stash all unlicensed and forbidden/i }))

    // Assert
    const catalog = getItemCatalog(toRunnerData(store.getState()))
    expect(catalog[grenadeId].stashed).toBe(true)
    expect(catalog[rifleId].stashed).toBe(true)
    expect(catalog[rocketId].stashed).toBe(true)
    expect(catalog[pistolId].stashed).toBeFalsy()
    expect(screen.queryByRole("group", { name: "Unlicensed Gear" })).toBeNull()
    expect(screen.queryByRole("group", { name: "Forbidden Gear" })).toBeNull()
    expect(screen.queryByRole("button", { name: /stash all unlicensed and forbidden/i })).toBeNull()
  })
})
