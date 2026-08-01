import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import { CredstickType } from "#/system/gear/credstickData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { CredstickSection } from "./credstickSection.tsx"

const streetStick: CredstickData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Street Cred",
  itemType: ItemType.credstick,
  credstickType: CredstickType.standard,
  balance: 500,
}

describe("CredstickSection", () => {
  it("shows credsticks from the store", () => {
    // Arrange / Act
    renderWithProviders(<CredstickSection />, {
      runnerStore: new RunnerDataStore(runnerDataFactory((data) => {
        data.gear = { [streetStick.id]: streetStick }
        return data
      })),
    })

    // Assert
    expect(screen.getByText("Street Cred")).toBeDefined()
  })

  it("receiving a credstick dispatches setItem with a generated id and updates the store", async () => {
    // Arrange
    renderWithProviders(<CredstickSection />)

    // Act
    fireEvent.click(screen.getByRole("button", { name: /receive/i }))
    await screen.findByRole("dialog", { name: "Add Credstick" })
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Backup Stick" } })
    fireEvent.click(screen.getByRole("button", { name: /save/i }))

    // Assert: the UI re-rendered off the updated store.
    expect(await screen.findByText("Backup Stick")).toBeDefined()
  })

  it("withdrawing a credstick removes it, once confirmed, and deposits its balance to nuyen", async () => {
    // Arrange
    renderWithProviders(<CredstickSection />, {
      runnerStore: new RunnerDataStore(runnerDataFactory((data) => {
        data.gear = { [streetStick.id]: streetStick }
        data.nuyen.current = 100
        return data
      })),
    })

    // Act
    fireEvent.contextMenu(screen.getByText("Street Cred"))
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))
    await screen.findByRole("dialog", { name: "Edit Credstick" })
    fireEvent.click(screen.getByRole("button", { name: /withdraw/i }))
    fireEvent.click(await screen.findByRole("button", { name: /confirm withdrawal/i }))

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Street Cred")).toBeNull())
  })
})
