import { act, fireEvent, screen, waitFor, within } from "@testing-library/react"
import type { FC } from "react"
import { describe, expect, it } from "vitest"

import { GearSection } from "#/app/components/entities/items/viewer/gearSectionTypes.ts"
import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { EntityKind } from "#/data/entities/entityKind.ts"
import type { ItemData } from "#/data/items/itemData.ts"
import { ItemType } from "#/data/items/itemType.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { useAddItemDialog } from "./useAddItemDialog.tsx"

const AddItemDialogHarness: FC<{ parentId?: UUID }> = ({ parentId }) => {
  const addItemDialog = useAddItemDialog()
  return (
    <>
      <button onClick={() => addItemDialog.open({ parentId })}>Add Item</button>
      {addItemDialog.outlet}
    </>
  )
}

function clickInLastDialog(name: RegExp) {
  const dialogs = screen.getAllByRole("dialog")
  fireEvent.click(within(dialogs[dialogs.length - 1]).getByRole("button", { name }))
}

/** Clicks the wizard's Next button and waits for its async step validation to settle. */
async function clickNextInLastDialog() {
  clickInLastDialog(/next/i)
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

describe("useAddItemDialog", () => {
  it("adds a Misc item to the runner through the full Type → Stats → Effects → Finalize flow", async () => {
    // Arrange
    const runnerStore = renderWithRunner(<AddItemDialogHarness />)

    // Act — Select Type
    fireEvent.click(screen.getByText("Add Item"))
    fireEvent.click(screen.getByText(GearSection.Misc))

    // Enter Stats — the type dialog's close and the item dialog's open cross a promise
    // tick, so wait for the new dialog's Name field to actually mount.
    const nameField = await screen.findByLabelText(/^name$/i)
    fireEvent.change(nameField, { target: { value: "Fake SIN Chip" } })
    await clickNextInLastDialog()

    // Select Effects
    await clickNextInLastDialog()

    // Finalize
    clickInLastDialog(/acquire|save/i)

    // Assert
    await waitFor(() => {
      const items = Object.values(runnerStore.getState().items)
      const added = items.find((item) => item.name === "Fake SIN Chip")
      expect(added).toBeDefined()
      expect(added?.itemType).toBe(ItemType.other)
    })
  })

  it("pre-attaches the new item to the given parentId", async () => {
    // Arrange
    const parent: ItemData = {
      kind: EntityKind.item,
      id: "00000000-0000-0000-0000-000000000099",
      itemType: ItemType.armor,
      name: "Combat Vest",
      items: { parentId: null, childIds: [] },
    }
    const runnerStore = renderWithRunner(<AddItemDialogHarness parentId={parent.id} />, {
      [parent.id]: parent,
    })

    // Act
    fireEvent.click(screen.getByText("Add Item"))
    fireEvent.click(screen.getByText(GearSection.Misc))

    const nameField = await screen.findByLabelText(/^name$/i)
    fireEvent.change(nameField, { target: { value: "Plate Insert" } })
    await clickNextInLastDialog()
    await clickNextInLastDialog()
    clickInLastDialog(/acquire|save/i)

    // Assert
    await waitFor(() => {
      const items = Object.values(runnerStore.getState().items)
      const added = items.find((item) => item.name === "Plate Insert")
      expect(added?.items.parentId).toBe(parent.id)
    })
  })

  it("does nothing when the type picker is cancelled", async () => {
    // Arrange
    const runnerStore = renderWithRunner(<AddItemDialogHarness />)

    // Act
    fireEvent.click(screen.getByText("Add Item"))
    clickInLastDialog(/cancel/i)
    // The type dialog's result resolves across a promise tick, so let `open()` finish before
    // checking that it neither opened a form dialog nor dispatched anything.
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(screen.queryByRole("dialog")).toBeNull()
    expect(Object.values(runnerStore.getState().items)).toHaveLength(0)
  })
})
