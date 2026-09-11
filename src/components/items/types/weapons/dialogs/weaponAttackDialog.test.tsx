import Button from "@mui/material/Button"
import { act, fireEvent, screen } from "@testing-library/react"
import type { FC } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DiceRoller } from "#/system/dice/diceRoller.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { FirearmData, MeleeWeaponData } from "#/system/gear/weaponData.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { WeaponAttackDialogPom } from "./weaponAttackDialog.testLib.ts"
import { useWeaponAttackDialog } from "./weaponAttackDialog.tsx"

const pistol: FirearmData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Test Pistol",
  itemType: ItemType.weapon,
  weaponType: WeaponType.firearm,
  firearmType: "light pistol" as FirearmData["firearmType"],
  dmg: "4P",
  ap: -1,
  skill: SkillKey.pistols,
  attribute: AttributeKey.agility,
  equipped: true,
  recoil: 0,
  firemodes: ["SA"],
  ammo: { size: 15, remaining: 15, type: "clip" },
}

const knife: MeleeWeaponData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000002",
  name: "Combat Knife",
  itemType: ItemType.weapon,
  weaponType: WeaponType.melee,
  dmg: "5P",
  skill: SkillKey.blades,
  attribute: AttributeKey.agility,
  equipped: true,
  reach: 0,
}

function buildRunnerStore() {
  return new RunnerDataStore(runnerDataFactory({
    items: {
      [pistol.id]: pistol,
      [knife.id]: knife,
    },
    afterBuild: (runner) => {
      runner.skills = {
        ...runner.skills,
        activeSkills: [
          { name: SkillKey.pistols, rating: 4 },
          { name: SkillKey.blades, rating: 2 },
        ],
      }
    },
  }))
}

async function openCalculator() {
  const Wrapper: FC = () => {
    const weaponAttackDialog = useWeaponAttackDialog()
    return (
      <>
        <Button onClick={() => weaponAttackDialog.open({ weapon: pistol })}>Attack</Button>
        {weaponAttackDialog.outlet}
      </>
    )
  }

  renderWithProviders(<Wrapper />, { runnerStore: buildRunnerStore() })
  fireEvent.click(screen.getByRole("button", { name: /attack/i }))

  const dialog = await screen.findByRole("dialog", { name: "Test Pistol" })
  return new WeaponAttackDialogPom(dialog)
}

describe("WeaponAttackDialog", () => {
  it("opens directly on the clicked weapon's wizard, at the Skill step", async () => {
    // Arrange / Act
    const dialog = await openCalculator()

    // Assert
    expect(dialog.within().getByText(/default skill/i)).toBeTruthy()
  })

  it("the back button reaches a hub listing every equipped weapon", async () => {
    // Arrange
    const dialog = await openCalculator()

    // Act
    dialog.clickBackToWeapons()

    // Assert
    expect(dialog.within().getByRole("button", { name: /test pistol/i })).toBeTruthy()
    expect(dialog.within().getByRole("button", { name: /combat knife/i })).toBeTruthy()
    expect(dialog.within().queryByRole("button", { name: /back to weapons/i })).toBeNull()
  })
  it("switching weapons from the hub drills into that weapon's own wizard", async () => {
    // Arrange
    const dialog = await openCalculator()

    dialog.clickBackToWeapons()

    // Act
    dialog.selectWeapon("combat knife")

    // Assert
    expect(dialog.within().getByText(/default skill/i)).toBeTruthy()
    expect(dialog.within().getByRole("button", { name: /blades/i })).toBeTruthy()
  })

  it("pages forward through the wizard and back again", async () => {
    // Arrange
    const dialog = await openCalculator()

    expect(dialog.getStepHeader()).toContain("Select Skill")

    // Act / Assert
    dialog.goNext()
    expect(dialog.getStepHeader()).toContain("Select Modifiers")

    dialog.goNext()
    expect(dialog.getStepHeader()).toContain("Attack Totals")
    expect(dialog.within().queryByRole("button", { name: /^next$/i })).toBeNull()

    dialog.goBack()
    expect(dialog.getStepHeader()).toContain("Select Modifiers")
  })

  it("only offers Melee Modifiers when the weapon is melee", async () => {
    // Arrange
    const dialog = await openCalculator()

    // Act
    dialog.clickBackToWeapons()
    dialog.selectWeapon("combat knife")
    dialog.goNext()

    // Assert
    expect(dialog.within().getByText(/superior position/i)).toBeTruthy()
  })

  it("shows the weapon's default skill separately at the top of the skill picker", async () => {
    // Arrange: enable defaulting skills so Automatics (the pistol's only other candidate) renders
    // an "Other Skills" section to compare positions against
    const dialog = await openCalculator()

    dialog.toggleShowDefaultingSkills()

    // Assert
    const defaultSkillHeading = dialog.within().getByText("Default Skill")
    const otherSkillsHeading = dialog.within().getByText("Other Skills")
    expect(defaultSkillHeading.compareDocumentPosition(otherSkillsHeading))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING)

    const pistolsButton = dialog.within().getByRole("button", { name: /pistols/i })
    expect(defaultSkillHeading.compareDocumentPosition(pistolsButton))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(otherSkillsHeading.compareDocumentPosition(pistolsButton))
      .toBe(Node.DOCUMENT_POSITION_PRECEDING)
  })

  it("offers Ranged Modifiers when the weapon is ranged, and Melee Modifiers when it's melee", async () => {
    // Arrange: the pistol is ranged, so ranged (not melee) modifiers should be offered
    const dialog = await openCalculator()

    dialog.goNext()
    expect(dialog.within().getByText(/firing while running/i)).toBeTruthy()
    expect(dialog.within().queryByText(/superior position/i)).toBeNull()

    // Act: switch to the melee weapon
    dialog.goBack()
    dialog.clickBackToWeapons()
    dialog.selectWeapon("combat knife")
    dialog.goNext()

    // Assert
    expect(dialog.within().getByText(/superior position/i)).toBeTruthy()
    expect(dialog.within().queryByText(/firing while running/i)).toBeNull()
  })

  it("applies a checked ranged modifier's value to the Attack pool", async () => {
    // Arrange
    const dialog = await openCalculator()

    dialog.goNext()

    // Act
    dialog.checkModifier("firing while running")
    dialog.goNext()

    // Assert
    const poolContainerText = dialog.getPoolContainerText()
    expect(poolContainerText).toContain("Firing while running")
  })

  it("hides an untrained skill from the picker until Show Defaulting Skills is enabled", async () => {
    // Arrange: the pistol's candidates include Automatics, which isn't trained
    const dialog = await openCalculator()

    // Assert
    expect(dialog.within().queryByRole("button", { name: /automatics/i })).toBeNull()

    // Act
    dialog.toggleShowDefaultingSkills()

    // Assert
    expect(dialog.within().getByRole("button", { name: /automatics/i })).toBeTruthy()
  })

  it("selecting a different skill changes the pool used on the Total step", async () => {
    // Arrange
    const dialog = await openCalculator()

    dialog.goNext()
    dialog.goNext()
    const poolWithPistols = dialog.within().getByText(/^Attack$/).parentElement!.textContent

    dialog.goBack()
    dialog.goBack()
    dialog.toggleShowDefaultingSkills()
    dialog.clickSkill("automatics")

    // Act
    dialog.goNext()
    dialog.goNext()
    const poolWithAutomatics = dialog.within().getByText(/^Attack$/).parentElement!.textContent

    // Assert
    expect(poolWithAutomatics).not.toEqual(poolWithPistols)
  })

  it("applies a checked melee modifier's value to the Attack pool", async () => {
    // Arrange
    const dialog = await openCalculator()

    dialog.clickBackToWeapons()
    dialog.selectWeapon("combat knife")
    dialog.goNext()

    // Act
    dialog.checkModifier("superior position")
    dialog.goNext()

    // Assert
    const poolContainerText = dialog.getPoolContainerText()
    expect(poolContainerText).toContain("Superior position")
  })

  describe("rolling the Attack Test", () => {
    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    })

    it("shows Net Hits and Total DV once the roll settles and defenseCalculator hits are entered", async () => {
      // Arrange
      vi.spyOn(DiceRoller.prototype, "rollD6").mockReturnValue(5)
      const dialog = await openCalculator()

      dialog.goNext()
      dialog.goNext()

      const poolText = dialog.getPoolText()
      const poolTotal = Number(/Attack(\d+)/.exec(poolText.replace(/\s/g, ""))?.[1])

      // Act
      vi.useFakeTimers()
      dialog.rollAttack()
      act(() => {
        vi.runAllTimers()
      })
      dialog.setDefenseHits("1")

      // Assert
      const expectedNetHits = poolTotal - 1
      const netHitsCellText = dialog.getNetHits()
      const totalDvCellText = dialog.getTotalDv()
      expect(netHitsCellText).toContain(String(expectedNetHits))
      expect(totalDvCellText).toContain(`${4 + expectedNetHits}P`)
    })
  })
})
