import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  SpellCategory,
  SpellDamage,
  SpellDrainType,
  SpellDuration,
  SpellRange,
  SpellType,
} from "#/system/magic/spellData.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementSpellList } from "./improvementSpellList.tsx"
import { SpendKarmaDialogProvider } from "./spendKarmaDialogContext.tsx"

function renderList(updateRunnerData?: (sheet: RunnerData) => void) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      <ImprovementSpellList />
    </SpendKarmaDialogProvider>,
    { updateRunnerData },
  )
}

describe("ImprovementSpellList", () => {
  it("shows the empty state when no spells are known and none are queued", () => {
    // Arrange
    renderList((sheet) => {
      sheet.spells = []
    })

    // Act — nothing

    // Assert
    expect(screen.getByText(/no spells known/i)).toBeTruthy()
  })

  it("lists known spells by name and category", () => {
    // Arrange
    renderList((sheet) => {
      sheet.spells = [{
        id: "00000000-0000-0000-0000-000000000001",
        name: "Manabolt",
        type: SpellType.Mana,
        range: SpellRange.LoS,
        damage: SpellDamage.Stun,
        category: SpellCategory.Combat,
        drain: { type: SpellDrainType.Force, value: -3 },
        dealsDamage: true,
        duration: SpellDuration.Instantaneous,
        voluntaryTargetsOnly: false,
      }]
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Manabolt")).toBeTruthy()
  })

  it("exposes a Learn New Spell button", () => {
    // Arrange
    renderList()

    // Act — nothing

    // Assert
    expect(screen.getByRole("button", { name: /learn new spell/i })).toBeTruthy()
  })

  it("does NOT render the legacy 'Spell learning coming soon' placeholder", () => {
    // Arrange
    renderList()

    // Act — nothing

    // Assert
    expect(screen.queryByText(/coming soon/i)).toBeNull()
  })
})
