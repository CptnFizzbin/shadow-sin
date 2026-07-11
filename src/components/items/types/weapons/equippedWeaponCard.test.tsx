import { fireEvent, render, screen, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { CharacterSheetProvider } from "#/components/character/sheet/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import { createDefaultCharacterSheet } from "#/components/character/sheet/createDefaultCharacterSheet.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { FirearmData } from "#/system/gear/weaponData.ts"
import { FirearmAttachmentPoint, WeaponType } from "#/system/gear/weaponData.ts"
import { FirearmTypeKey } from "#/system/gear/weapons/firearms/firearmTypeKey.ts"
import { ItemType } from "#/system/itemType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { EquippedWeaponCard } from "./equippedWeaponCard.tsx"

const weapon: FirearmData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Test Pistol",
  itemType: ItemType.weapon,
  weaponType: WeaponType.firearm,
  firearmType: FirearmTypeKey.lightPistol,
  dmg: "4P",
  ap: -1,
  skill: SkillKey.pistols,
  attribute: AttributeKey.agility,
  equipped: true,
  recoil: 0,
  firemodes: ["SA", "BF"],
  attachmentPoints: [FirearmAttachmentPoint.Top],
  ammo: {
    size: 15,
    remaining: 15,
    type: "clip",
  },
}

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const runnerStore = new CharacterSheetStore(createDefaultCharacterSheet())
  return <CharacterSheetProvider store={runnerStore}>{children}</CharacterSheetProvider>
}

describe("EquippedWeaponCard - Attack button", () => {
  it("opens attack dialog without crashing", async () => {
    // Arrange
    render(<EquippedWeaponCard weapon={weapon} />, { wrapper: Wrapper })

    // Act
    fireEvent.click(screen.getByRole("button", { name: /attack/i }))

    // Assert
    expect(await screen.findByRole("dialog", { name: "Test Pistol" })).toBeDefined()
  })

  it("clicking a fire mode does not crash the page", async () => {
    // Arrange
    render(<EquippedWeaponCard weapon={weapon} />, { wrapper: Wrapper })
    // Act
    fireEvent.click(screen.getByRole("button", { name: /attack/i }))

    const dialog = await screen.findByRole("dialog", { name: "Test Pistol" })
    fireEvent.click(await within(dialog).findByRole("button", { name: /sa/i }))

    // Assert
    expect(await screen.findByRole("dialog", { name: "Test Pistol" })).toBeDefined()
  })
})
