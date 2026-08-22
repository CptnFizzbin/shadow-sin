import { fireEvent, screen, waitFor } from "@testing-library/react"
import type { FC } from "react"
import { describe, expect, it, vi } from "vitest"

import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ProgramType } from "#/system/gear/programData.ts"
import { ItemType } from "#/system/itemType.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { DeviceDataCard } from "./deviceDataCard.tsx"

const commlink: DeviceData = {
  kind: EntityKind.item,
  id: crypto.randomUUID(),
  name: "Renraku Sensei",
  itemType: ItemType.device,
  deviceType: "commlink",
  deviceModel: "Renraku Sensei",
  deviceRating: 4,
  response: 3,
  signal: 3,
  system: 4,
  firewall: 4,
}

const runningProgram: ProgramData = {
  kind: EntityKind.item,
  id: crypto.randomUUID(),
  name: "Analyze",
  itemType: ItemType.program,
  rating: 2,
  programType: ProgramType.dataSearch,
  parentId: commlink.id,
}

const deviceWithProgram: DeviceData = { ...commlink, childIds: [runningProgram.id] }

const renderDeviceCard = (device: DeviceData, extraGear: Record<string, ProgramData> = {}, onOpen?: () => void) =>
  renderWithRunner(<DeviceDataCard device={device} onOpen={onOpen} />, { [device.id]: device, ...extraGear })

interface RemovableDeviceCardProps {
  deviceId: DeviceData["id"]
}

/**
 * Stops rendering `DeviceDataCard` once its device is gone from the store — the same guard every
 * real caller gets for free by mapping over the store's device list. A `DeviceDataCard` kept
 * mounted with a `device.id` no longer in gear would otherwise re-run its own `selectChildrenOf`
 * selector against a missing parent and throw.
 */
const RemovableDeviceCard: FC<RemovableDeviceCardProps> = ({ deviceId }) => {
  const device = useRunnerStoreSelector(Selectors.gear.selectById(deviceId)) as DeviceData | undefined
  return device ? <DeviceDataCard device={device} /> : null
}

const renderRemovableDeviceCard = (device: DeviceData, extraGear: Record<string, ProgramData> = {}) =>
  renderWithRunner(<RemovableDeviceCard deviceId={device.id} />, { [device.id]: device, ...extraGear })

describe("DeviceDataCard", () => {
  it("renders the device's model as its SubType, and its comm stats", () => {
    // Arrange / Act
    renderDeviceCard(commlink)

    // Assert
    expect(screen.getAllByText("Renraku Sensei")).toHaveLength(2) // title + SubType (same model name)
    expect(screen.getByText("Rating: 4")).toBeDefined()
    expect(screen.getByText("Res: 3")).toBeDefined()
    expect(screen.getByText("Sig: 3")).toBeDefined()
    expect(screen.getByText("Sys: 4")).toBeDefined()
    expect(screen.getByText("FW: 4")).toBeDefined()
  })

  it("omits comm stats the device doesn't have", () => {
    // Arrange / Act
    renderDeviceCard({
      ...commlink,
      deviceRating: undefined,
      response: undefined,
      signal: undefined,
      system: undefined,
      firewall: undefined,
    })

    // Assert
    expect(screen.queryByText(/Rating:/)).toBeNull()
    expect(screen.queryByText(/Res:/)).toBeNull()
    expect(screen.queryByText(/Sig:/)).toBeNull()
    expect(screen.queryByText(/Sys:/)).toBeNull()
    expect(screen.queryByText(/FW:/)).toBeNull()
  })

  it("falls back to a custom device type label when it isn't a commlink", () => {
    // Arrange / Act
    renderDeviceCard({ ...commlink, deviceType: "other", customDeviceType: "Sensor Array", deviceModel: undefined })

    // Assert
    expect(screen.getByText("Sensor Array")).toBeDefined()
  })

  it("renders nested programs as subitems with their own rating", () => {
    // Arrange / Act
    renderDeviceCard(deviceWithProgram, { [runningProgram.id]: runningProgram })

    // Assert
    expect(screen.getByText("Analyze")).toBeDefined()
    expect(screen.getByText("Rating: 2")).toBeDefined()
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    renderDeviceCard(commlink, {}, onOpen)

    // Act: click a stat chip rather than getByRole("button") — the device always wires onRemove,
    // so the card's own Actions menu button is also present.
    fireEvent.click(screen.getByText("Res: 3"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("removing the device dispatches removeItem for it and its programs", async () => {
    // Arrange
    const runnerStore = renderRemovableDeviceCard(deviceWithProgram, { [runningProgram.id]: runningProgram })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    await waitFor(() => expect(runnerStore.getState()._data_.items[deviceWithProgram.id]).toBeUndefined())
    expect(runnerStore.getState()._data_.items[runningProgram.id]).toBeUndefined()
  })
})
