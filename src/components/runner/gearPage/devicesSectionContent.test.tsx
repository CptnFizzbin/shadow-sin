import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { DevicesSectionContent } from "./devicesSectionContent.tsx"

const commlink: DeviceData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Renraku Sensei",
  itemType: ItemType.device,
  deviceType: "commlink",
  deviceRating: 4,
  response: 4,
  signal: 3,
  system: 4,
  firewall: 3,
}

describe("DevicesSectionContent", () => {
  it("shows devices from the store", () => {
    // Arrange / Act
    renderInBuilder(<DevicesSectionContent />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [commlink.id]: commlink } })),
    })

    // Assert
    expect(screen.getByText("Renraku Sensei")).toBeDefined()
  })

  it("tapping a device opens the edit dialog directly — the Builder has no details page", () => {
    // Arrange
    renderInBuilder(<DevicesSectionContent />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [commlink.id]: commlink } })),
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: /renraku sensei/i }))

    // Assert: the device form dialog opened, pre-filled for editing.
    expect(screen.getByRole("dialog", { name: /edit device/i })).toBeDefined()
  })

  it("removing a device dispatches removeItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<DevicesSectionContent />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [commlink.id]: commlink } })),
    })
    expect(screen.getByText("Renraku Sensei")).toBeDefined()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Renraku Sensei")).toBeNull())
  })
})
