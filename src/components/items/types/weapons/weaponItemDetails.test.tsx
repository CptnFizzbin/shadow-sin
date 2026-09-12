import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GearSection } from "#/components/runner/gearPage/gearSectionTypes.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"
import { ItemType } from "#/system/itemType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { WeaponItemDetails } from "./weaponItemDetails.tsx"

const weapon: WeaponData = {
  kind: EntityKind.item,
  items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  weaponType: WeaponType.firearm,
  skill: SkillKey.pistols,
  dmg: "8P",
  equipped: false,
}

describe("WeaponItemDetails", () => {
  it("opens the Add Item workflow's type picker when Add Item is clicked", () => {
    // Arrange
    renderWithRunner(<WeaponItemDetails weapon={weapon} />, { [weapon.id]: weapon })

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add item/i }))

    // Assert — the shared workflow's type picker opens, pre-attaching to this weapon
    expect(screen.getByRole("dialog")).toBeDefined()
    expect(screen.getByText(GearSection.Armor)).toBeDefined()
  })
})
