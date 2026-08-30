import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { SinsAndLicensesSection } from "./sinsAndLicensesSection.tsx"

const fakeSin: SinData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "National ID (Fake)",
  itemType: ItemType.sin,
  isReal: false,
  rating: 4,
}

describe("SinsAndLicensesSection", () => {
  it("shows SINs from the store", () => {
    // Arrange / Act
    renderInBuilder(<SinsAndLicensesSection />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [fakeSin.id]: fakeSin } })),
    })

    // Assert
    expect(screen.getByText("National ID (Fake)")).toBeDefined()
  })

  it("adding a SIN dispatches addItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<SinsAndLicensesSection />)

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add sin/i }))
    fillNameAndClickSave("Real SIN")

    // Assert: the UI re-rendered off the updated store.
    expect(await screen.findByText("Real SIN")).toBeDefined()
  })

  it("removing a SIN with no licenses dispatches removeItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<SinsAndLicensesSection />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ items: { [fakeSin.id]: fakeSin } })),
    })
    expect(screen.getByText("National ID (Fake)")).toBeDefined()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert: the UI re-rendered off the updated store (SIN with no licenses removes without confirming).
    await waitFor(() => expect(screen.queryByText("National ID (Fake)")).toBeNull())
  })
})
