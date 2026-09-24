import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { WeaponData } from "#/system/model/items/weaponData.ts"
import { WeaponType } from "#/system/model/items/weaponData.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"
import { makeAgent } from "#testUtils/fixtures/makeAgent.ts"
import { renderWithProviders, ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { AnyItemCard } from "./anyItemCard.tsx"

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

const agent = makeAgent({ id: "00000000-0000-0000-0000-000000000004" })

describe("AnyItemCard", () => {
  it("dispatches weapons to WeaponDataCard", () => {
    renderWithProviders(<AnyItemCard item={weapon} />, { runner: runnerStoreWithWeapon() })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("DV: 8P")).toBeDefined()
  })

  it("falls back to ItemCard for item types without a typed card", () => {
    const item: ItemData = {
      kind: EntityKind.item, items: { parentId: null, childIds: [] },
      id: "00000000-0000-0000-0000-000000000002",
      name: "Cyberdeck Firmware",
      itemType: ItemType.software,
    }

    render(<AnyItemCard item={item} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Cyberdeck Firmware")).toBeDefined()
  })

  it("dispatches Agents (Program items with programType agent) to AgentDataCard", () => {
    renderWithProviders(<AnyItemCard item={agent} />, {
      runner: runnerDataFactory({ items: { [agent.id]: agent } }),
    })

    expect(screen.getByText("Griffin")).toBeDefined()
    expect(screen.getByText("System: 4")).toBeDefined()
    expect(screen.getByText("Firewall: 2")).toBeDefined()
  })

  it("dispatches miscellaneous items to OtherDataCard", () => {
    const item: ItemData = {
      kind: EntityKind.item, items: { parentId: null, childIds: [] },
      id: "00000000-0000-0000-0000-000000000003",
      name: "Survival Kit",
      itemType: ItemType.other,
    }

    renderWithProviders(<AnyItemCard item={item} />, {
      runner: runnerDataFactory({ items: { [item.id]: item } }),
    })

    expect(screen.getByText("Survival Kit")).toBeDefined()
  })

  it("passes onOpen through to the rendered card", () => {
    const onOpen = vi.fn()
    renderWithProviders(<AnyItemCard item={weapon} onOpen={onOpen} />, {
      runner: runnerStoreWithWeapon(),
    })

    // WeaponDataCard always has its own Actions menu button (it self-handles Remove), so the
    // title text — which bubbles up to the card's own onClick — is the unambiguous target.
    fireEvent.click(screen.getByText("Ares Predator V"))

    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("passes onEdit through to the rendered card's actions menu", () => {
    const onEdit = vi.fn()
    renderWithProviders(<AnyItemCard item={weapon} onEdit={onEdit} />, {
      runner: runnerStoreWithWeapon(),
    })

    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))

    expect(onEdit).toHaveBeenCalledOnce()
  })
})
