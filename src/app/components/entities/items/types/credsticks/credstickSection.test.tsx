import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EntityKind } from "#data/entities/entityKind.ts"
import type { CredstickData } from "#data/items/credstickData.ts"
import { CredstickType } from "#data/items/credstickData.ts"
import { ItemType } from "#data/items/itemType.ts"
import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import { getItemCatalog } from "#data/runner/runnerTraits.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { CredstickSection } from "./credstickSection.tsx"

const streetStick: CredstickData = {
  kind: EntityKind.item,
  items: { parentId: null, childIds: [] },
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
      runner: runnerDataFactory({ items: { [streetStick.id]: streetStick } }),
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

  it("editing a credstick saves the rename through the shared item save path without moving nuyen", async () => {
    // Arrange
    const store = renderWithProviders(<CredstickSection />, {
      runner: runnerDataFactory({
        items: { [streetStick.id]: streetStick },
        afterBuild: (data) => {
          data.nuyen.current = 100
        },
      }),
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))
    await screen.findByRole("dialog", { name: "Edit Credstick" })
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Rainy Day Fund" } })
    fireEvent.click(screen.getByRole("button", { name: /save/i }))

    // Assert
    expect(await screen.findByText("Rainy Day Fund")).toBeDefined()
    expect(getItemCatalog(store.getState().runner)[streetStick.id]).toEqual({ ...streetStick, name: "Rainy Day Fund" })
    expect(store.getState().runner.nuyen.current).toBe(100)
  })

  it("withdrawing a credstick removes it, once confirmed, and deposits its balance to nuyen", async () => {
    // Arrange
    const store = renderWithProviders(<CredstickSection />, {
      runner: runnerDataFactory({
        items: { [streetStick.id]: streetStick },
        afterBuild: (data) => {
          data.nuyen.current = 100
        },
      }),
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))
    await screen.findByRole("dialog", { name: "Edit Credstick" })
    fireEvent.click(screen.getByRole("button", { name: /withdraw/i }))
    const confirmButton = await screen.findByRole("button", { name: /confirm withdrawal/i })
    const nuyenBeforeConfirm = store.getState().runner.nuyen.current
    const itemBeforeConfirm = getItemCatalog(store.getState().runner)[streetStick.id]
    fireEvent.click(confirmButton)

    // Assert
    expect(nuyenBeforeConfirm).toBe(100)
    expect(itemBeforeConfirm).toBeDefined()
    // The UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Street Cred")).toBeNull())
    expect(getItemCatalog(store.getState().runner)[streetStick.id]).toBeUndefined()
    // 100 on hand + the stick's 500 balance
    expect(store.getState().runner.nuyen.current).toBe(600)
  })
})
