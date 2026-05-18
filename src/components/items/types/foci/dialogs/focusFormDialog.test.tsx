import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { FocusData } from "#/system/gear/focusData.ts"
import { FocusType } from "#/system/gear/focusData.ts"
import { ItemType } from "#/system/itemType.ts"
import { SpellCategory } from "#/system/magic/spellData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { FocusFormDialog } from "./focusFormDialog.tsx"

describe("FocusFormDialog", () => {
  it("submits a Power focus with the right itemType and focusType", async () => {
    // Arrange
    const ctrl = new DialogCtrl<FocusData>()
    ctrl.open()
    renderInBuilder(<FocusFormDialog ctrl={ctrl} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    // Act
    fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
      target: { value: "Power Focus" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.itemType).toBe(ItemType.focus)
      expect(savedItem?.focusType).toBe(FocusType.Power)
      expect(savedItem?.name).toBe("Power Focus")
    })
  })

  it("auto-populates the effects array with one entry per magic skill when Power is selected", async () => {
    // Arrange
    const ctrl = new DialogCtrl<FocusData>()
    ctrl.open()
    renderInBuilder(<FocusFormDialog ctrl={ctrl} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    // Act
    fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
      target: { value: "Power Focus" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      const expectedSkills = [
        SkillKey.arcana,
        SkillKey.assensing,
        SkillKey.astralCombat,
        SkillKey.banishing,
        SkillKey.binding,
        SkillKey.counterspelling,
        SkillKey.enchanting,
        SkillKey.ritualSpellcasting,
        SkillKey.spellcasting,
        SkillKey.summoning,
      ]
      expect(savedItem?.effects).toHaveLength(expectedSkills.length)
      for (const skill of expectedSkills) {
        expect(savedItem?.effects).toContainEqual({
          type: GameEffectType.skillMod,
          target: skill,
          value: 0,
        })
      }
    })
  })

  it("preserves existing effects when editing a Power focus (does not re-auto-populate)", async () => {
    // Arrange
    const existing: FocusData = {
      id: "test-id" as FocusData["id"],
      itemType: ItemType.focus,
      focusType: FocusType.Power,
      name: "Existing Power",
      rating: 3,
      bonded: true,
      equipped: false,
      effects: [{ type: GameEffectType.skillMod, target: SkillKey.spellcasting, value: 2 }],
    }
    const ctrl = new DialogCtrl<FocusData>()
    ctrl.open()
    renderInBuilder(<FocusFormDialog ctrl={ctrl} focus={existing} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    // Act
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert
    const savedItem = await ctrl.result()
    await waitFor(() => {
      expect(savedItem?.effects).toHaveLength(1)
      expect(savedItem?.effects?.[0]).toMatchObject({
        type: GameEffectType.skillMod,
        target: SkillKey.spellcasting,
        value: 2,
      })
    })
  })

  it("renders the Spell Category field when editing a sustaining focus", () => {
    // Arrange
    const existing: FocusData = {
      id: "test-id" as FocusData["id"],
      itemType: ItemType.focus,
      focusType: FocusType.Sustaining,
      name: "Sustaining (Combat)",
      spellCategory: SpellCategory.Combat,
      rating: 2,
    }
    const ctrl = new DialogCtrl<FocusData>()
    ctrl.open()
    renderInBuilder(<FocusFormDialog ctrl={ctrl} focus={existing} />)

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    // Assert — MUI Select renders the selected value as the displayed text.
    // The presence of the "Combat" option text confirms the spellCategory field rendered.
    expect(within(dialog).getAllByText(/combat/i).length).toBeGreaterThan(0)
  })
})
