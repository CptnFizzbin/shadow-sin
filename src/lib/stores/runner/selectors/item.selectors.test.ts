import { describe, expect, it } from "vitest"

import type { ArmorData } from "#/system/gear/armorData.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { selectArmorTotal, selectItemsOfType } from "./item.selectors.ts"

describe("item selectors", () => {
  describe("selectArmorTotal", () => {
    it("returns the same reference across calls when the underlying gear hasn't changed", () => {
      // Arrange
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

      // Assert — reselect memoization: no new object when nothing armor-related changed
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

      // Act
      const first = selectItemsOfType(sheet, ItemType.armor)
      const second = selectItemsOfType(sheet, ItemType.armor)

      // Assert
      expect(second).toBe(first)
    })

    it("caches a separate selector per item type", () => {
      // Arrange
      const sheet = runnerDataFactory()

      // Act
      const armorFirstCall = selectItemsOfType(sheet, ItemType.armor)
      const armorSecondCall = selectItemsOfType(sheet, ItemType.armor)
      const implants = selectItemsOfType(sheet, ItemType.implant)

      // Assert
      expect(armorSecondCall).toBe(armorFirstCall)
      expect(implants).not.toBe(armorFirstCall)
    })
  })
})
