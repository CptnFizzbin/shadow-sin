import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { WeaponItemCard } from "./weaponItemCard.tsx"

const weapon: WeaponData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  weaponType: WeaponType.firearm,
  skill: SkillKey.pistols,
  dmg: "8P",
  equipped: false,
}

const renderWeaponCard = (data: WeaponData) => {
  const runnerStore = new RunnerDataStore(
    runnerDataFactory((runner) => ({ ...runner, gear: { [data.id]: data } })),
  )
  renderWithProviders(<WeaponItemCard weapon={data} />, { runnerStore })
  return runnerStore
}

describe("WeaponItemCard", () => {
  it("offers an Equip quick action when unequipped", () => {
    renderWeaponCard(weapon)

    fireEvent.contextMenu(screen.getByText("Ares Predator V"))

    expect(screen.getByRole("menuitem", { name: "Equip" })).toBeDefined()
  })

  it("offers an Unequip quick action when equipped", () => {
    renderWeaponCard({ ...weapon, equipped: true })

    fireEvent.contextMenu(screen.getByText("Ares Predator V"))

    expect(screen.getByRole("menuitem", { name: "Unequip" })).toBeDefined()
  })

  it("dispatches the equipped toggle when a quick action is chosen", () => {
    const runnerStore = renderWeaponCard(weapon)

    fireEvent.contextMenu(screen.getByText("Ares Predator V"))
    fireEvent.click(screen.getByRole("menuitem", { name: "Equip" }))

    expect(runnerStore.getState().gear[weapon.id].equipped).toBe(true)
  })
})
