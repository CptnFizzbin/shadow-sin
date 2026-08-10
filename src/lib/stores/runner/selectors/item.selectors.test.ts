import { describe, expect, it } from "vitest"

import type { ArmorData } from "#/system/gear/armorData.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantType } from "#/system/gear/implantData.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { selectArmorEffective, selectArmorTotal, selectEssence, selectItemsOfType } from "./item.selectors.ts"

describe("selectItemsOfType", () => {
  it("returns only items of the requested type", () => {
    // Arrange
    const [jacket] = createItem<ArmorData>({
      name: "Armor Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4,
    })
    const [cyberware] = createItem<ImplantData>({
      name: "Wired Reflexes", itemType: ItemType.implant, essenceCost: 2,
    })
    const sheet = runnerDataFactory((s) => {
      s.gear = createItemMap([jacket], [cyberware])
      return s
    })

    // Act
    const armor = selectItemsOfType(sheet, ItemType.armor)

    // Assert
    expect(armor).toHaveLength(1)
    expect(armor[0]).toMatchObject({ name: "Armor Jacket" })
  })

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

  it("caches a separate result per item type", () => {
    // Arrange
    const sheet = runnerDataFactory()

    // Act
    const armor = selectItemsOfType(sheet, ItemType.armor)
    const implants = selectItemsOfType(sheet, ItemType.implant)

    // Assert
    expect(implants).not.toBe(armor)
  })
})

describe("selectArmorTotal", () => {
  it("sums ballistic and impact across all equipped armor", () => {
    // Arrange
    const [jacket] = createItem<ArmorData>({
      name: "Armor Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4, equipped: true,
    })
    const [vest] = createItem<ArmorData>({
      name: "Armor Vest", itemType: ItemType.armor, ballistic: 3, impact: 2, equipped: true,
    })
    const [spare] = createItem<ArmorData>({
      name: "Spare Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4, equipped: false,
    })
    const sheet = runnerDataFactory((s) => {
      s.gear = createItemMap([jacket], [vest], [spare])
      return s
    })

    // Act
    const total = selectArmorTotal(sheet)

    // Assert — unequipped armor doesn't count
    expect(total).toEqual({ ballistic: 9, impact: 6 })
  })

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

describe("selectArmorEffective", () => {
  it("takes the best equipped piece per rating, not the sum", () => {
    // Arrange
    const [jacket] = createItem<ArmorData>({
      name: "Armor Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4, equipped: true,
    })
    const [vest] = createItem<ArmorData>({
      name: "Armor Vest", itemType: ItemType.armor, ballistic: 3, impact: 2, equipped: true,
    })
    const sheet = runnerDataFactory((s) => {
      s.gear = createItemMap([jacket], [vest])
      return s
    })

    // Act
    const effective = selectArmorEffective(sheet)

    // Assert
    expect(effective).toEqual({ ballistic: 6, impact: 4 })
  })
})

describe("selectEssence", () => {
  it("counts the smaller of cyberware/bioware essence cost at half against the fixed cap", () => {
    // Arrange
    const [cyberware] = createItem<ImplantData>({
      name: "Wired Reflexes",
      itemType: ItemType.implant,
      implantType: ImplantType.cyberware,
      grade: ImplantGrade.standard,
      essenceCost: 2,
    })
    const [bioware] = createItem<ImplantData>({
      name: "Muscle Toner",
      itemType: ItemType.implant,
      implantType: ImplantType.bioware,
      grade: ImplantGrade.standard,
      essenceCost: 1,
    })
    const sheet = runnerDataFactory((s) => {
      s.gear = createItemMap([cyberware], [bioware])
      return s
    })

    // Act
    const essence = selectEssence(sheet)

    // Assert — used = 2 + (1 / 2) = 2.5, remaining = 6 - 2.5 = 3.5
    expect(essence).toEqual({
      used: 2.5,
      remaining: 3.5,
      cyberwareEssence: 2,
      biowareEssence: 1,
    })
  })

  it("excludes accessory implants (parentId set) from essence cost", () => {
    // Arrange
    const accessory = createItem<ImplantData>({
      name: "Cyberarm Accessory", itemType: ItemType.implant, implantType: ImplantType.cyberware, essenceCost: 1,
    })
    const cyberarm = createItem<ImplantData>(
      { name: "Cyberarm", itemType: ItemType.implant, implantType: ImplantType.cyberware, essenceCost: 3 },
      [accessory],
    )
    const sheet = runnerDataFactory((s) => {
      s.gear = createItemMap(cyberarm)
      return s
    })

    // Act
    const essence = selectEssence(sheet)

    // Assert — only the root implant's 3, not the accessory's 1
    expect(essence.cyberwareEssence).toBe(3)
  })
})
