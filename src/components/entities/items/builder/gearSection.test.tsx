import { fireEvent, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GearSection as GearItemSection } from "#/components/entities/items/viewer/gearSectionTypes.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { GearSection } from "./gearSection.tsx"

const trodes: ItemData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Trodes",
  itemType: ItemType.other,
}

describe("GearSection", () => {
  it("hides item sections that have no items but always shows Lifestyle", () => {
    // Arrange / Act
    renderInBuilder(<GearSection />, {
      runner: runnerDataFactory({ items: { [trodes.id]: trodes } }),
    })

    // Assert
    expect(screen.getByText("Misc")).toBeDefined()
    expect(screen.getAllByText("Lifestyle").length).toBeGreaterThan(0)
    expect(screen.queryByText("Weapons")).toBeNull()
    expect(screen.queryByText("Armor")).toBeNull()
  })

  it("expands every section by default", () => {
    // Arrange / Act
    renderInBuilder(<GearSection />, {
      runner: runnerDataFactory({ items: { [trodes.id]: trodes } }),
    })

    // Assert
    expect(screen.getByText("Misc").closest("[aria-expanded]")?.getAttribute("aria-expanded")).toBe("true")
  })

  it("shows a single standard Add Item button rather than one per gear type", () => {
    // Arrange / Act
    renderInBuilder(<GearSection />)

    // Assert
    expect(screen.getByRole("button", { name: "Add Item" })).toBeDefined()
    expect(screen.queryByRole("button", { name: /add weapon/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /add armor/i })).toBeNull()
  })

  it("clicking Add Item opens the standard Add Item workflow", () => {
    // Arrange
    renderInBuilder(<GearSection />)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Add Item" }))

    // Assert: the category picker step of the shared Add Item workflow opens.
    const dialog = screen.getByRole("dialog")
    expect(within(dialog).getByText(GearItemSection.Armor)).toBeDefined()
    expect(within(dialog).getByText(GearItemSection.Weapons)).toBeDefined()
  })

  it("resolving a category with no subtype moves straight into that type's Enter Stats step", async () => {
    // Arrange
    renderInBuilder(<GearSection />)
    fireEvent.click(screen.getByRole("button", { name: "Add Item" }))

    // Act
    fireEvent.click(within(screen.getByRole("dialog")).getByText(GearItemSection.Armor))

    // Assert: the armor form's wizard "Enter Stats" step opened.
    expect(await screen.findByLabelText(/^name$/i)).toBeDefined()
  })
})
