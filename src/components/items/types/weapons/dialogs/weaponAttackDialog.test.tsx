import Button from "@mui/material/Button"
import { act, fireEvent, screen, within } from "@testing-library/react"
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

function openCalculator() {
  const Wrapper: FC = () => {
    const weaponAttackDialog = useWeaponAttackDialog()
    return (
      <>
        <Button onClick={() => weaponAttackDialog.open({ weapon: pistol })}>Attack</Button>
        {weaponAttackDialog.dialog}
      </>
    )
  }

  renderWithProviders(<Wrapper />, { runnerStore: buildRunnerStore() })
  fireEvent.click(screen.getByRole("button", { name: /attack/i }))
  return screen.findByRole("dialog", { name: "Test Pistol" })
}

const goNext = (dialog: HTMLElement) => fireEvent.click(within(dialog).getByRole("button", { name: /^next$/i }))

describe("WeaponAttackDialog", () => {
  it("opens directly on the clicked weapon's wizard, at the Attack Skill step", async () => {
    // Arrange / Act
    const dialog = await openCalculator()

    // Assert
    expect(within(dialog).getByText(/step 1 of 3.*attack skill/i)).toBeTruthy()
  })

  it("the back button reaches a hub listing every equipped weapon", async () => {
    // Arrange
    const dialog = await openCalculator()

    // Act
    fireEvent.click(within(dialog).getByRole("button", { name: /back to weapons/i }))

    // Assert
    expect(within(dialog).getByRole("button", { name: /test pistol/i })).toBeTruthy()
    expect(within(dialog).getByRole("button", { name: /combat knife/i })).toBeTruthy()
    expect(within(dialog).queryByRole("button", { name: /back to weapons/i })).toBeNull()
  })

  it("switching weapons from the hub drills into that weapon's own wizard", async () => {
    // Arrange
    const dialog = await openCalculator()
    fireEvent.click(within(dialog).getByRole("button", { name: /back to weapons/i }))

    // Act
    fireEvent.click(within(dialog).getByRole("button", { name: /combat knife/i }))

    // Assert
    expect(within(dialog).getByText(/step 1 of 3.*attack skill/i)).toBeTruthy()
    expect(within(dialog).getByRole("button", { name: /blades/i })).toBeTruthy()
  })

  it("pages forward through the wizard and back again", async () => {
    // Arrange
    const dialog = await openCalculator()
    expect(within(dialog).getByText(/step 1 of 3/i)).toBeTruthy()

    // Act / Assert
    goNext(dialog)
    expect(within(dialog).getByText(/step 2 of 3.*modifiers/i)).toBeTruthy()

    goNext(dialog)
    expect(within(dialog).getByText(/step 3 of 3.*total/i)).toBeTruthy()
    expect(within(dialog).queryByRole("button", { name: /^next$/i })).toBeNull()

    fireEvent.click(within(dialog).getByRole("button", { name: /^back$/i }))
    expect(within(dialog).getByText(/step 2 of 3/i)).toBeTruthy()
  })

  it("only offers Melee Modifiers when the weapon is melee", async () => {
    // Arrange: the pistol is ranged, so no melee modifiers should be offered
    const dialog = await openCalculator()
    goNext(dialog)
    expect(within(dialog).queryByText(/superior position/i)).toBeNull()

    // Act: switch to the melee weapon
    fireEvent.click(within(dialog).getByRole("button", { name: /^back$/i }))
    fireEvent.click(within(dialog).getByRole("button", { name: /back to weapons/i }))
    fireEvent.click(within(dialog).getByRole("button", { name: /combat knife/i }))
    goNext(dialog)

    // Assert
    expect(within(dialog).getByText(/superior position/i)).toBeTruthy()
  })

  it("hides an untrained skill from the picker until Show Defaulting Skills is enabled", async () => {
    // Arrange: the pistol's candidates include Automatics, which isn't trained
    const dialog = await openCalculator()

    // Assert
    expect(within(dialog).queryByRole("button", { name: /automatics/i })).toBeNull()

    // Act
    fireEvent.click(within(dialog).getByRole("checkbox", { name: /show defaulting skills/i }))

    // Assert
    expect(within(dialog).getByRole("button", { name: /automatics/i })).toBeTruthy()
  })

  it("selecting a different skill changes the pool used on the Total step", async () => {
    // Arrange
    const dialog = await openCalculator()
    goNext(dialog)
    goNext(dialog)
    const poolWithPistols = within(dialog).getByText(/^Attack$/).parentElement!.textContent

    fireEvent.click(within(dialog).getByRole("button", { name: /^back$/i }))
    fireEvent.click(within(dialog).getByRole("button", { name: /^back$/i }))
    fireEvent.click(within(dialog).getByRole("checkbox", { name: /show defaulting skills/i }))
    fireEvent.click(within(dialog).getByRole("button", { name: /automatics/i }))

    // Act
    goNext(dialog)
    goNext(dialog)
    const poolWithAutomatics = within(dialog).getByText(/^Attack$/).parentElement!.textContent

    // Assert
    expect(poolWithAutomatics).not.toEqual(poolWithPistols)
  })

  it("applies a checked melee modifier's value to the Attack pool", async () => {
    // Arrange
    const dialog = await openCalculator()
    fireEvent.click(within(dialog).getByRole("button", { name: /back to weapons/i }))
    fireEvent.click(within(dialog).getByRole("button", { name: /combat knife/i }))
    goNext(dialog)

    // Act
    fireEvent.click(within(dialog).getByRole("checkbox", { name: /superior position/i }))
    goNext(dialog)

    // Assert
    const poolContainer = within(dialog).getByText(/^Attack$/).parentElement!.parentElement!
    expect(poolContainer.textContent).toContain("Superior position")
  })

  describe("rolling the Attack Test", () => {
    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    })

    it("shows Net Hits and Total DV once the roll settles and defense hits are entered", async () => {
      // Arrange
      vi.spyOn(DiceRoller.prototype, "rollD6").mockReturnValue(5)
      const dialog = await openCalculator()
      goNext(dialog)
      goNext(dialog)

      const poolText = within(dialog).getByText(/^Attack$/).parentElement?.textContent ?? ""
      const poolTotal = Number(/Attack(\d+)/.exec(poolText.replace(/\s/g, ""))?.[1])

      // Act
      vi.useFakeTimers()
      fireEvent.click(within(dialog).getByRole("button", { name: /roll attack test/i }))
      act(() => {
        vi.runAllTimers()
      })
      fireEvent.change(within(dialog).getByLabelText(/defense hits/i), { target: { value: "1" } })

      // Assert
      const expectedNetHits = poolTotal - 1
      const netHitsCell = within(dialog).getByText("Net Hits").parentElement
      const totalDvCell = within(dialog).getByText("Total DV").parentElement
      expect(netHitsCell?.textContent).toContain(String(expectedNetHits))
      expect(totalDvCell?.textContent).toContain(`${4 + expectedNetHits}P`)
    })
  })
})
