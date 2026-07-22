import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { DefenseCalculatorDialogContent } from "./defenseCalculatorDialogContent.tsx"

function makeOpenCtrl() {
  const ctrl = new DialogCtrl<void>()
  ctrl.open()
  return ctrl
}

function renderDialog(updateRunnerData?: (sheet: RunnerData) => void) {
  const ctrl = makeOpenCtrl()
  return renderWithProviders(
    <DefenseCalculatorDialogContent ctrl={ctrl} />,
    {
      runnerStore: new RunnerDataStore(runnerDataFactory((sheet) => {
        updateRunnerData?.(sheet)
        return sheet
      })),
    },
  )
}

const goNext = () => fireEvent.click(screen.getByRole("button", { name: /^next$/i }))

describe("DefenseCalculatorDialogContent", () => {
  it("opens on the hub with a row per attack type", () => {
    renderDialog()

    expect(screen.getByRole("button", { name: /melee/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /ranged/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /spell/i })).toBeTruthy()
  })

  it("drills into an attack type onto the Defense Skill step, and returns to the hub via the back button", () => {
    renderDialog()

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    expect(screen.getByText(/step 1 of 4.*defense skill/i)).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: /back to attack types/i }))
    expect(screen.getByRole("button", { name: /ranged/i })).toBeTruthy()
    expect(screen.queryByRole("button", { name: /back to attack types/i })).toBeNull()
  })

  it("pages forward through the wizard and back again", () => {
    renderDialog()

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    expect(screen.getByText(/step 1 of 4/i)).toBeTruthy()

    goNext()
    expect(screen.getByText(/step 2 of 4.*modifiers/i)).toBeTruthy()

    goNext()
    expect(screen.getByText(/step 3 of 4.*total/i)).toBeTruthy()

    goNext()
    expect(screen.getByText(/step 4 of 4.*resist damage/i)).toBeTruthy()
    expect(screen.queryByRole("button", { name: /^next$/i })).toBeNull()

    fireEvent.click(screen.getByRole("button", { name: /^back$/i }))
    expect(screen.getByText(/step 3 of 4/i)).toBeTruthy()
  })

  it("only offers ranged-only modifiers (like Cover) when the attack type is Ranged", () => {
    renderDialog()

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    goNext()
    expect(screen.queryByText(/^cover$/i)).toBeNull()

    fireEvent.click(screen.getByRole("button", { name: /^back$/i }))
    fireEvent.click(screen.getByRole("button", { name: /back to attack types/i }))
    fireEvent.click(screen.getByRole("button", { name: /ranged/i }))
    goNext()
    expect(screen.getByText(/^cover$/i)).toBeTruthy()
  })

  it("hides an untrained skill from the picker until Show Defaulting Skills is enabled", () => {
    renderDialog((sheet) => {
      sheet.skills.activeSkills = []
    })

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    expect(screen.queryByRole("button", { name: /parry \(blades\)/i })).toBeNull()

    fireEvent.click(screen.getByRole("checkbox", { name: /show defaulting skills/i }))
    expect(screen.getByRole("button", { name: /parry \(blades\)/i })).toBeTruthy()
  })

  it("adds a trained skill's dice to the total once selected", () => {
    renderDialog((sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.dodge, rating: 4 }]
    })

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    fireEvent.click(screen.getByRole("button", { name: /dodge/i }))
    goNext()
    goNext()

    const poolContainer = screen.getByText(/^Defense$/).parentElement!.parentElement!
    expect(poolContainer.textContent).toContain(SkillKey.dodge)
  })

  it("applies a checked modifier's value to the total", () => {
    renderDialog()

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    goNext()
    fireEvent.click(screen.getByRole("checkbox", { name: /you're prone/i }))
    goNext()

    const poolContainer = screen.getByText(/^Defense$/).parentElement!.parentElement!
    expect(poolContainer.textContent).toContain("You're prone")
  })

  it("includes the worn effective armor value in the Resist Damage step for a physical attack", () => {
    renderDialog((sheet) => {
      const jacket: ArmorData = {
        id: "00000000-0000-0000-0000-000000000001",
        name: "Test Jacket",
        itemType: ItemType.armor,
        equipped: true,
        ballistic: 8,
        impact: 6,
        damage: { ballistic: 2, impact: 1 },
      }
      sheet.gear[jacket.id] = jacket
    })

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    goNext()
    goNext()
    goNext()

    const poolContainer = screen.getByText(/^Resist Damage$/).parentElement!.parentElement!
    expect(poolContainer.textContent).toContain("Armor (Ballistic)6")

    fireEvent.click(screen.getByRole("button", { name: /^impact$/i }))
    expect(poolContainer.textContent).toContain("Armor (Impact)5")
  })

  it("does not apply armor to the Resist Damage step for a spell attack", () => {
    renderDialog((sheet) => {
      const jacket: ArmorData = {
        id: "00000000-0000-0000-0000-000000000001",
        name: "Test Jacket",
        itemType: ItemType.armor,
        equipped: true,
        ballistic: 8,
        impact: 6,
      }
      sheet.gear[jacket.id] = jacket
    })

    fireEvent.click(screen.getByRole("button", { name: /spell/i }))
    goNext()
    goNext()
    goNext()

    expect(screen.queryByRole("button", { name: /ballistic/i })).toBeNull()
    const poolContainer = screen.getByText(/^Resist Damage$/).parentElement!.parentElement!
    expect(poolContainer.textContent).not.toContain("Armor")
  })

  it("shows a warning and no total when unaware of the attack", () => {
    renderDialog()

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    goNext()
    fireEvent.click(screen.getByRole("checkbox", { name: /unaware of the attack/i }))
    goNext()

    expect(screen.getByText(/no defense is possible/i)).toBeTruthy()
    expect(screen.queryByText(/^Defense$/)).toBeNull()
  })
})
