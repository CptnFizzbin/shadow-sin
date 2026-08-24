import { fireEvent, screen, waitFor } from "@testing-library/react"
import type { FC } from "react"
import { describe, expect, it, vi } from "vitest"

import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { VehicleDataCard } from "./vehicleDataCard.tsx"

const car: VehicleData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: crypto.randomUUID(),
  name: "Americar",
  itemType: ItemType.vehicle,
  vehicleCategory: VehicleCategory.vehicle,
  vehicleType: "Car",
  handling: 4,
  accel: "2/4",
  pilot: 1,
  speed: 4,
  body: 4,
  armor: 6,
  sensor: 3,
}

const mod: ItemData = {
  kind: EntityKind.item,
  id: crypto.randomUUID(),
  name: "Anti-Theft System",
  itemType: ItemType.other,
  items: { parentId: car.id, childIds: [] },
}

const carWithMod: VehicleData = { ...car, items: { ...car.items, childIds: [mod.id] } }

const renderVehicleCard = (vehicle: VehicleData, extraGear: Record<string, ItemData> = {}, onOpen?: () => void) =>
  renderWithRunner(<VehicleDataCard vehicle={vehicle} onOpen={onOpen} />, { [vehicle.id]: vehicle, ...extraGear })

interface RemovableVehicleCardProps {
  vehicleId: VehicleData["id"]
}

/**
 * Stops rendering `VehicleDataCard` once its vehicle is gone from the store — the same guard
 * every real caller gets for free by mapping over the store's vehicle list. A `VehicleDataCard`
 * kept mounted with a `vehicle.id` no longer in gear would otherwise re-run its own
 * `selectChildrenOf` selector against a missing parent and throw.
 */
const RemovableVehicleCard: FC<RemovableVehicleCardProps> = ({ vehicleId }) => {
  const vehicle = useRunnerStoreSelector(Selectors.gear.selectById(vehicleId)) as VehicleData | undefined
  return vehicle ? <VehicleDataCard vehicle={vehicle} /> : null
}

const renderRemovableVehicleCard = (vehicle: VehicleData, extraGear: Record<string, ItemData> = {}) =>
  renderWithRunner(<RemovableVehicleCard vehicleId={vehicle.id} />, { [vehicle.id]: vehicle, ...extraGear })

describe("VehicleDataCard", () => {
  it("renders the vehicle's type as its SubType, and its stat block", () => {
    // Arrange / Act
    renderVehicleCard(car)

    // Assert
    expect(screen.getByText("Americar")).toBeDefined()
    expect(screen.getByText("Car")).toBeDefined()
    expect(screen.getByText("Handling: 4")).toBeDefined()
    expect(screen.getByText("Accel: 2/4")).toBeDefined()
    expect(screen.getByText("Speed: 4")).toBeDefined()
    expect(screen.getByText("Armor: 6")).toBeDefined()
    expect(screen.getByText("Body: 4")).toBeDefined()
  })

  it("renders the damage track sized off Body, using 8 + Ceil(Body / 2)", () => {
    // Arrange / Act
    renderVehicleCard(car)

    // Assert
    expect(screen.getByText("Damage 0/10")).toBeDefined()
  })

  it("toggling a damage box dispatches setItem and updates the store", () => {
    // Arrange: `VehicleDataCard` renders off its `vehicle` prop, not a live store read, so the
    // reactive wrapper is needed here to see the post-dispatch damage value re-rendered.
    const runnerStore = renderRemovableVehicleCard(car)

    // Act: the "-1" wound-marker cell is the 3rd box, filling boxes 1-3.
    fireEvent.click(screen.getByRole("button", { name: "-1" }))

    // Assert
    expect(screen.getByText("Damage 3/10")).toBeDefined()
    expect((getItemCatalog(runnerStore.getState())[car.id] as VehicleData).damage?.physical).toBe(3)
  })

  it("renders attached mods as nested subitems", () => {
    // Arrange / Act
    renderVehicleCard(carWithMod, { [mod.id]: mod })

    // Assert
    expect(screen.getByText("Anti-Theft System")).toBeDefined()
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    renderVehicleCard(car, {}, onOpen)

    // Act: click the name — the card itself has no accessible name of its own, and its
    // damage-track cells are also role="button", so clicking the title text (which bubbles to
    // the card's onClick) is the unambiguous way to trigger onOpen.
    fireEvent.click(screen.getByText("Americar"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("removing the vehicle dispatches removeItem for it and its mods", async () => {
    // Arrange
    const runnerStore = renderRemovableVehicleCard(carWithMod, { [mod.id]: mod })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    await waitFor(() => expect(getItemCatalog(runnerStore.getState())[carWithMod.id]).toBeUndefined())
    expect(getItemCatalog(runnerStore.getState())[mod.id]).toBeUndefined()
  })
})
