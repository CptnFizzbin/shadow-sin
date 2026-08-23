import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { SinDataCard } from "./sinDataCard.tsx"

const fakeSin: SinData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: crypto.randomUUID(),
  name: "National ID (Fake)",
  itemType: ItemType.sin,
  rating: 4,
}

const realSin: SinData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: crypto.randomUUID(),
  name: "Real SIN",
  itemType: ItemType.sin,
  rating: "real",
}

const coveredLicense: LicenseData = {
  kind: EntityKind.item,
  id: crypto.randomUUID(),
  name: "License: Ares Predator",
  itemType: ItemType.license,
  rating: 4,
  items: { parentId: fakeSin.id, childIds: [] },
}

const sinWithLicense: SinData = { ...fakeSin, items: { ...fakeSin.items, childIds: [coveredLicense.id] } }

/** `SinDataCard` reads its own covered licenses from the store via `sin.id`, so every render needs the SIN itself seeded into gear. */
const renderSinCard = (sin: SinData, extraGear: Record<string, LicenseData> = {}, onOpen?: () => void) => {
  const runnerStore = new RunnerDataStore(
    runnerDataFactory((runner) => ({ ...runner, gear: { [sin.id]: sin, ...extraGear } })),
  )
  renderWithProviders(<SinDataCard sin={sin} onOpen={onOpen} />, { runnerStore })
  return runnerStore
}

/**
 * Stops rendering `SinDataCard` once its SIN is gone from the store — the same guard every real
 * caller (e.g. `SinsAndLicensesSection`) gets for free by mapping over the store's SIN list.
 * A `SinDataCard` kept mounted with a `sin.id` no longer in gear would otherwise re-run its own
 * `selectChildrenOf` selector against a missing parent and throw.
 */
const RemovableSinCard = ({ sinId }: { sinId: SinData["id"] }) => {
  const sin = useRunnerStoreSelector(Selectors.gear.selectById(sinId)) as SinData | undefined
  return sin ? <SinDataCard sin={sin} /> : null
}

const renderRemovableSinCard = (sin: SinData, extraGear: Record<string, LicenseData> = {}) => {
  const runnerStore = new RunnerDataStore(
    runnerDataFactory((runner) => ({ ...runner, gear: { [sin.id]: sin, ...extraGear } })),
  )
  renderWithProviders(<RemovableSinCard sinId={sin.id} />, { runnerStore })
  return runnerStore
}

describe("SinDataCard", () => {
  it("renders the SIN's own rating on itself", () => {
    // Arrange / Act
    renderSinCard(fakeSin)

    // Assert
    expect(screen.getByText("National ID (Fake)")).toBeDefined()
    expect(screen.getByText("Rating: 4")).toBeDefined()
  })

  it("renders the SIN's own rating when it's a Real SIN", () => {
    // Arrange / Act
    renderSinCard(realSin)

    // Assert
    expect(screen.getByText("Rating: real")).toBeDefined()
  })

  it("renders covered licenses as nested subitems with their own rating", () => {
    // Arrange / Act
    renderSinCard(sinWithLicense, { [coveredLicense.id]: coveredLicense })

    // Assert
    const licenseRow = screen.getByText("License: Ares Predator").parentElement
    expect(licenseRow).not.toBeNull()
    expect(within(licenseRow!).getByText("Rating: 4")).toBeDefined()
  })

  it("removing a SIN with no licenses dispatches removeItem without confirming", async () => {
    // Arrange
    const runnerStore = renderRemovableSinCard(fakeSin)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    await waitFor(() => expect(getItemCatalog(runnerStore.getState())[fakeSin.id]).toBeUndefined())
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("removing a SIN with licenses asks for confirmation first", async () => {
    // Arrange
    const runnerStore = renderRemovableSinCard(sinWithLicense, { [coveredLicense.id]: coveredLicense })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    expect(await screen.findByRole("dialog")).toBeDefined()
    expect(getItemCatalog(runnerStore.getState())[sinWithLicense.id]).toBeDefined()

    // Act: confirm
    fireEvent.click(screen.getByRole("button", { name: "Remove SIN" }))

    // Assert
    await waitFor(() => expect(getItemCatalog(runnerStore.getState())[sinWithLicense.id]).toBeUndefined())
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    renderSinCard(fakeSin, {}, onOpen)

    // Act
    fireEvent.click(screen.getByText("National ID (Fake)"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })
})
