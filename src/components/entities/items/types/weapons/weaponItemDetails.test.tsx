import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { GearSection } from "#/components/entities/items/viewer/gearSectionTypes.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { FirearmData, WeaponData } from "#/system/model/items/weaponData.ts"
import { FirearmAttachmentPoint, WeaponType } from "#/system/model/items/weaponData.ts"
import { FirearmTypeKey } from "#/system/model/items/weapons/firearms/firearmTypeKey.ts"
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

  it("shows every stat its card does, including recoil, mounts and ammo", () => {
    // Arrange
    const firearm: FirearmData = {
      ...weapon,
      weaponType: WeaponType.firearm,
      firearmType: FirearmTypeKey.heavyPistol,
      firemodes: ["SA"],
      recoil: 1,
      attachmentPoints: [FirearmAttachmentPoint.Top],
      ammo: { size: 15, remaining: 12, type: "clip" },
    }

    // Act
    renderWithRunner(<WeaponItemDetails weapon={firearm} />, { [firearm.id]: firearm })

    // Assert
    for (const label of ["RC", "Mounts", "Ammo"]) {
      expect(screen.getByText(label)).toBeDefined()
    }
    expect(screen.getByText("12/15 (clip)")).toBeDefined()
  })
})
