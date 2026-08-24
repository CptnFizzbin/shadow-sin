import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { FirearmData, MeleeWeaponData, WeaponData } from "#/system/gear/weaponData.ts"
import { FirearmAttachmentPoint, MeleeWeaponType, WeaponType } from "#/system/gear/weaponData.ts"
import { FirearmTypeKey } from "#/system/gear/weapons/firearms/firearmTypeKey.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { WeaponDataCard } from "./weaponDataCard.tsx"

const weapon: WeaponData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  weaponType: WeaponType.firearm,
  skill: SkillKey.pistols,
  dmg: "8P",
  equipped: false,
}

const firearm: FirearmData = {
  ...weapon,
  weaponType: WeaponType.firearm,
  firearmType: FirearmTypeKey.heavyPistol,
  firemodes: ["SA"],
  recoil: 0,
  attachmentPoints: [FirearmAttachmentPoint.Top, FirearmAttachmentPoint.Under],
  ammo: { size: 15, remaining: 12, type: "clip" },
}

const meleeWeapon: MeleeWeaponData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000002",
  name: "Combat Knife",
  itemType: ItemType.weapon,
  weaponType: WeaponType.melee,
  skill: SkillKey.blades,
  dmg: "4P",
  reach: 0,
  meleeType: MeleeWeaponType.blade,
}

const accessory: ItemData = {
  kind: EntityKind.item,
  id: "00000000-0000-0000-0000-000000000003",
  name: "Smartgun System",
  itemType: ItemType.firearmAccessory,
  items: { parentId: weapon.id, childIds: [] },
}

const renderWeaponCard = (data: WeaponData, extraGear: Record<string, ItemData> = {}) => {
  const runnerStore = new RunnerDataStore(
    runnerDataFactory({ override: (runner) => ({ ...runner, gear: { [data.id]: data, ...extraGear } }) }),
  )
  renderWithProviders(<WeaponDataCard weapon={data} />, { runnerStore })
  return runnerStore
}

describe("WeaponDataCard", () => {
  it("renders DV, Skill, and nonzero AP", () => {
    // Arrange / Act
    renderWeaponCard({ ...weapon, ap: -1 })

    // Assert
    expect(screen.getByText("DV: 8P")).toBeDefined()
    expect(screen.getByText(SkillKey.pistols)).toBeDefined()
    expect(screen.getByText("AP: -1")).toBeDefined()
  })

  it("hides AP when it is zero", () => {
    // Arrange / Act
    renderWeaponCard({ ...weapon, ap: 0 })

    // Assert
    expect(screen.queryByText(/^AP:/)).toBeNull()
  })

  it("renders firearm-specific fields including zero RC and Ammo", () => {
    // Arrange / Act
    renderWeaponCard(firearm)

    // Assert
    expect(screen.getByText(FirearmTypeKey.heavyPistol)).toBeDefined()
    expect(screen.getByText("SA")).toBeDefined()
    expect(screen.getByText("RC: 0")).toBeDefined()
    expect(screen.getByText("Mounts: Top/Under")).toBeDefined()
    expect(screen.getByText("Ammo: 12/15")).toBeDefined()
  })

  it("renders melee-specific fields including zero Reach", () => {
    // Arrange / Act
    renderWeaponCard(meleeWeapon)

    // Assert
    expect(screen.getByText("Reach: 0")).toBeDefined()
    expect(screen.getByText(`Type: ${MeleeWeaponType.blade}`)).toBeDefined()
  })

  it("renders accessories as nested subitems", () => {
    // Arrange / Act
    renderWeaponCard({ ...weapon, items: { ...weapon.items, childIds: [accessory.id] } }, { [accessory.id]: accessory })

    // Assert
    expect(screen.getByText("Smartgun System")).toBeDefined()
  })

  it("offers an Equip action when unequipped", () => {
    // Arrange
    renderWeaponCard(weapon)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))

    // Assert
    expect(screen.getByRole("menuitem", { name: "Equip" })).toBeDefined()
  })

  it("offers an Unequip action when equipped", () => {
    // Arrange
    renderWeaponCard({ ...weapon, equipped: true })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))

    // Assert
    expect(screen.getByRole("menuitem", { name: "Unequip" })).toBeDefined()
  })

  it("dispatches the equipped toggle when the action is chosen", () => {
    // Arrange
    const runnerStore = renderWeaponCard(weapon)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Equip" }))

    // Assert
    expect(getItemCatalog(runnerStore.getState())[weapon.id].equipped).toBe(true)
  })

  it("offers a Remove action", () => {
    // Arrange
    renderWeaponCard(weapon)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))

    // Assert
    expect(screen.getByRole("menuitem", { name: "Remove" })).toBeDefined()
  })
})
