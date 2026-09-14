import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GearSection } from "#/components/entities/items/viewer/gearSectionTypes.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { WeaponData } from "#/system/model/items/weaponData.ts"
import { WeaponType } from "#/system/model/items/weaponData.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"
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
