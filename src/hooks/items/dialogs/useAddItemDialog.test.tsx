import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import type { FC } from "react"
import { describe, expect, it } from "vitest"

import { GearSection } from "#/components/runner/gearPage/gearSectionTypes.ts"
import { ItemType } from "#/system/itemType.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { useAddItemDialog } from "./useAddItemDialog.tsx"

const AddItemDialogHarness: FC = () => {
  const addItemDialog = useAddItemDialog()
  return (
    <>
      <button onClick={() => addItemDialog.open()}>Add Item</button>
      {addItemDialog.outlet}
    </>
  )
}

function clickInLastDialog(name: RegExp) {
  const dialogs = screen.getAllByRole("dialog")
  fireEvent.click(within(dialogs[dialogs.length - 1]).getByRole("button", { name }))
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
    clickInLastDialog(/next/i)

    // Select Effects
    clickInLastDialog(/next/i)

    // Finalize
    clickInLastDialog(/acquire|save/i)

    // Assert
    await waitFor(() => {
      const items = Object.values(getItemCatalog(runnerStore.getState()))
      const added = items.find((item) => item.name === "Fake SIN Chip")
      expect(added).toBeDefined()
      expect(added?.itemType).toBe(ItemType.other)
    })
  })

  it("does nothing when the type picker is cancelled", () => {
    // Arrange
    const runnerStore = renderWithRunner(<AddItemDialogHarness />)

    // Act
    fireEvent.click(screen.getByText("Add Item"))
    clickInLastDialog(/cancel/i)

    // Assert
    expect(Object.values(getItemCatalog(runnerStore.getState()))).toHaveLength(0)
  })
})
