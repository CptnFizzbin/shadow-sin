import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { AgentData } from "#/system/model/items/agentData.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import { ProgramType } from "#/system/model/items/programData.ts"
import type { WeaponData } from "#/system/model/items/weaponData.ts"
import { WeaponType } from "#/system/model/items/weaponData.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"
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
  runnerDataFactory({ items: { [weapon.id]: weapon } })

const agent: AgentData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: "00000000-0000-0000-0000-000000000004",
  name: "Griffin",
  itemType: ItemType.program,
  programType: ProgramType.agent,
  rating: 3,
  attributes: { system: 4, firewall: 2 },
  damage: { matrix: 0 },
}

describe("AnyItemDetails", () => {
  it("dispatches weapons to WeaponItemDetails", () => {
    renderWithProviders(<AnyItemDetails item={weapon} />, { runner: runnerStoreWithWeapon() })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("DV")).toBeDefined()
    expect(screen.getByText("8P")).toBeDefined()
  })

  it("dispatches Agents (Program items with programType agent) to AgentItemDetails", () => {
    renderWithProviders(<AnyItemDetails item={agent} />, {
      runner: runnerDataFactory({ items: { [agent.id]: agent } }),
    })

    expect(screen.getByText("Griffin")).toBeDefined()
    expect(screen.getByText("System")).toBeDefined()
    expect(screen.getByText("Firewall")).toBeDefined()
  })

  it("falls back to ItemDetailsRoot for item types without a typed details view", () => {
    const item: ItemData = {
      kind: EntityKind.item, items: { parentId: null, childIds: [] },
      id: "00000000-0000-0000-0000-000000000002",
      name: "Fake SIN",
      itemType: ItemType.other,
    }

    renderWithProviders(<AnyItemDetails item={item} />, {
      runner: runnerDataFactory({ items: { [item.id]: item } }),
    })

    expect(screen.getByText("Fake SIN")).toBeDefined()
  })
})
