import { act, fireEvent, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { EquippedWeaponCard } from "#/components/items/types/weapons/equippedWeaponCard.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DiceRoller } from "#/system/dice/diceRoller.ts"
import type { FirearmData, MeleeWeaponData } from "#/system/gear/weaponData.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

const pistol: FirearmData = {
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
  return new RunnerDataStore(runnerDataFactory((runner) => ({
    ...runner,
    skills: {
      ...runner.skills,
      activeSkills: [
        { name: SkillKey.pistols, rating: 4 },
        { name: SkillKey.blades, rating: 2 },
      ],
    },
    gear: {
      [pistol.id]: pistol,
      [knife.id]: knife,
    },
  })))
}

function openCalculator() {
  renderWithProviders(<EquippedWeaponCard weapon={pistol} />, { runnerStore: buildRunnerStore() })
  fireEvent.click(screen.getByRole("button", { name: /attack/i }))
  return screen.findByRole("dialog", { name: "Test Pistol" })
}

describe("WeaponAttackDialog", () => {
  it("opens on a hub listing Weapon, Skill, Modifiers, and Result", async () => {
    // Arrange / Act
    const dialog = await openCalculator()

    // Assert
    expect(within(dialog).getByRole("button", { name: /^weapon/i })).toBeDefined()
    expect(within(dialog).getByRole("button", { name: /^skill/i })).toBeDefined()
    expect(within(dialog).getByRole("button", { name: /^modifiers/i })).toBeDefined()
    expect(within(dialog).getByRole("button", { name: /^result/i })).toBeDefined()
  })

  it("switching weapons on the Weapon step updates the hub's default skill", async () => {
    // Arrange
    const dialog = await openCalculator()
    fireEvent.click(within(dialog).getByRole("button", { name: /^weapon/i }))

    // Act: switch from the pistol to the knife
    fireEvent.click(await within(dialog).findByRole("button", { name: /combat knife/i }))
    fireEvent.click(within(dialog).getByRole("button", { name: /back to attack calculator/i }))

    // Assert
    const skillRow = within(dialog).getByRole("button", { name: /^skill/i })
    expect(skillRow.textContent).toContain(SkillKey.blades)
  })

  it("selecting a different skill on the Skill step is reflected on the hub", async () => {
    // Arrange
    const dialog = await openCalculator()
    fireEvent.click(within(dialog).getByRole("button", { name: /^skill/i }))

    // Act
    fireEvent.click(await within(dialog).findByRole("button", { name: new RegExp(SkillKey.automatics, "i") }))
    fireEvent.click(within(dialog).getByRole("button", { name: /back to attack calculator/i }))

    // Assert
    const skillRow = within(dialog).getByRole("button", { name: /^skill/i })
    expect(skillRow.textContent).toContain(SkillKey.automatics)
  })

  it("toggling a melee attack modifier changes the pool total shown on the Result step", async () => {
    // Arrange: switch to the melee weapon so Attack Modifiers are interactive
    const dialog = await openCalculator()
    fireEvent.click(within(dialog).getByRole("button", { name: /^weapon/i }))
    fireEvent.click(await within(dialog).findByRole("button", { name: /combat knife/i }))
    fireEvent.click(within(dialog).getByRole("button", { name: /back to attack calculator/i }))

    const poolBefore = within(dialog).getByRole("button", { name: /^result/i }).textContent

    // Act
    fireEvent.click(within(dialog).getByRole("button", { name: /^modifiers/i }))
    fireEvent.click(await within(dialog).findByRole("switch", { name: /superior position/i }))
    fireEvent.click(within(dialog).getByRole("button", { name: /back to attack calculator/i }))

    // Assert
    const poolAfter = within(dialog).getByRole("button", { name: /^result/i }).textContent
    expect(poolAfter).not.toEqual(poolBefore)
  })

  describe("rolling the Attack Test", () => {
    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    })

    it("shows Net Hits and Total DV once the roll settles and defense hits are entered", async () => {
      // Arrange: force every die to roll a 5 (a hit). Fake timers are enabled only after the
      // dialog has opened — RTL's async queries poll via real timers, so faking them earlier
      // would hang `openCalculator`'s `findByRole`.
      vi.spyOn(DiceRoller.prototype, "rollD6").mockReturnValue(5)
      const dialog = await openCalculator()

      const resultRowText = within(dialog).getByRole("button", { name: /^result/i }).textContent ?? ""
      const poolTotal = Number(/Attack pool: (\d+)/.exec(resultRowText)?.[1])

      fireEvent.click(within(dialog).getByRole("button", { name: /^result/i }))

      // Act
      vi.useFakeTimers()
      fireEvent.click(within(dialog).getByRole("button", { name: /roll attack test/i }))
      act(() => {
        vi.runAllTimers()
      })
      fireEvent.change(within(dialog).getByLabelText(/defense hits/i), { target: { value: "1" } })

      // Assert: every die is a hit, so rolled hits === poolTotal; net hits = poolTotal - 1
      // defense hit, and Total DV = base 4P + net hits.
      const expectedNetHits = poolTotal - 1
      const netHitsCell = within(dialog).getByText("Net Hits").parentElement
      const totalDvCell = within(dialog).getByText("Total DV").parentElement
      expect(netHitsCell?.textContent).toContain(String(expectedNetHits))
      expect(totalDvCell?.textContent).toContain(`${4 + expectedNetHits}P`)
    })
  })
})
