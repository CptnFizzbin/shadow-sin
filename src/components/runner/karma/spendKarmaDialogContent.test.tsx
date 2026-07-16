import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { SpendKarmaDialogContent } from "./spendKarmaDialogContent.tsx"

function makeOpenCtrl() {
  const ctrl = new DialogCtrl<void>()
  ctrl.open()
  return ctrl
}

function renderDialog(updateRunnerData?: (sheet: RunnerData) => void) {
  const ctrl = makeOpenCtrl()
  return renderWithProviders(
    <SpendKarmaDialogContent ctrl={ctrl} />,
    {
      runnerStore: new RunnerDataStore(runnerDataFactory((sheet) => {
        updateRunnerData?.(sheet)
        return sheet
      })),
    },
  )
}

describe("SpendKarmaDialogContent", () => {
  it("opens on the hub with a row per category", () => {
    // Arrange
    renderDialog((sheet) => {
      sheet.karma.current = 0
    })

    // Act — nothing

    // Assert — at least Attributes and Skills categories are present
    expect(screen.getByRole("button", { name: /attributes/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /skill groups/i })).toBeTruthy()
  })

  it("shows the Qualities category regardless of Awakening", () => {
    // Arrange
    renderDialog()

    // Act — nothing

    // Assert
    expect(screen.getByRole("button", { name: /qualities/i })).toBeTruthy()
  })

  it("shows only Awakening-appropriate categories for a Mundane runner", () => {
    // Arrange — Mundane is the factory default
    renderDialog()

    // Act — nothing

    // Assert
    expect(screen.queryByRole("button", { name: /^spells$/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /complex forms/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /^initiation$/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /^submersion$/i })).toBeNull()
  })

  it("shows Spells and Initiation, but not Complex Forms or Submersion, for a Magician", () => {
    // Arrange
    renderDialog((sheet) => {
      sheet.biology.awakening = AwakeningType.Magician
    })

    // Act — nothing

    // Assert
    expect(screen.getByRole("button", { name: /^spells$/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /^initiation$/i })).toBeTruthy()
    expect(screen.queryByRole("button", { name: /complex forms/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /^submersion$/i })).toBeNull()
  })

  it("shows Initiation but not Spells for an Adept (Magical but not a spellcaster)", () => {
    // Arrange
    renderDialog((sheet) => {
      sheet.biology.awakening = AwakeningType.Adept
    })

    // Act — nothing

    // Assert
    expect(screen.getByRole("button", { name: /^initiation$/i })).toBeTruthy()
    expect(screen.queryByRole("button", { name: /^spells$/i })).toBeNull()
  })

  it("shows Complex Forms and Submersion, but not Spells or Initiation, for a Technomancer", () => {
    // Arrange
    renderDialog((sheet) => {
      sheet.biology.awakening = AwakeningType.Technomancer
    })

    // Act — nothing

    // Assert
    expect(screen.getByRole("button", { name: /complex forms/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /^submersion$/i })).toBeTruthy()
    expect(screen.queryByRole("button", { name: /^spells$/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /^initiation$/i })).toBeNull()
  })

  it("shows only remaining karma in the footer (not total cost separately)", () => {
    // Arrange
    renderDialog((sheet) => {
      sheet.karma.current = 30
    })

    // Act — nothing

    // Assert — "Remaining" label shown
    expect(screen.getByText(/remaining/i)).toBeTruthy()
    // "Total Cost" label should NOT appear (old layout had redundant display)
    expect(screen.queryByText(/total cost/i)).toBeNull()
  })

  it("Save button is disabled when no improvements are queued", () => {
    // Arrange
    renderDialog((sheet) => {
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    const saveButton = screen.getByRole("button", { name: /save/i })
    expect((saveButton as HTMLButtonElement).disabled).toBe(true)
  })

  it("drills into a section and returns to the hub via the back button", () => {
    // Arrange
    renderDialog((sheet) => {
      sheet.karma.current = 50
    })

    // Act — drill into Attributes, then go back
    fireEvent.click(screen.getByRole("button", { name: /attributes/i }))
    const backButton = screen.getByRole("button", { name: /back to categories/i })
    fireEvent.click(backButton)

    // Assert — hub rows are visible again
    expect(screen.getByRole("button", { name: /skill groups/i })).toBeTruthy()
    expect(screen.queryByRole("button", { name: /back to categories/i })).toBeNull()
  })

  it("Save button is disabled when queued improvements exceed available karma", () => {
    // Arrange — Body 3 costs (3+1)*5 = 20k, but only 5 karma
    renderDialog((sheet) => {
      sheet.attributes[AttributeKey.body] = 3
      sheet.karma.current = 5
    })

    // Act — drill into Attributes, queue Body
    fireEvent.click(screen.getByRole("button", { name: /attributes/i }))
    fireEvent.click(screen.getByRole("button", { name: /bod/i }))

    // Assert
    const saveButton = screen.getByRole("button", { name: /save/i })
    expect((saveButton as HTMLButtonElement).disabled).toBe(true)
  })

  it("shows a queued badge on the hub row after queueing an improvement", () => {
    // Arrange
    renderDialog((sheet) => {
      sheet.attributes[AttributeKey.body] = 3
      sheet.karma.current = 50
    })

    // Act — queue Body, then return to the hub
    fireEvent.click(screen.getByRole("button", { name: /attributes/i }))
    fireEvent.click(screen.getByRole("button", { name: /bod/i }))
    fireEvent.click(screen.getByRole("button", { name: /back to categories/i }))

    // Assert — the Attributes hub row shows the queued count
    expect(screen.getByText("1 queued")).toBeTruthy()
  })

  it("drilling into a section displays the corresponding list", () => {
    // Arrange
    renderDialog((sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      sheet.karma.current = 50
    })

    // Act — drill into Skills
    fireEvent.click(screen.getByRole("button", { name: /^skills$/i }))

    // Assert — Pistols visible in the skills section
    expect(screen.getByText("Pistols")).toBeTruthy()
  })
})
