import { fireEvent, screen, waitFor } from "@testing-library/react"
import type { FC } from "react"
import { describe, expect, it } from "vitest"

import { useGearByType } from "#/components/items/gearHooks.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { fillNameAndClickSave, renderInBuilder } from "#testUtils/renderUtils.tsx"

import { ItemsList } from "./itemsList.tsx"

const trodes: ItemData = {
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
      updateRootState: (rootState) => {
        rootState.runner = { ...rootState.runner, gear: { [trodes.id]: trodes } }
      },
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
      updateRootState: (rootState) => {
        rootState.runner = { ...rootState.runner, gear: { [trodes.id]: trodes } }
      },
    })
    expect(screen.getByText("Trodes")).toBeDefined()

    // Act: the remove icon button has no accessible name.
    const removeButton = screen.getAllByRole("button").find((button) => button.textContent === "")
    fireEvent.click(removeButton!)

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Trodes")).toBeNull())
  })
})
