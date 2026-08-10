import { describe, expect, it } from "vitest"

import type { ArmorData } from "#/system/gear/armorData.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { selectArmorTotal, selectItemsOfType } from "./item.selectors.ts"

describe("item selectors", () => {
  describe("selectArmorTotal", () => {
    it("returns the same reference across calls when the underlying gear hasn't changed", () => {
      // Arrange — reselect memoization is the whole point of pulling these out of the catalog
      // factory: a call site that re-derives `item.armor.total` on every render shouldn't get a
      // new object each time if nothing armor-related actually changed.
      const [jacket] = createItem<ArmorData>({
        name: "Armor Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4, equipped: true,
      })
      const sheet = runnerDataFactory((s) => {
        s.gear = createItemMap([jacket])
        return s
      })

      // Act
      const first = selectArmorTotal(sheet)
      const second = selectArmorTotal(sheet)

      // Assert
      expect(second).toBe(first)
    })
  })

  describe("selectItemsOfType", () => {
    it("returns the same reference across calls for the same type when gear hasn't changed", () => {
      // Arrange
      const [jacket] = createItem<ArmorData>({
        name: "Armor Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4,
      })
      const sheet = runnerDataFactory((s) => {
        s.gear = createItemMap([jacket])
        return s
      })
      const selectArmor = selectItemsOfType(ItemType.armor)

      // Act
      const first = selectArmor(sheet)
      const second = selectArmor(sheet)

      // Assert
      expect(second).toBe(first)
    })

    it("caches a separate selector per item type", () => {
      // Arrange
      const selectArmor = selectItemsOfType(ItemType.armor)

      // Act
      const selectArmorAgain = selectItemsOfType(ItemType.armor)
      const selectImplants = selectItemsOfType(ItemType.implant)

      // Assert
      expect(selectArmorAgain).toBe(selectArmor)
      expect(selectImplants).not.toBe(selectArmor)
    })
  })
})
