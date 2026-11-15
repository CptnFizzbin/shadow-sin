import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AvailableGearFilter } from "#/components/entities/items/viewer/availableGearFilter.tsx"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { WeaponData } from "#/system/model/items/weaponData.ts"
import { WeaponType } from "#/system/model/items/weaponData.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { AvailableWeaponsSection } from "./availableWeaponsSection.tsx"

const makeWeapon = (id: string, name: string, overrides: Partial<WeaponData> = {}): WeaponData => ({
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: id as UUID,
  name,
  itemType: ItemType.weapon,
  weaponType: WeaponType.firearm,
  skill: SkillKey.pistols,
  dmg: "5P",
  ...overrides,
})

const holdout = makeWeapon("00000000-0000-0000-0000-000000000001", "Holdout Pistol")
const predator = makeWeapon("00000000-0000-0000-0000-000000000002", "Ares Predator V", { state: ItemState.equipped })
const shotgun = makeWeapon("00000000-0000-0000-0000-000000000003", "Sawed-Off Shotgun", { state: ItemState.stashed })

const renderSection = () => renderWithRunner(
  <AvailableGearFilter>
    <AvailableWeaponsSection />
  </AvailableGearFilter>,
  { [holdout.id]: holdout, [predator.id]: predator, [shotgun.id]: shotgun },
)

describe("AvailableWeaponsSection", () => {
  it("lists carried weapons as well as equipped ones, equipped first", () => {
    // Arrange / Act
    renderSection()

    // Assert
    const names = screen.getAllByText(/Holdout Pistol|Ares Predator V/).map((element) => element.textContent)
    expect(names).toEqual(["Ares Predator V", "Holdout Pistol"])
  })

  it("leaves stashed weapons out", () => {
    // Arrange / Act
    renderSection()

    // Assert
    expect(screen.queryByText("Sawed-Off Shotgun")).toBeNull()
  })

  it("gives each weapon an Attack button", () => {
    // Arrange / Act
    renderSection()

    // Assert
    expect(screen.getAllByRole("button", { name: "Attack" })).toHaveLength(2)
  })
})
