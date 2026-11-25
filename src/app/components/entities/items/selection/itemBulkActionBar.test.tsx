import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GearSection } from "#app/components/entities/items/viewer/gearSectionTypes.ts"
import { GearViewSection } from "#app/components/entities/items/viewer/gearViewSection.tsx"
import type { UUID } from "#common/uuid/uuidUtils.ts"
import { EntityKind } from "#data/entities/entityKind.ts"
import type { ItemData } from "#data/items/itemData.ts"
import { ItemState } from "#data/items/itemState.ts"
import { ItemType } from "#data/items/itemType.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { ItemBulkActionSlot } from "./itemBulkActionSlot.tsx"
import { ItemSelectToggleButton } from "./itemSelectToggleButton.tsx"
import { ItemSelectionProvider } from "./itemSelectionProvider.tsx"

const makeItem = (id: string, overrides: Partial<ItemData> = {}): ItemData => ({
  kind: EntityKind.item,
  id: id as UUID,
  name: id,
  itemType: ItemType.weapon,
  items: { parentId: null, childIds: [] },
  ...overrides,
})

const makeGear = () => {
  const rifle = makeItem("Rifle", { items: { parentId: null, childIds: ["Scope" as UUID] } })
  const scope = makeItem("Scope", { itemType: ItemType.firearmAccessory, items: { parentId: rifle.id, childIds: [] } })
  const trodes = makeItem("Trodes", { itemType: ItemType.other })
  const license = makeItem("License", { itemType: ItemType.other })
  return { [rifle.id]: rifle, [scope.id]: scope, [trodes.id]: trodes, [license.id]: license }
}

const renderGearList = (gear: Record<string, ItemData>) => renderWithRunner(
  <ItemSelectionProvider>
    <ItemSelectToggleButton />
    <GearViewSection section={GearSection.Weapons} />
    <GearViewSection section={GearSection.Misc} />
    <ItemBulkActionSlot />
  </ItemSelectionProvider>,
  gear,
)

const selectCard = (name: string) => fireEvent.click(screen.getByRole("checkbox", { name: `Select ${name}` }))
const isChecked = (name: string) => {
  const checkbox = screen.getByRole("checkbox", { name: `Select ${name}` })
  return checkbox.getAttribute("aria-checked") === "true" || (checkbox as HTMLInputElement).checked
}
const bulkBar = () => screen.getByRole("toolbar", { name: "Bulk item actions" })

describe("ItemBulkActionBar", () => {
  it("shows no checkboxes or bar until Select is pressed", () => {
    // Arrange / Act
    renderGearList(makeGear())

    // Assert
    expect(screen.queryByRole("checkbox", { name: "Select Trodes" })).toBeNull()
    expect(screen.queryByRole("toolbar")).toBeNull()
  })

  it("selecting a parent auto-selects its Attachment, which can then be deselected", () => {
    // Arrange
    renderGearList(makeGear())
    fireEvent.click(screen.getByRole("button", { name: "Select" }))

    // Act
    selectCard("Rifle")
    const scopeAutoSelected = isChecked("Scope")
    selectCard("Scope")

    // Assert
    expect(scopeAutoSelected).toBe(true)
    expect(isChecked("Scope")).toBe(false)
    expect(isChecked("Rifle")).toBe(true)
  })

  it("keeps a selection across collapsing a section and applies Stash to every selected Item", () => {
    // Arrange
    const store = renderGearList(makeGear())
    fireEvent.click(screen.getByRole("button", { name: "Select" }))
    selectCard("Trodes")
    fireEvent.click(screen.getByText(GearSection.Misc))
    selectCard("Rifle")

    // Act
    fireEvent.click(within(bulkBar()).getByRole("button", { name: "Stash" }))

    // Assert
    const items = store.getState().items
    expect(items.Trodes.state).toBe(ItemState.stashed)
    expect(items.Rifle.state).toBe(ItemState.stashed)
    expect(items.Scope.state).toBe(ItemState.stashed)
    expect(items.License.state).toBeUndefined()
    expect(screen.queryByRole("toolbar")).toBeNull()
  })

  it("Equip skips selected Items that can't be Equipped", () => {
    // Arrange
    const store = renderGearList(makeGear())
    fireEvent.click(screen.getByRole("button", { name: "Select" }))
    selectCard("Rifle")

    // Act
    fireEvent.click(within(bulkBar()).getByRole("button", { name: "Equip" }))

    // Assert
    const items = store.getState().items
    expect(items.Rifle.state).toBe(ItemState.equipped)
    expect(items.Scope.state).toBeUndefined()
  })

  it("Delete only removes the selection once confirmed", async () => {
    // Arrange
    const store = renderGearList(makeGear())
    fireEvent.click(screen.getByRole("button", { name: "Select" }))
    selectCard("Trodes")
    selectCard("License")

    // Act
    fireEvent.click(within(bulkBar()).getByRole("button", { name: "Delete" }))
    const dialog = await screen.findByRole("dialog")
    const deletedBeforeConfirm = !store.getState().items.Trodes
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }))

    // Assert
    expect(deletedBeforeConfirm).toBe(false)
    await waitFor(() => expect(store.getState().items.Trodes).toBeUndefined())
    expect(store.getState().items.License).toBeUndefined()
    expect(store.getState().items.Rifle).toBeDefined()
    expect(screen.queryByRole("toolbar")).toBeNull()
  })
})
