import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { GearSectionContentScaffold } from "./gearSectionContentScaffold.tsx"

function makeItem(id: ReturnType<typeof crypto.randomUUID>, name: string): ItemData {
  return { id, name, itemType: ItemType.other }
}

describe("GearSectionContentScaffold", () => {
  it("renders shared section scaffolding with per-item actions and section action", () => {
    // Arrange
    const firstItem = makeItem("aaaaaaaa-0000-0000-0000-000000000001" as ReturnType<typeof crypto.randomUUID>, "Commlink")
    const secondItem = makeItem("aaaaaaaa-0000-0000-0000-000000000002" as ReturnType<typeof crypto.randomUUID>, "Fake Badge")

    render(
      <GearSectionContentScaffold
        items={[firstItem, secondItem]}
        getSubItems={() => []}
        getItemCallbacks={() => ({})}
        renderItemAction={(item) => <div>Action for {item.name}</div>}
        addAction={{ label: "Add Item", onClick: vi.fn() }}
      />,
      { wrapper: ThemeWrapper },
    )

    // Act
    const firstAction = screen.getByText("Action for Commlink")
    const secondAction = screen.getByText("Action for Fake Badge")
    const addButton = screen.getByRole("button", { name: "Add Item" })

    // Assert
    expect(firstAction).toBeTruthy()
    expect(secondAction).toBeTruthy()
    expect(addButton).toBeTruthy()
  })

  it("forwards item and sub-item callbacks to GearViewItem", () => {
    // Arrange
    const parentItem = makeItem("bbbbbbbb-0000-0000-0000-000000000001" as ReturnType<typeof crypto.randomUUID>, "Ares Predator")
    const childItem = {
      ...makeItem("bbbbbbbb-0000-0000-0000-000000000002" as ReturnType<typeof crypto.randomUUID>, "Smartgun System"),
      parentId: parentItem.id,
    }

    const onEditParent = vi.fn()
    const onEditChild = vi.fn()

    render(
      <GearSectionContentScaffold
        items={[parentItem]}
        getSubItems={() => [childItem]}
        getItemCallbacks={() => ({
          onEdit: onEditParent,
          getSubItemCallbacks: () => ({ onEdit: onEditChild }),
        })}
      />,
      { wrapper: ThemeWrapper },
    )

    // Act
    fireEvent.click(screen.getByText("Ares Predator"))
    fireEvent.click(screen.getByText("Smartgun System"))

    // Assert
    expect(onEditParent).toHaveBeenCalledTimes(1)
    expect(onEditChild).toHaveBeenCalledTimes(1)
  })
})
