import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { WeaponData } from "#/system/model/items/weaponData.ts"
import { WeaponType } from "#/system/model/items/weaponData.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { useWeaponForm } from "./useWeaponForm.tsx"

describe("useWeaponForm", () => {
  it("always defaults to ItemType.weapon", () => {
    const { result } = renderHook(() => useWeaponForm({ onSubmit: vi.fn() }))
    expect(result.current.state.values.itemType).toBe(ItemType.weapon)
  })

  describe("weaponType override", () => {
    it("pre-selects the given weaponType and its matching attribute", () => {
      const { result } = renderHook(() => useWeaponForm({ weaponType: WeaponType.melee, onSubmit: vi.fn() }))
      expect(result.current.state.values.weaponType).toBe(WeaponType.melee)
      expect(result.current.state.values.attribute).toBe(AttributeKey.strength)
    })

    it("defaults to firearm with the agility attribute when no override is given", () => {
      const { result } = renderHook(() => useWeaponForm({ onSubmit: vi.fn() }))
      expect(result.current.state.values.weaponType).toBe(WeaponType.firearm)
      expect(result.current.state.values.attribute).toBe(AttributeKey.agility)
    })
  })

  it("keeps a weapon's Matrix opt-out through an edit", async () => {
    // Arrange
    const weapon: WeaponData = {
      kind: EntityKind.item,
      id: crypto.randomUUID(),
      itemType: ItemType.weapon,
      name: "Survival Knife",
      weaponType: WeaponType.melee,
      skill: SkillKey.blades,
      dmg: "3",
      items: { parentId: null, childIds: [] },
      matrixDisabled: true,
    }
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useWeaponForm({ weapon, onSubmit }))

    // Act
    await act(() => result.current.handleSubmit())

    // Assert
    expect(onSubmit).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ matrixDisabled: true }),
      expect.anything(),
    )
  })
})
