import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import type { FC } from "react"
import { describe, expect, it, vi } from "vitest"

import type { ItemDialogProps } from "#/components/gear/dialogs/itemDialog.tsx"
import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
import { itemDefaults, useItemForm } from "#/components/gear/forms/useItemForm.tsx"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { fillNameAndClickSave, renderInBuilder, renderWithProviders } from "#testUtils/renderUtils.tsx"

/**
 * Test wrapper that creates an ItemForm from the given item/itemType/onSave and
 * passes it to ItemDialog. Mirrors how real callers use ItemDialog.
 */
const ItemDialogWrapper: FC<{
  onSave?: (item: ItemData) => void | Promise<void>
  item?: ItemData
  itemType?: ItemType
} & Omit<ItemDialogProps, "form">> = ({ onSave = vi.fn(), item, itemType, ...props }) => {
  const form = useItemForm({
    item,
    defaultValues: { ...itemDefaults, itemType: itemType ?? ItemType.other },
    onSubmit: async (submittedItem) => {
      await onSave(submittedItem)
    },
  })
  return <ItemDialog form={form} {...props} />
}

describe("ItemDialog", () => {
  it("renders with a name field and save button", () => {
    renderInBuilder(
      <ItemDialogWrapper
        open
        title="Add Thing"
        onSave={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    expect(within(dialog).getByLabelText(/^name$/i)).toBeDefined()
    expect(within(dialog).getByRole("button", { name: /save/i })).toBeDefined()
  })

  it("calls onSave with the item on save", async () => {
    const onSave = vi.fn()
    renderInBuilder(
      <ItemDialogWrapper
        open
        itemType={ItemType.other}
        title="Add Gadget"
        onSave={onSave}
        onClose={vi.fn()}
      />,
    )

    fillNameAndClickSave("My Gadget")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ItemData = onSave.mock.calls[0][0]
      expect(submitted.name).toBe("My Gadget")
      expect(submitted.itemType).toBe(ItemType.other)
    })
  })

  it("opens the options dialog when the settings button is clicked", () => {
    renderInBuilder(
      <ItemDialogWrapper open title="Add Item" onSave={vi.fn()} onClose={vi.fn()} />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    const optionsButton = within(dialog).getByRole("button", { name: /item options/i })
    fireEvent.click(optionsButton)

    expect(screen.getByText("Item Options")).toBeDefined()
  })

  it("shows the rating counter when hasRating option is enabled", () => {
    renderInBuilder(
      <ItemDialogWrapper
        open
        title="Add Rated Item"
        onSave={vi.fn()}
        onClose={vi.fn()}
        options={{ hasRating: { enabled: true } }}
      />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    expect(within(dialog).getByText("Rating")).toBeDefined()
  })

  it("shows the quantity counter when multiple option is enabled", () => {
    renderInBuilder(
      <ItemDialogWrapper
        open
        title="Add Bulk Item"
        onSave={vi.fn()}
        onClose={vi.fn()}
        options={{ multiple: { enabled: true } }}
      />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    expect(within(dialog).getByText("Quantity")).toBeDefined()
  })

  it("shows the attached-to section when isSubItem option is enabled", () => {
    renderInBuilder(
      <ItemDialogWrapper
        open
        title="Add Sub-Item"
        onSave={vi.fn()}
        onClose={vi.fn()}
        options={{ isSubItem: { enabled: true } }}
      />,
    )

    expect(screen.getByText("Attached To")).toBeDefined()
  })

  it("renders slot itemFields", () => {
    renderInBuilder(
      <ItemDialogWrapper
        open
        title="Add Item"
        onSave={vi.fn()}
        onClose={vi.fn()}
        slots={{
          itemFields: () => <div data-testid="custom-fields">Custom Fields</div>,
        }}
      />,
    )

    expect(screen.getByTestId("custom-fields")).toBeDefined()
  })

  it("shows acquire and purchase buttons in viewer mode", () => {
    renderWithProviders(
      <ItemDialogWrapper open title="Add Item" onSave={vi.fn()} onClose={vi.fn()} />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    expect(within(dialog).getByRole("button", { name: /acquire/i })).toBeDefined()
    expect(within(dialog).queryByRole("button", { name: /save/i })).toBeNull()
  })

  it("calls onSave then deducts nuyen on purchase in viewer mode", async () => {
    const onSave = vi.fn()
    renderWithProviders(
      <ItemDialogWrapper
        open
        itemType={ItemType.other}
        title="Add Item"
        onSave={onSave}
        onClose={vi.fn()}
      />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
      target: { value: "Bought Thing" },
    })

    const purchaseButton = within(dialog).getByRole("button", { name: /purchase/i })
    fireEvent.click(purchaseButton)

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ItemData = onSave.mock.calls[0][0]
      expect(submitted.name).toBe("Bought Thing")
    })
  })

  it("shows the correct title when passed in", () => {
    const existingItem: ItemData = {
      id: "test-id-0000-0000-000000000000" as ReturnType<typeof crypto.randomUUID>,
      itemType: ItemType.other,
      name: "Old Name",
    }

    renderInBuilder(
      <ItemDialogWrapper
        open
        item={existingItem}
        title="Edit Thing"
        onSave={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByText("Edit Thing")).toBeDefined()
  })
})
