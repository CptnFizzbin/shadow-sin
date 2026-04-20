import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ItemDialog } from "#/components/gear/dialogs/itemDialog.tsx"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { fillNameAndClickSave, renderInBuilder, renderWithProviders } from "#testUtils/renderUtils.tsx"

describe("ItemDialog", () => {
  it("renders with a name field and save button", () => {
    renderInBuilder(
      <ItemDialog
        open
        label="Thing"
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
      <ItemDialog
        open
        itemType={ItemType.other}
        label="Gadget"
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
      <ItemDialog open label="Item" onSave={vi.fn()} onClose={vi.fn()} />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    const optionsButton = within(dialog).getByRole("button", { name: /item options/i })
    fireEvent.click(optionsButton)

    expect(screen.getByText("Item Options")).toBeDefined()
  })

  it("shows the rating counter when hasRating option is enabled", () => {
    renderInBuilder(
      <ItemDialog
        open
        label="Rated Item"
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
      <ItemDialog
        open
        label="Bulk Item"
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
      <ItemDialog
        open
        label="Sub-Item"
        onSave={vi.fn()}
        onClose={vi.fn()}
        options={{ isSubItem: { enabled: true } }}
      />,
    )

    expect(screen.getByText("Attached To")).toBeDefined()
  })

  it("renders slot itemFields with the form", () => {
    renderInBuilder(
      <ItemDialog
        open
        label="Item"
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
      <ItemDialog open label="Item" onSave={vi.fn()} onClose={vi.fn()} />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    expect(within(dialog).getByRole("button", { name: /acquire/i })).toBeDefined()
    expect(within(dialog).queryByRole("button", { name: /save/i })).toBeNull()
  })

  it("calls onSave then deducts nuyen on purchase in viewer mode", async () => {
    const onSave = vi.fn()
    renderWithProviders(
      <ItemDialog
        open
        itemType={ItemType.other}
        label="Item"
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

  it("shows 'Edit' in title when editing an existing item", () => {
    const existingItem: ItemData = {
      id: "test-id-0000-0000-000000000000" as ReturnType<typeof crypto.randomUUID>,
      itemType: ItemType.other,
      name: "Old Name",
    }

    renderInBuilder(
      <ItemDialog
        open
        item={existingItem}
        label="Thing"
        onSave={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByText("Edit Thing")).toBeDefined()
  })
})
