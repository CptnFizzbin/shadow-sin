import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithProviders, ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { AnyItemCard } from "./anyItemCard.tsx"

const weapon: WeaponData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  weaponType: WeaponType.firearm,
  skill: SkillKey.pistols,
  dmg: "8P",
}

const runnerStoreWithWeapon = () =>
  new RunnerDataStore(runnerDataFactory((runner) => ({ ...runner, gear: { [weapon.id]: weapon } })))

describe("AnyItemCard", () => {
  it("dispatches weapons to WeaponDataCard", () => {
    renderWithProviders(<AnyItemCard item={weapon} />, { runnerStore: runnerStoreWithWeapon() })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("DV: 8P")).toBeDefined()
  })

  it("falls back to ItemDataCardRoot for item types without a typed card", () => {
    const item: ItemData = {
      id: "00000000-0000-0000-0000-000000000002",
      name: "Fake SIN",
      itemType: ItemType.other,
    }

    render(<AnyItemCard item={item} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Fake SIN")).toBeDefined()
  })

  it("passes onOpen through to the rendered card", () => {
    const onOpen = vi.fn()
    renderWithProviders(<AnyItemCard item={weapon} onOpen={onOpen} />, {
      runnerStore: runnerStoreWithWeapon(),
    })

    // WeaponDataCard always has its own Actions menu button (it self-handles Remove), so the
    // title text — which bubbles up to the card's own onClick — is the unambiguous target.
    fireEvent.click(screen.getByText("Ares Predator V"))

    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("passes onEdit through to the rendered card's actions menu", () => {
    const onEdit = vi.fn()
    renderWithProviders(<AnyItemCard item={weapon} onEdit={onEdit} />, {
      runnerStore: runnerStoreWithWeapon(),
    })

    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))

    expect(onEdit).toHaveBeenCalledOnce()
  })
})
