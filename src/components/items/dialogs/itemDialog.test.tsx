import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import type { FC } from "react"
import { useMemo } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { itemDefaults, useItemForm } from "#/lib/hooks/items/forms/useItemForm.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { fillNameAndClickSave, renderInBuilder, renderWithProviders } from "#testUtils/renderUtils.tsx"

import type { ItemDialogProps } from "./itemDialog.tsx"
import { ItemDialog } from "./itemDialog.tsx"

/**
 * Test wrapper that creates an ItemForm and a DialogCtrl from the given
 * item/itemType/onSave and passes them to ItemDialog.
 * Mirrors how real callers use ItemDialog.
 */
const ItemDialogWrapper: FC<{
  onSave?: (item: ItemData) => void | Promise<void>
  item?: ItemData
  itemType?: ItemType
} & Omit<ItemDialogProps, "form" | "ctrl">> = ({ onSave = vi.fn(), item, itemType, ...props }) => {
  const ctrl = useMemo(() => {
    const dialogCtrl = new DialogCtrl<ItemData>()
    dialogCtrl.open()
    return dialogCtrl
  }, [])

  const form = useItemForm({
    item,
    defaultValues: { ...itemDefaults, itemType: itemType ?? ItemType.other },
    onSubmit: async (submittedItem) => {
      await onSave(submittedItem)
    },
  })
  return <ItemDialog ctrl={ctrl} form={form} {...props} />
}

describe("ItemDialog", () => {
  it("renders with a name field and save button", () => {
    renderInBuilder(
      <ItemDialogWrapper

        title="Add Thing"
        onSave={vi.fn()}

      />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    expect(within(dialog).getByLabelText(/^name$/i)).toBeDefined()
    expect(within(dialog).getByRole("button", { name: /save/i })).toBeDefined()
  })

  it("shows the Stashed switch by default", () => {
    renderInBuilder(
      <ItemDialogWrapper title="Add Thing" onSave={vi.fn()} />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    expect(within(dialog).getByLabelText("Stashed")).toBeDefined()
  })

  it("submits stashed when the Stashed switch is toggled on", async () => {
    const onSave = vi.fn()
    renderInBuilder(
      <ItemDialogWrapper itemType={ItemType.other} title="Add Gadget" onSave={onSave} />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    fireEvent.click(within(dialog).getByLabelText("Stashed"))

    fillNameAndClickSave("Stashed Gadget")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ItemData = onSave.mock.calls[0][0]
      expect(submitted.stashed).toBe(true)
    })
  })

  it("hides the Stashed switch when canBeStashed is force-disabled", () => {
    renderInBuilder(
      <ItemDialogWrapper
        title="Add Thing"
        onSave={vi.fn()}
        options={{ canBeStashed: { forced: true, enabled: false } }}
      />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    expect(within(dialog).queryByLabelText("Stashed")).toBeNull()
  })

  it("calls onSave with the item on save", async () => {
    const onSave = vi.fn()
    renderInBuilder(
      <ItemDialogWrapper

        itemType={ItemType.other}
        title="Add Gadget"
        onSave={onSave}

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
      <ItemDialogWrapper title="Add Item" onSave={vi.fn()} />,
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

        title="Add Rated Item"
        onSave={vi.fn()}

        options={{ hasRating: { enabled: true } }}
      />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    expect(within(dialog).getByLabelText("Rating")).toBeDefined()
  })

  it("shows the quantity counter when multiple option is enabled", () => {
    renderInBuilder(
      <ItemDialogWrapper

        title="Add Bulk Item"
        onSave={vi.fn()}

        options={{ multiple: { enabled: true } }}
      />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    expect(within(dialog).getByLabelText("Quantity")).toBeDefined()
  })

  it("shows the attached-to section when isSubItem option is enabled", () => {
    renderInBuilder(
      <ItemDialogWrapper

        title="Add Sub-Item"
        onSave={vi.fn()}

        options={{ isSubItem: { enabled: true } }}
      />,
    )

    expect(screen.getByText("Attached To")).toBeDefined()
  })

  it("renders slot itemFields", () => {
    renderInBuilder(
      <ItemDialogWrapper

        title="Add Item"
        onSave={vi.fn()}

        slots={{
          itemFields: () => <div data-testid="custom-fields">Custom Fields</div>,
        }}
      />,
    )

    expect(screen.getByTestId("custom-fields")).toBeDefined()
  })

  it("shows acquire and purchase buttons in viewer mode", () => {
    renderWithProviders(
      <ItemDialogWrapper title="Add Item" onSave={vi.fn()} />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]
    expect(within(dialog).getByRole("button", { name: /acquire/i })).toBeDefined()
    expect(within(dialog).queryByRole("button", { name: /save/i })).toBeNull()
  })

  describe.sequential("nuyen deduction on purchase", () => {
    afterEach(() => vi.restoreAllMocks())

    it("calls onSave and deducts nuyen on successful purchase in viewer mode", async () => {
      // Arrange
      const withdrawSpy = vi.spyOn(Actions.nuyen, "withdrawNuyen")
      const onSave = vi.fn()
      renderWithProviders(
        <ItemDialogWrapper

          itemType={ItemType.other}
          title="Add Item"
          onSave={onSave}

        />,
      )

      const dialogs = screen.getAllByRole("dialog")
      const dialog = dialogs[dialogs.length - 1]

      fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
        target: { value: "Bought Thing" },
      })

      // Act
      fireEvent.click(within(dialog).getByRole("button", { name: /purchase/i }))

      // Assert
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledOnce()
        const submitted: ItemData = onSave.mock.calls[0][0]
        expect(submitted.name).toBe("Bought Thing")
        expect(withdrawSpy).toHaveBeenCalledOnce()
      })
    })

    it("does not deduct nuyen when onSave throws on purchase", async () => {
      // Arrange
      const withdrawSpy = vi.spyOn(Actions.nuyen, "withdrawNuyen")
      const onSave = vi.fn().mockRejectedValue(new Error("save failed"))
      renderWithProviders(
        <ItemDialogWrapper

          itemType={ItemType.other}
          title="Add Item"
          onSave={onSave}

        />,
      )

      const dialogs = screen.getAllByRole("dialog")
      const dialog = dialogs[dialogs.length - 1]

      fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
        target: { value: "Failed Item" },
      })

      // Act — onSave is called but rejects, so isSubmitSuccessful is false
      fireEvent.click(within(dialog).getByRole("button", { name: /purchase/i }))

      // Assert — wait for onSave to have been called (it was, but threw), then verify no withdrawal
      await waitFor(() => expect(onSave).toHaveBeenCalledOnce())
      expect(withdrawSpy).not.toHaveBeenCalled()
    })

    it("does not deduct nuyen when form validation fails on purchase", async () => {
      // Arrange
      const withdrawSpy = vi.spyOn(Actions.nuyen, "withdrawNuyen")
      const onSave = vi.fn()
      renderWithProviders(
        <ItemDialogWrapper

          itemType={ItemType.other}
          title="Add Item"
          onSave={onSave}

        />,
      )

      const dialogs = screen.getAllByRole("dialog")
      const dialog = dialogs[dialogs.length - 1]

      // Name intentionally left empty — validation will fail

      // Act
      fireEvent.click(within(dialog).getByRole("button", { name: /purchase/i }))

      // Assert — wait for the validation error then confirm neither onSave nor withdraw ran
      await waitFor(() => within(dialog).getByText("Name is required"))
      expect(onSave).not.toHaveBeenCalled()
      expect(withdrawSpy).not.toHaveBeenCalled()
    })
  })

  it("shows the correct title when passed in", () => {
    const existingItem: ItemData = {
      kind: EntityKind.item, items: { parentId: null, childIds: [] },
      id: "test-id-0000-0000-000000000000" as ReturnType<typeof crypto.randomUUID>,
      itemType: ItemType.other,
      name: "Old Name",
    }

    renderInBuilder(
      <ItemDialogWrapper

        item={existingItem}
        title="Edit Thing"
        onSave={vi.fn()}

      />,
    )

    expect(screen.getByText("Edit Thing")).toBeDefined()
  })

  describe("field-driven option visibility for existing items", () => {
    const existingItemId = crypto.randomUUID()

    it("shows the equipped switch when the existing item has an equipped value", async () => {
      // Arrange
      const item: ItemData = {
        kind: EntityKind.item, items: { parentId: null, childIds: [] },
        id: existingItemId,
        itemType: ItemType.other,
        name: "Holster",
        equipped: false,
      }

      // Act
      renderInBuilder(
        <ItemDialogWrapper item={item} title="Edit Item" onSave={vi.fn()} />,
      )

      // Assert
      expect(await screen.findByLabelText("Equipped")).toBeDefined()
    })

    it("shows the rating counter when the existing item has a non-zero rating", async () => {
      // Arrange
      const item: ItemData = {
        kind: EntityKind.item, items: { parentId: null, childIds: [] },
        id: existingItemId,
        itemType: ItemType.other,
        name: "Rated Gear",
        rating: 3,
      }

      // Act
      renderInBuilder(
        <ItemDialogWrapper item={item} title="Edit Item" onSave={vi.fn()} />,
      )

      // Assert
      expect(await screen.findByLabelText("Rating")).toBeDefined()
    })

    it("shows the quantity field when the existing item has a non-zero quantity", async () => {
      // Arrange
      const item: ItemData = {
        kind: EntityKind.item, items: { parentId: null, childIds: [] },
        id: existingItemId,
        itemType: ItemType.other,
        name: "Bulk Item",
        quantity: 5,
      }

      // Act
      renderInBuilder(
        <ItemDialogWrapper item={item} title="Edit Item" onSave={vi.fn()} />,
      )

      // Assert
      expect(await screen.findByLabelText("Quantity")).toBeDefined()
    })

    it("shows the attachment section when the existing item has a parentId", async () => {
      // Arrange
      const parentId = crypto.randomUUID()
      const item: ItemData = {
        kind: EntityKind.item,
        id: existingItemId,
        itemType: ItemType.other,
        name: "Sub-Item",
        items: { parentId, childIds: [] },
      }

      // Act
      renderInBuilder(
        <ItemDialogWrapper item={item} title="Edit Item" onSave={vi.fn()} />,
      )

      // Assert
      expect(await screen.findByText("Attached To")).toBeDefined()
    })
  })

  describe("clearing fields when options are toggled off", () => {
    const existingItemId = crypto.randomUUID()

    it("sets equipped to undefined when equippable is toggled off and equipped is false", async () => {
      // Arrange
      const onSave = vi.fn()
      const item: ItemData = {
        kind: EntityKind.item, items: { parentId: null, childIds: [] },
        id: existingItemId,
        itemType: ItemType.other,
        name: "Gear",
        equipped: false,
      }

      renderInBuilder(
        <ItemDialogWrapper item={item} title="Edit Item" onSave={onSave} />,
      )

      const dialogs = screen.getAllByRole("dialog")
      const mainDialog = dialogs[dialogs.length - 1]

      // Act — open options dialog and uncheck equippable
      fireEvent.click(within(mainDialog).getByRole("button", { name: /item options/i }))
      const optionsTitleEl = screen.getByText("Item Options")
      const optionsDialog = optionsTitleEl.closest("[role='dialog']") as HTMLElement
      const equippableCheckbox = within(optionsDialog).getByRole("checkbox", { name: /equippable/i })
      fireEvent.click(equippableCheckbox)

      // Close the options dialog via Escape on the document so MUI's listener fires
      fireEvent.keyDown(document.body, { key: "Escape" })

      // MUI keeps the options dialog mounted with aria-modal=true during its
      // close animation, temporarily blocking a11y queries on the main dialog.
      await waitFor(() => {
        const saveButton = within(mainDialog).getByRole("button", { name: /save/i, hidden: true })
        fireEvent.click(saveButton)
      })

      // Assert — equipped should be cleared to undefined
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledOnce()
        const submitted: ItemData = onSave.mock.calls[0][0]
        expect(submitted.equipped).toBeUndefined()
      })
    })
  })
})
