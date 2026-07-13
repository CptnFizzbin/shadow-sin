import { createStore } from "@tanstack/store"
import { fireEvent, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ActiveSkillFormDialog } from "./activeSkillFormDialog.tsx"

function openSkillDropdown() {
  // The "Skill" select is the first combobox in the dialog (no accessible name is
  // wired up on the underlying MUI Select, so we can't query by name here).
  fireEvent.mouseDown(screen.getAllByRole("combobox")[0])
}

describe("ActiveSkillFormDialog", () => {
  it("lists unknown skills and excludes ones already known or disabled", () => {
    // Arrange
    const ctrl = new DialogCtrl<ActiveSkillData>()
    ctrl.open()
    const disabledSkills = new Set<string>([SkillKey.pistols])

    // Act
    renderWithProviders(<ActiveSkillFormDialog ctrl={ctrl} disabledSkills={disabledSkills} />)
    openSkillDropdown()

    // Assert: a skill not in disabledSkills is offered, the disabled one is not
    const listbox = screen.getByRole("listbox")
    expect(within(listbox).queryByText(SkillKey.automatics)).not.toBeNull()
    expect(within(listbox).queryByText(SkillKey.pistols)).toBeNull()
  })

  it("excludes skills the runner's awakening type can never learn", () => {
    // Arrange
    const ctrl = new DialogCtrl<ActiveSkillData>()
    ctrl.open()

    // Act: a Mundane runner can't learn the Technomancer-only skill "compiling"
    renderWithProviders(<ActiveSkillFormDialog ctrl={ctrl} />, {
      runnerStore: createStore(runnerDataFactory((sheet) => {
        sheet.biology.awakening = AwakeningType.Mundane
        return sheet
      })),
    })
    openSkillDropdown()

    // Assert
    const listbox = screen.getByRole("listbox")
    expect(within(listbox).queryByText(SkillKey.compiling)).toBeNull()
    expect(within(listbox).queryByText(SkillKey.automatics)).not.toBeNull()
  })
})
