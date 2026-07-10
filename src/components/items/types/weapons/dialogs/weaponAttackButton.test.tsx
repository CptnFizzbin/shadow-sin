import { ThemeProvider } from "@mui/material/styles"
import { act, fireEvent, render, screen } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"
import { describe, expect, it } from "vitest"

import { CharacterSheetProvider } from "#/components/character/sheet/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import { createDefaultCharacterSheet } from "#/components/character/sheet/createDefaultCharacterSheet.ts"
import { EquippedWeaponCard } from "#/components/items/types/weapons/equippedWeaponCard.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { FirearmData } from "#/system/gear/weaponData.ts"
import { FirearmAttachmentPoint, WeaponType } from "#/system/gear/weaponData.ts"
import { FirearmTypeKey } from "#/system/gear/weapons/firearms/firearmTypeKey.ts"
import { ItemType } from "#/system/itemType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { theme } from "#/theme.ts"

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

const ProductionWrapper: FC<PropsWithChildren> = ({ children }) => {
  const store = useMemo(() => new CharacterSheetStore(createDefaultCharacterSheet()), [])
  return (
    <ThemeProvider theme={theme}>
      <CharacterSheetProvider store={store}>
        {children}
      </CharacterSheetProvider>
    </ThemeProvider>
  )
}

describe("EquippedWeaponCard - Attack button", () => {
  it("opens attack dialog without crashing", async () => {
    // Arrange
    render(<EquippedWeaponCard weapon={weapon} />, { wrapper: ProductionWrapper })

    // Act
    await act(() => {
      fireEvent.click(screen.getByRole("button", { name: /attack/i }))
    })

    // Assert - dialog title should be visible
    expect(screen.getByRole("heading", { name: "Test Pistol" })).toBeDefined()
  })

  it("clicking a fire mode does not crash the page", async () => {
    // Arrange
    render(<EquippedWeaponCard weapon={weapon} />, { wrapper: ProductionWrapper })

    // Open dialog
    await act(() => {
      fireEvent.click(screen.getByRole("button", { name: /attack/i }))
    })

    // Act - click a fire mode button (this triggers re-render)
    await act(() => {
      const fireModeButtons = screen.getAllByRole("button", { name: "SA" })
      const saButton = fireModeButtons[fireModeButtons.length - 1]
      fireEvent.click(saButton)
    })

    // Assert - dialog is still visible
    expect(screen.getByRole("heading", { name: "Test Pistol" })).toBeDefined()
  })
})
