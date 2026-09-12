import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"
import { ItemType } from "#/system/itemType.ts"

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
})
