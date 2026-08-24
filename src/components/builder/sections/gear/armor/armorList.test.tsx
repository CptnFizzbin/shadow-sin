import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { ArmorList } from "./armorList.tsx"

const jacket: ArmorData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Armor Jacket",
  itemType: ItemType.armor,
  ballistic: 8,
  impact: 6,
}

describe("ArmorList", () => {
  it("shows armor from the store", () => {
    // Arrange / Act
    renderInBuilder(<ArmorList />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ override: (runner) => ({ ...runner, gear: { [jacket.id]: jacket } }) })),
    })

    // Assert
    expect(screen.getByText("Armor Jacket")).toBeDefined()
  })

  it("adding armor dispatches addItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<ArmorList />)

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add armor/i }))
    fillNameAndClickSave("Lined Coat")

    // Assert: the UI re-rendered off the updated store.
    expect(await screen.findByText("Lined Coat")).toBeDefined()
  })

  it("removing armor dispatches removeItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<ArmorList />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ override: (runner) => ({ ...runner, gear: { [jacket.id]: jacket } }) })),
    })
    expect(screen.getByText("Armor Jacket")).toBeDefined()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Armor Jacket")).toBeNull())
  })
})
