import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { initializeOptions } from "./useItemOptions.ts"

const existingItemId = crypto.randomUUID()

const baseItem: ItemData = {
  id: existingItemId,
  name: "Test Item",
  itemType: ItemType.other,
}

const newItem: ItemData = {
  ...baseItem,
  id: NullUuid,
}

describe("initializeOptions", () => {
  describe("new item (isEditMode = false)", () => {
    it("returns all toggleable options disabled by default", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false)

      // Assert
      expect(options.equipable).toBe(false)
      expect(options.licenseRequired).toBe(false)
      expect(options.licenseAlwaysShow).toBe(false)
      expect(options.hasRating).toBe(false)
      expect(options.multiple).toBe(false)
      expect(options.isSubItem).toBe(false)
      expect(options.hasEffects).toBe(false)
      expect(options.showCost).toBe(true)
      expect(options.showAvailability).toBe(true)
    })

    it("sets fixed from item.fixed when true", () => {
      // Arrange & Act
      const options = initializeOptions({ ...newItem, fixed: true }, false)

      // Assert
      expect(options.fixed).toBe(true)
    })

    it("sets fixed to false when item.fixed is undefined", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false)

      // Assert
      expect(options.fixed).toBe(false)
    })
  })

  describe("force-enabled options (forced=true)", () => {
    it("enables equipable when forced=true regardless of item values", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false, { equipable: { forced: true } })

      // Assert
      expect(options.equipable).toBe(true)
    })

    it("enables licenseRequired when forced=true", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false, { licenseRequired: { forced: true } })

      // Assert
      expect(options.licenseRequired).toBe(true)
    })

    it("enables hasRating when enabled=true", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false, { hasRating: { enabled: true } })

      // Assert
      expect(options.hasRating).toBe(true)
    })

    it("enables multiple when enabled=true", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false, { multiple: { enabled: true } })

      // Assert
      expect(options.multiple).toBe(true)
    })

    it("enables isSubItem when enabled=true", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false, { isSubItem: { enabled: true } })

      // Assert
      expect(options.isSubItem).toBe(true)
    })

    it("enables hasEffects when enabled=true", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false, { hasEffects: { enabled: true } })

      // Assert
      expect(options.hasEffects).toBe(true)
    })
  })

  describe("force-disabled options (forced=true, enabled=false)", () => {
    it("keeps equipable disabled in edit mode when force-disabled", () => {
      // Arrange
      const item: ItemData = { ...baseItem, equipped: false }

      // Act
      const options = initializeOptions(item, true, { equipable: { forced: true, enabled: false } })

      // Assert
      expect(options.equipable).toBe(false)
    })

    it("keeps hasRating disabled in edit mode when force-disabled", () => {
      // Arrange
      const item: ItemData = { ...baseItem, rating: 3 }

      // Act
      const options = initializeOptions(item, true, { hasRating: { forced: true, enabled: false } })

      // Assert
      expect(options.hasRating).toBe(false)
    })

    it("keeps multiple disabled in edit mode when force-disabled", () => {
      // Arrange
      const item: ItemData = { ...baseItem, quantity: 5 }

      // Act
      const options = initializeOptions(item, true, { multiple: { forced: true, enabled: false } })

      // Assert
      expect(options.multiple).toBe(false)
    })

    it("keeps isSubItem disabled in edit mode when force-disabled", () => {
      // Arrange
      const item: ItemData = { ...baseItem, parentId: crypto.randomUUID() }

      // Act
      const options = initializeOptions(item, true, { isSubItem: { forced: true, enabled: false } })

      // Assert
      expect(options.isSubItem).toBe(false)
    })

    it("keeps hasEffects disabled in edit mode when force-disabled", () => {
      // Arrange
      const item: ItemData = { ...baseItem, effects: [] }

      // Act
      const options = initializeOptions(item, true, { hasEffects: { forced: true, enabled: false } })

      // Assert
      expect(options.hasEffects).toBe(false)
    })
  })

  describe("auto-enabling in edit mode from existing field values", () => {
    it("enables equipable when editing an item that has an equipped value", () => {
      // Arrange
      const item: ItemData = { ...baseItem, equipped: false }

      // Act
      const options = initializeOptions(item, true)

      // Assert
      expect(options.equipable).toBe(true)
    })

    it("does NOT enable equipable in edit mode when equipped is undefined", () => {
      // Arrange
      const item: ItemData = { ...baseItem }

      // Act
      const options = initializeOptions(item, true)

      // Assert
      expect(options.equipable).toBe(false)
    })

    it("enables hasRating when editing an item with a non-zero rating", () => {
      // Arrange
      const item: ItemData = { ...baseItem, rating: 3 }

      // Act
      const options = initializeOptions(item, true)

      // Assert
      expect(options.hasRating).toBe(true)
    })

    it("does NOT enable hasRating when editing an item with rating = 0", () => {
      // Arrange
      const item: ItemData = { ...baseItem, rating: 0 }

      // Act
      const options = initializeOptions(item, true)

      // Assert
      expect(options.hasRating).toBe(false)
    })

    it("enables multiple when editing an item with quantity > 1", () => {
      // Arrange
      const item: ItemData = { ...baseItem, quantity: 5 }

      // Act
      const options = initializeOptions(item, true)

      // Assert
      expect(options.multiple).toBe(true)
    })

    it("does NOT enable multiple when editing an item with quantity = 1", () => {
      // Arrange
      const item: ItemData = { ...baseItem, quantity: 1 }

      // Act
      const options = initializeOptions(item, true)

      // Assert
      expect(options.multiple).toBe(false)
    })

    it("enables isSubItem when editing an item that has a parentId", () => {
      // Arrange
      const item: ItemData = { ...baseItem, parentId: crypto.randomUUID() }

      // Act
      const options = initializeOptions(item, true)

      // Assert
      expect(options.isSubItem).toBe(true)
    })

    it("does NOT enable isSubItem in edit mode when parentId is undefined", () => {
      // Arrange
      const item: ItemData = { ...baseItem }

      // Act
      const options = initializeOptions(item, true)

      // Assert
      expect(options.isSubItem).toBe(false)
    })

    it("enables hasEffects when editing an item that has an effects array", () => {
      // Arrange
      const item: ItemData = { ...baseItem, effects: [] }

      // Act
      const options = initializeOptions(item, true)

      // Assert
      expect(options.hasEffects).toBe(true)
    })

    it("does NOT enable hasEffects in edit mode when effects is undefined", () => {
      // Arrange
      const item: ItemData = { ...baseItem }

      // Act
      const options = initializeOptions(item, true)

      // Assert
      expect(options.hasEffects).toBe(false)
    })

    it("does NOT auto-enable options for a new item even when field values are set", () => {
      // Arrange — new item has values pre-filled but should not auto-enable optional options
      const item: ItemData = {
        ...newItem,
        equipped: true,
        rating: 3,
        quantity: 5,
        parentId: crypto.randomUUID(),
        effects: [],
      }

      // Act
      const options = initializeOptions(item, false)

      // Assert
      expect(options.equipable).toBe(false)
      expect(options.hasRating).toBe(false)
      expect(options.multiple).toBe(false)
      expect(options.isSubItem).toBe(false)
      expect(options.hasEffects).toBe(false)
    })
  })

  describe("licenseAlwaysShow", () => {
    it("is always false regardless of defaults or edit mode", () => {
      // Arrange & Act
      const optionsNew = initializeOptions(newItem, false)
      const optionsEdit = initializeOptions(baseItem, true)

      // Assert
      expect(optionsNew.licenseAlwaysShow).toBe(false)
      expect(optionsEdit.licenseAlwaysShow).toBe(false)
    })
  })

  describe("showCost", () => {
    it("is true by default for new items", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false)

      // Assert
      expect(options.showCost).toBe(true)
    })

    it("is true by default for existing items", () => {
      // Arrange & Act
      const options = initializeOptions(baseItem, true)

      // Assert
      expect(options.showCost).toBe(true)
    })

    it("is false when force-disabled", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false, { showCost: { forced: true, enabled: false } })

      // Assert
      expect(options.showCost).toBe(false)
    })

    it("is true when forced without enabled=false", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false, { showCost: { forced: true } })

      // Assert
      expect(options.showCost).toBe(true)
    })
  })

  describe("showAvailability", () => {
    it("is true by default for new items", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false)

      // Assert
      expect(options.showAvailability).toBe(true)
    })

    it("is true by default for existing items", () => {
      // Arrange & Act
      const options = initializeOptions(baseItem, true)

      // Assert
      expect(options.showAvailability).toBe(true)
    })

    it("is false when force-disabled", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false, { showAvailability: { forced: true, enabled: false } })

      // Assert
      expect(options.showAvailability).toBe(false)
    })

    it("is true when forced without enabled=false", () => {
      // Arrange & Act
      const options = initializeOptions(newItem, false, { showAvailability: { forced: true } })

      // Assert
      expect(options.showAvailability).toBe(true)
    })
  })
})
