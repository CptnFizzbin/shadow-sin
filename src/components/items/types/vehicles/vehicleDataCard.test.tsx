import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { VehicleDataCard } from "./vehicleDataCard.tsx"

const car: VehicleData = {
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
  id: crypto.randomUUID(),
  name: "Anti-Theft System",
  itemType: ItemType.other,
  parentId: car.id,
}

const carWithMod: VehicleData = { ...car, childIds: [mod.id] }

const renderVehicleCard = (vehicle: VehicleData, extraGear: Record<string, ItemData> = {}, onOpen?: () => void) => {
  const runnerStore = new RunnerDataStore(
    runnerDataFactory((runner) => ({ ...runner, gear: { [vehicle.id]: vehicle, ...extraGear } })),
  )
  renderWithProviders(<VehicleDataCard vehicle={vehicle} onOpen={onOpen} />, { runnerStore })
  return runnerStore
}

/**
 * Stops rendering `VehicleDataCard` once its vehicle is gone from the store — the same guard
 * every real caller gets for free by mapping over the store's vehicle list. A `VehicleDataCard`
 * kept mounted with a `vehicle.id` no longer in gear would otherwise re-run its own
 * `selectChildrenOf` selector against a missing parent and throw.
 */
const RemovableVehicleCard = ({ vehicleId }: { vehicleId: VehicleData["id"] }) => {
  const vehicle = useRunnerStoreSelector(Selectors.gear.selectById(vehicleId)) as VehicleData | undefined
  return vehicle ? <VehicleDataCard vehicle={vehicle} /> : null
}

const renderRemovableVehicleCard = (vehicle: VehicleData, extraGear: Record<string, ItemData> = {}) => {
  const runnerStore = new RunnerDataStore(
    runnerDataFactory((runner) => ({ ...runner, gear: { [vehicle.id]: vehicle, ...extraGear } })),
  )
  renderWithProviders(<RemovableVehicleCard vehicleId={vehicle.id} />, { runnerStore })
  return runnerStore
}

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
    expect((runnerStore.getState().gear[car.id] as VehicleData).damage?.physical).toBe(3)
  })

  it("renders attached mods as nested subitems", () => {
    // Arrange / Act
    renderVehicleCard(carWithMod, { [mod.id]: mod })

    // Assert
    expect(screen.getByText("Anti-Theft System")).toBeDefined()
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange: the card itself is the first "button" in DOM order — its damage-track cells
    // (also role="button") are nested inside it.
    const onOpen = vi.fn()
    renderVehicleCard(car, {}, onOpen)

    // Act
    fireEvent.click(screen.getAllByRole("button")[0])

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("removing the vehicle dispatches removeItem for it and its mods", async () => {
    // Arrange
    const runnerStore = renderRemovableVehicleCard(carWithMod, { [mod.id]: mod })

    // Act
    fireEvent.contextMenu(screen.getByText("Americar"))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    await waitFor(() => expect(runnerStore.getState().gear[carWithMod.id]).toBeUndefined())
    expect(runnerStore.getState().gear[mod.id]).toBeUndefined()
  })
})
