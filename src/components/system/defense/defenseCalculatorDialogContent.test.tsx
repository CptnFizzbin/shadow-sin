import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
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

describe("DefenseCalculatorDialogContent", () => {
  it("opens on the hub with a row per attack type", () => {
    renderDialog()

    expect(screen.getByRole("button", { name: /melee/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /ranged/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /spell/i })).toBeTruthy()
  })

  it("drills into an attack type and returns to the hub via the back button", () => {
    renderDialog()

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    expect(screen.getByRole("combobox", { name: /defense skill/i })).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: /back to attack types/i }))
    expect(screen.getByRole("button", { name: /ranged/i })).toBeTruthy()
    expect(screen.queryByRole("button", { name: /back to attack types/i })).toBeNull()
  })

  it("only offers ranged-only modifiers (like Cover) when the attack type is Ranged", () => {
    renderDialog()

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    expect(screen.queryByRole("combobox", { name: /cover/i })).toBeNull()

    fireEvent.click(screen.getByRole("button", { name: /back to attack types/i }))
    fireEvent.click(screen.getByRole("button", { name: /ranged/i }))
    expect(screen.getByRole("combobox", { name: /cover/i })).toBeTruthy()
  })

  it("hides an untrained skill from the picker until Show Defaulting Skills is enabled", () => {
    renderDialog((sheet) => {
      sheet.skills.activeSkills = []
    })

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    expect(screen.queryByRole("option", { name: /parry \(blades\)/i })).toBeNull()

    fireEvent.mouseDown(screen.getByRole("combobox", { name: /defense skill/i }))
    expect(screen.queryByRole("option", { name: /parry \(blades\)/i })).toBeNull()
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" })

    fireEvent.click(screen.getByRole("switch", { name: /show defaulting skills/i }))
    fireEvent.mouseDown(screen.getByRole("combobox", { name: /defense skill/i }))
    expect(screen.getByRole("option", { name: /parry \(blades\)/i })).toBeTruthy()
  })

  it("adds a trained skill's dice to the total once selected", () => {
    renderDialog((sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.dodge, rating: 4 }]
    })

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    const poolContainer = screen.getByText(/^Defense$/).parentElement!.parentElement!
    const baseline = poolContainer.textContent

    fireEvent.mouseDown(screen.getByRole("combobox", { name: /defense skill/i }))
    fireEvent.click(screen.getByRole("option", { name: "Dodge" }))

    expect(poolContainer.textContent).not.toBe(baseline)
    expect(poolContainer.textContent).toContain(SkillKey.dodge)
  })

  it("applies a toggled modifier's value to the total", () => {
    renderDialog()

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    fireEvent.click(screen.getByRole("switch", { name: /defender prone/i }))

    expect(screen.getByText("Defender prone")).toBeTruthy()
  })

  it("shows a warning and no total when the defender is unaware", () => {
    renderDialog()

    fireEvent.click(screen.getByRole("button", { name: /melee/i }))
    fireEvent.click(screen.getByRole("switch", { name: /unaware of attack/i }))

    expect(screen.getByText(/no defense is possible/i)).toBeTruthy()
    expect(screen.queryByText(/^Defense$/)).toBeNull()
  })
})
