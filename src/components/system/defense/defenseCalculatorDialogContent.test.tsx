import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
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

  describe("Defense Skill step", () => {
    it("groups melee options under Basic, Dodge, Parry, and Block headers", () => {
      renderDialog()

      fireEvent.click(screen.getByRole("button", { name: /melee/i }))
      // Untrained groups are hidden until this is on — flip it to see all four.
      fireEvent.click(screen.getByRole("checkbox", { name: /show defaulting skills/i }))

      // "Basic" and "Dodge" each appear twice: once as the group header, once as
      // that group's lone row (which shares the header's name).
      expect(screen.getAllByText("Basic").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Dodge").length).toBeGreaterThan(0)
      expect(screen.getByText("Parry")).toBeTruthy()
      expect(screen.getByText("Block")).toBeTruthy()
      expect(screen.getByRole("button", { name: /^0 blades/i })).toBeTruthy()
    })

    it("only shows Basic and Dodge headers for a ranged attack (no Parry/Block)", () => {
      renderDialog()

      fireEvent.click(screen.getByRole("button", { name: /ranged/i }))
      fireEvent.click(screen.getByRole("checkbox", { name: /show defaulting skills/i }))

      expect(screen.getAllByText("Basic").length).toBeGreaterThan(0)
      expect(screen.getAllByText("Dodge").length).toBeGreaterThan(0)
      expect(screen.queryByText("Parry")).toBeNull()
      expect(screen.queryByText("Block")).toBeNull()
    })

    it("hides an untrained skill from the picker until Show Defaulting Skills is enabled", () => {
      renderDialog((sheet) => {
        sheet.skills.activeSkills = []
      })

      fireEvent.click(screen.getByRole("button", { name: /melee/i }))
      expect(screen.queryByRole("button", { name: /blades/i })).toBeNull()

      fireEvent.click(screen.getByRole("checkbox", { name: /show defaulting skills/i }))
      expect(screen.getByRole("button", { name: /blades/i })).toBeTruthy()
    })

    it("adds a trained skill's dice to the total once selected", () => {
      renderDialog((sheet) => {
        sheet.skills.activeSkills = [{ name: SkillKey.dodge, rating: 4 }]
      })

      fireEvent.click(screen.getByRole("button", { name: /melee/i }))
      // "Dodge" and "Full Dodge" both match /dodge/i — anchor to the plain row's accessible name.
      fireEvent.click(screen.getByRole("button", { name: /^\d+ dodge\b/i }))
      goNext()
      goNext()

      const poolContainer = screen.getByText(/^Defense$/).parentElement!.parentElement!
      expect(poolContainer.textContent).toContain(SkillKey.dodge)
    })

    it("Full Dodge counts Dodge twice and notes the action-economy cost", () => {
      renderDialog((sheet) => {
        sheet.skills.activeSkills = [{ name: SkillKey.dodge, rating: 4 }]
      })

      fireEvent.click(screen.getByRole("button", { name: /melee/i }))
      expect(screen.getByText(/consumes next action phase/i)).toBeTruthy()

      fireEvent.click(screen.getByRole("button", { name: /^\d+ dodge\b/i }))
      goNext()
      goNext()
      const plainPool = screen.getByText(/^Defense$/).parentElement!.parentElement!.textContent

      // Total → Modifiers → Defense Skill
      fireEvent.click(screen.getByRole("button", { name: /^back$/i }))
      fireEvent.click(screen.getByRole("button", { name: /^back$/i }))
      fireEvent.click(screen.getByRole("button", { name: /full dodge/i }))
      goNext()
      goNext()

      const fullDodgePool = screen.getByText(/^Defense$/).parentElement!.parentElement!.textContent
      expect(fullDodgePool).not.toBe(plainPool)

      const dodgeOccurrences = fullDodgePool!.match(new RegExp(SkillKey.dodge, "g")) ?? []
      expect(dodgeOccurrences.length).toBe(2)
    })
  })

  describe("Spell Counterspelling picker", () => {
    it("contributes nothing until Counterspelling is checked", () => {
      renderDialog((sheet) => {
        sheet.skills.activeSkills = [{ name: SkillKey.counterspelling, rating: 5 }]
      })

      fireEvent.click(screen.getByRole("button", { name: /spell/i }))
      goNext()
      goNext()

      const poolContainer = screen.getByText(/^Defense$/).parentElement!.parentElement!
      expect(poolContainer.textContent).not.toContain("Counterspelling")
    })

    it("uses the runner's own rating for From Yourself", () => {
      renderDialog((sheet) => {
        sheet.skills.activeSkills = [{ name: SkillKey.counterspelling, rating: 5 }]
      })

      fireEvent.click(screen.getByRole("button", { name: /spell/i }))
      fireEvent.click(screen.getByRole("checkbox", { name: /counterspelling/i }))
      expect(screen.getByText(/from yourself \(5\)/i)).toBeTruthy()

      goNext()
      goNext()
      const poolContainer = screen.getByText(/^Defense$/).parentElement!.parentElement!
      expect(poolContainer.textContent).toContain(SkillKey.counterspelling)
    })

    it("uses a manually entered rating for From Another", () => {
      renderDialog()

      fireEvent.click(screen.getByRole("button", { name: /spell/i }))
      fireEvent.click(screen.getByRole("checkbox", { name: /counterspelling/i }))
      fireEvent.click(screen.getByRole("radio", { name: /from another/i }))

      const counter = screen.getByRole("textbox")
      fireEvent.focus(counter)
      fireEvent.change(counter, { target: { value: "6" } })
      fireEvent.blur(counter)

      goNext()
      goNext()
      const poolContainer = screen.getByText(/^Defense$/).parentElement!.parentElement!
      expect(poolContainer.textContent).toContain("Counterspelling (Other)6")
    })
  })

  describe("Modifiers step", () => {
    it("shows a fixed, checked Wounded checkbox only when the wound modifier is at least 1", () => {
      renderDialog((sheet) => {
        sheet.damage.physical = 3
      })

      fireEvent.click(screen.getByRole("button", { name: /melee/i }))
      goNext()

      const wounded = screen.getByRole("checkbox", { name: /wounded/i })
      expect((wounded as HTMLInputElement).checked).toBe(true)
      expect((wounded as HTMLInputElement).disabled).toBe(true)
    })

    it("hides the Wounded checkbox when undamaged", () => {
      renderDialog()

      fireEvent.click(screen.getByRole("button", { name: /melee/i }))
      goNext()

      expect(screen.queryByRole("checkbox", { name: /wounded/i })).toBeNull()
    })

    it("applies a checked toggle modifier's value to the total", () => {
      renderDialog()

      fireEvent.click(screen.getByRole("button", { name: /melee/i }))
      goNext()
      fireEvent.click(screen.getByRole("checkbox", { name: /you're prone/i }))
      goNext()

      const poolContainer = screen.getByText(/^Defense$/).parentElement!.parentElement!
      expect(poolContainer.textContent).toContain("You're prone")
    })

    it("reveals a # of Attacks counter only once the previous-defenses checkbox is checked", () => {
      renderDialog()

      fireEvent.click(screen.getByRole("button", { name: /melee/i }))
      goNext()

      expect(screen.queryByText(/# of attacks/i)).toBeNull()

      fireEvent.click(screen.getByRole("checkbox", { name: /defended against previous attacks/i }))
      expect(screen.getByText(/# of attacks/i)).toBeTruthy()

      goNext()
      const poolContainer = screen.getByText(/^Defense$/).parentElement!.parentElement!
      expect(poolContainer.textContent).toContain("(1)")
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

    it("shows Cover and firing method as exclusive radio groups defaulting to No Cover / Normal Attack", () => {
      renderDialog()

      fireEvent.click(screen.getByRole("button", { name: /ranged/i }))
      goNext()

      const noCover = screen.getByRole("radio", { name: /no cover/i })
      const goodCover = screen.getByRole("radio", { name: /good cover/i })
      expect((noCover as HTMLInputElement).checked).toBe(true)

      fireEvent.click(goodCover)
      expect((goodCover as HTMLInputElement).checked).toBe(true)
      expect((noCover as HTMLInputElement).checked).toBe(false)

      expect(screen.getByRole("radio", { name: /normal attack/i })).toBeTruthy()
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

  describe("Direct vs Indirect combat spells", () => {
    it("defaults to Direct: resist step reuses the Defense roll, with no separate attribute/armor test", () => {
      renderDialog((sheet) => {
        sheet.skills.activeSkills = [{ name: SkillKey.counterspelling, rating: 4 }]
      })

      fireEvent.click(screen.getByRole("button", { name: /spell/i }))
      fireEvent.click(screen.getByRole("checkbox", { name: /counterspelling/i }))
      goNext()
      goNext()
      goNext()

      expect(screen.getByText(/defense roll to resist damage/i)).toBeTruthy()
      const poolContainer = screen.getByText(/^Resist Damage$/).parentElement!.parentElement!
      expect(poolContainer.textContent).toContain(SkillKey.counterspelling)
      expect(poolContainer.textContent).not.toContain("Armor")
    })

    it("Indirect: defense uses Reaction + Counterspelling, resist uses Body + half Impact armor", () => {
      renderDialog((sheet) => {
        const jacket: ArmorData = {
          kind: EntityKind.item, items: { parentId: null, childIds: [] },
          id: "00000000-0000-0000-0000-000000000001",
          name: "Test Jacket",
          itemType: ItemType.armor,
          equipped: true,
          ballistic: 8,
          impact: 6,
        }
        getItemCatalog(sheet)[jacket.id] = jacket
      })

      fireEvent.click(screen.getByRole("button", { name: /spell/i }))
      fireEvent.click(screen.getByRole("button", { name: /^indirect$/i }))

      // Damage Type (Physical/Mana) only matters for Direct spells.
      expect(screen.queryByRole("button", { name: /physical \(body\)/i })).toBeNull()

      goNext()
      goNext()

      const defensePool = screen.getByText(/^Defense$/).parentElement!.parentElement!
      expect(defensePool.textContent).toContain("REA")

      goNext()

      expect(screen.queryByText(/defense roll to resist damage/i)).toBeNull()
      const resistPool = screen.getByText(/^Resist Damage$/).parentElement!.parentElement!
      expect(resistPool.textContent).toContain("BOD")
      expect(resistPool.textContent).toContain("Armor (Impact, half)3")
    })
  })

  describe("Resist Damage step", () => {
    it("includes the worn effective armor value for a physical attack", () => {
      renderDialog((sheet) => {
        const jacket: ArmorData = {
          kind: EntityKind.item, items: { parentId: null, childIds: [] },
          id: "00000000-0000-0000-0000-000000000001",
          name: "Test Jacket",
          itemType: ItemType.armor,
          equipped: true,
          ballistic: 8,
          impact: 6,
          damage: { ballistic: 2, impact: 1 },
        }
        getItemCatalog(sheet)[jacket.id] = jacket
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

    it("does not apply armor for a spell attack", () => {
      renderDialog((sheet) => {
        const jacket: ArmorData = {
          kind: EntityKind.item, items: { parentId: null, childIds: [] },
          id: "00000000-0000-0000-0000-000000000001",
          name: "Test Jacket",
          itemType: ItemType.armor,
          equipped: true,
          ballistic: 8,
          impact: 6,
        }
        getItemCatalog(sheet)[jacket.id] = jacket
      })

      fireEvent.click(screen.getByRole("button", { name: /spell/i }))
      goNext()
      goNext()
      goNext()

      expect(screen.queryByRole("button", { name: /ballistic/i })).toBeNull()
      const poolContainer = screen.getByText(/^Resist Damage$/).parentElement!.parentElement!
      expect(poolContainer.textContent).not.toContain("Armor")
    })

    it("shows both the Physical and Stun damage tracks for quick adjustment", () => {
      renderDialog()

      fireEvent.click(screen.getByRole("button", { name: /melee/i }))
      goNext()
      goNext()
      goNext()

      expect(screen.getByText("Physical")).toBeTruthy()
      expect(screen.getByText("Stun")).toBeTruthy()
      expect(screen.getAllByRole("button", { name: /^reset$/i })).toHaveLength(2)
    })
  })
})
