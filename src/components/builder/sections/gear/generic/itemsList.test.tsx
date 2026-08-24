import { fireEvent, screen, waitFor } from "@testing-library/react"
import type { FC } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { useGearByType } from "#/hooks/items/gearHooks.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { ItemsList } from "./itemsList.tsx"

const trodes: ItemData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Trodes",
  itemType: ItemType.other,
}

// ItemsList takes `items` as a plain prop (its parents own the store
// subscription), so this wrapper mirrors real usage (e.g. MiscPanel) by
// keeping it bound to the live store.
const LiveItemsList: FC = () => {
  const items = useGearByType(ItemType.other)
  return <ItemsList items={items} itemLabel="Item" itemType={ItemType.other} />
}

describe("ItemsList", () => {
  it("shows items from the store", () => {
    // Arrange / Act
    renderInBuilder(<LiveItemsList />, {
      runnerStore: new RunnerDataStore(runnerDataFactory((runner) => ({ ...runner, gear: { [trodes.id]: trodes } }))),
    })

    // Assert
    expect(screen.getByText("Trodes")).toBeDefined()
  })

  it("adding an item dispatches addItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<LiveItemsList />)

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add item/i }))
    fillNameAndClickSave("Fake Corp ID")

    // Assert: the UI re-rendered off the updated store.
    expect(await screen.findByText("Fake Corp ID")).toBeDefined()
  })

  it("removing an item dispatches removeItem and updates the store", async () => {
    // Arrange
    renderInBuilder(<LiveItemsList />, {
      runnerStore: new RunnerDataStore(runnerDataFactory((runner) => ({ ...runner, gear: { [trodes.id]: trodes } }))),
    })
    expect(screen.getByText("Trodes")).toBeDefined()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Trodes")).toBeNull())
  })
})
