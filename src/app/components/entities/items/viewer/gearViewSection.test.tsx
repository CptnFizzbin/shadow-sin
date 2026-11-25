import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EntityKind } from "#data/entities/entityKind.ts"
import type { ItemData } from "#data/items/itemData.ts"
import { ItemState } from "#data/items/itemState.ts"
import { ItemType } from "#data/items/itemType.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { GearListFilterContext } from "./gearListFilter.ts"
import { GearSection } from "./gearSectionTypes.ts"
import { GearViewSection } from "./gearViewSection.tsx"

const trodes: ItemData = {
  kind: EntityKind.item,
  items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Trodes",
  itemType: ItemType.other,
}

describe("GearViewSection", () => {
  it("renders nothing for a section with no items", () => {
    // Arrange / Act
    renderWithRunner(<GearViewSection section={GearSection.Weapons} />, { [trodes.id]: trodes })

    // Assert
    expect(screen.queryByText(GearSection.Weapons)).toBeNull()
  })

  it("is expanded by default when the section has items", () => {
    // Arrange / Act
    renderWithRunner(<GearViewSection section={GearSection.Misc} />, { [trodes.id]: trodes })

    // Assert
    expect(screen.getByText(GearSection.Misc)).toBeDefined()
    expect(screen.getByText(GearSection.Misc).closest("[aria-expanded]")?.getAttribute("aria-expanded")).toBe("true")
  })

  it("renders nothing when the gear list filter leaves the section empty", () => {
    // Arrange / Act
    renderWithRunner(
      <GearListFilterContext.Provider value={{ includes: (item) => item.state === ItemState.stashed }}>
        <GearViewSection section={GearSection.Misc} />
      </GearListFilterContext.Provider>,
      { [trodes.id]: trodes },
    )

    // Assert
    expect(screen.queryByText(GearSection.Misc)).toBeNull()
  })
})
