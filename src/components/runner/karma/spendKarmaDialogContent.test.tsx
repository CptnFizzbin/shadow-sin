import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
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
  it("renders the nav rail with category tabs", () => {
    // Arrange
    renderDialog((sheet) => {
      sheet.karma.current = 0
    })

    // Act — nothing

    // Assert — at least Attributes and Skills tabs are present
    expect(screen.getByRole("button", { name: /attributes/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /skills/i })).toBeTruthy()
  })

  it("does not show the Spell tab for a non-spellcaster", () => {
    // Arrange
    renderDialog()

    // Act — nothing

    // Assert
    expect(screen.queryByRole("button", { name: /spells/i })).toBeNull()
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

  it("Save button is disabled when queued improvements exceed available karma", () => {
    // Arrange — Body 3 costs (3+1)*5 = 20k, but only 5 karma
    renderDialog((sheet) => {
      sheet.attributes[AttributeKey.body] = 3
      sheet.karma.current = 5
    })

    // Act — click Attributes nav, queue Body
    fireEvent.click(screen.getByRole("button", { name: /attributes/i }))
    // The list is visible (attrs tab is default), queue BOD
    const bodButton = screen.getByRole("button", { name: /bod/i })
    fireEvent.click(bodButton)

    // Assert
    const saveButton = screen.getByRole("button", { name: /save/i })
    expect((saveButton as HTMLButtonElement).disabled).toBe(true)
  })

  it("switching nav tabs displays the corresponding list section", () => {
    // Arrange
    renderDialog((sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      sheet.karma.current = 50
    })

    // Act — switch to Skills tab
    fireEvent.click(screen.getByRole("button", { name: /^skills$/i }))

    // Assert — Pistols visible in skills section
    expect(screen.getByText("Pistols")).toBeTruthy()
  })
})
