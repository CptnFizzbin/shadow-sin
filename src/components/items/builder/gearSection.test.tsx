import { fireEvent, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GearSection as GearItemSection } from "#/components/items/viewer/gearSectionTypes.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { GearSection } from "./gearSection.tsx"

describe("GearSection", () => {
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
