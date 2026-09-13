import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import type { FC } from "react"
import { useMemo } from "react"
import { describe, expect, it, vi } from "vitest"

import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { itemDefaults, useItemForm } from "#/hooks/items/forms/useItemForm.tsx"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import type { ItemDialogProps } from "./itemDialog.tsx"
import { ItemDialog } from "./itemDialog.tsx"

/**
 * Mirrors how real callers use ItemDialog (see itemDialog.test.tsx) — needed here because the
 * fixed/integrated toggle only renders as part of the Item Options dialog that ItemDialog opens.
 */
const ItemDialogWrapper: FC<{
  onSave?: (item: ItemData) => void | Promise<void>
} & Omit<ItemDialogProps, "form" | "ctrl">> = ({ onSave = vi.fn(), ...props }) => {
  const ctrl = useMemo(() => {
    const dialogCtrl = new DialogCtrl<ItemData>()
    dialogCtrl.open()
    return dialogCtrl
  }, [])

  const form = useItemForm({
    defaultValues: { ...itemDefaults, itemType: ItemType.other },
    onSubmit: async (submittedItem) => {
      await onSave(submittedItem)
    },
  })
  return <ItemDialog ctrl={ctrl} form={form} {...props} />
}

describe("ItemOptionsDialog", () => {
  it("can unfix (uninegrate) an item after confirming, restoring the parent select", async () => {
    // Arrange
    renderInBuilder(<ItemDialogWrapper title="Add Thing" />)
    fireEvent.click(screen.getByLabelText("Item options"))
    const optionsDialog = screen.getAllByRole("dialog").at(-1)!
    fireEvent.click(within(optionsDialog).getByLabelText(/is attachment/i))
    fireEvent.click(within(optionsDialog).getByLabelText(/is fixed/i))
    expect(document.querySelector("[role=\"combobox\"]")?.getAttribute("aria-disabled")).toBe("true")

    // Act — uncheck "fixed"; a confirmation dialog must appear and be confirmable
    fireEvent.click(within(optionsDialog).getByLabelText(/is fixed/i))
    const confirmDialog = await screen.findByText(/make item removable/i)
    fireEvent.click(within(confirmDialog.closest("[role=\"dialog\"]")!).getByRole("button", { name: /make removable/i }))

    // Assert — the fixed checkbox is unchecked and the parent select is enabled again
    await waitFor(() => {
      expect((within(optionsDialog).getByLabelText(/is fixed/i) as HTMLInputElement).checked).toBe(false)
    })
    expect(document.querySelector("[role=\"combobox\"]")?.getAttribute("aria-disabled")).toBeNull()
  })
})
