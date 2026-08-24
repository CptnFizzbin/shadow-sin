import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { AnyItemDetails } from "./anyItemDetails.tsx"

const weapon: WeaponData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000001",
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  weaponType: WeaponType.firearm,
  skill: SkillKey.pistols,
  dmg: "8P",
}

const runnerStoreWithWeapon = () =>
  new RunnerDataStore(runnerDataFactory({ override: (runner) => ({ ...runner, gear: { [weapon.id]: weapon } }) }))

describe("AnyItemDetails", () => {
  it("dispatches weapons to WeaponItemDetails", () => {
    renderWithProviders(<AnyItemDetails item={weapon} />, { runnerStore: runnerStoreWithWeapon() })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("DV")).toBeDefined()
    expect(screen.getByText("8P")).toBeDefined()
  })

  it("falls back to ItemDetailsRoot for item types without a typed details view", () => {
    const item: ItemData = {
      kind: EntityKind.item, items: { parentId: null, childIds: [] },
      id: "00000000-0000-0000-0000-000000000002",
      name: "Fake SIN",
      itemType: ItemType.other,
    }

    renderWithProviders(<AnyItemDetails item={item} />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ override: (runner) => ({ ...runner, gear: { [item.id]: item } }) })),
    })

    expect(screen.getByText("Fake SIN")).toBeDefined()
  })
})
