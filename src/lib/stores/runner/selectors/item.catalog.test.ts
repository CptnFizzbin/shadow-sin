import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useRunnerSelector } from "#/lib/stores/runner/runnerSelector.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantType } from "#/system/gear/implantData.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

describe("useRunnerSelector — item namespace", () => {
  it("looks up a single item by id", () => {
    // Arrange
    const [jacket] = createItem<ArmorData>({
      name: "Armor Jacket",
      itemType: ItemType.armor,
      ballistic: 6,
      impact: 4,
      equipped: true,
    })
    const sheet = runnerDataFactory((s) => {
      s.gear = createItemMap([jacket])
      return s
    })

    // Act
    const { result } = renderHook(
      () => useRunnerSelector(({ item }) => item(jacket.id)),
      { wrapper: makeRunnerDataWrapper(sheet) },
    )

    // Assert
    expect(result.current).toMatchObject({ name: "Armor Jacket" })
  })

  it("filters by item type", () => {
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
    const { result } = renderHook(
      () => useRunnerSelector(({ item }) => item.byType(ItemType.armor)),
      { wrapper: makeRunnerDataWrapper(sheet) },
    )

    // Assert
    expect(result.current).toHaveLength(1)
    expect(result.current[0]).toMatchObject({ name: "Armor Jacket" })
  })

  it("reads only equipped items across types", () => {
    // Arrange
    const [equipped] = createItem<ArmorData>({
      name: "Worn Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4, equipped: true,
    })
    const [stashed] = createItem<ArmorData>({
      name: "Spare Jacket", itemType: ItemType.armor, ballistic: 6, impact: 4, equipped: false,
    })
    const sheet = runnerDataFactory((s) => {
      s.gear = createItemMap([equipped], [stashed])
      return s
    })

    // Act
    const { result } = renderHook(
      () => useRunnerSelector(({ item }) => item.equipped),
      { wrapper: makeRunnerDataWrapper(sheet) },
    )

    // Assert
    expect(result.current.map((i) => i.name)).toEqual(["Worn Jacket"])
  })

  it("sums equipped armor for total and takes the best equipped piece for effective", () => {
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
    const wrapper = makeRunnerDataWrapper(sheet)

    // Act
    const total = renderHook(() => useRunnerSelector(({ item }) => item.armor.total), { wrapper })
    const effective = renderHook(() => useRunnerSelector(({ item }) => item.armor.effective), { wrapper })

    // Assert — two equipped pieces stack for total, but only the highest applies as effective
    // (unequipped armor counts toward neither)
    expect(total.result.current).toEqual({ ballistic: 9, impact: 6 })
    expect(effective.result.current).toEqual({ ballistic: 6, impact: 4 })
  })

  it("computes essence usage against the fixed essence cap", () => {
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
    const { result } = renderHook(
      () => useRunnerSelector(({ item }) => item.essence),
      { wrapper: makeRunnerDataWrapper(sheet) },
    )

    // Assert — 2 cyberware + 1 bioware essence, smaller (bioware) counts at half:
    // used = 2 + (1 / 2) = 2.5, remaining = 6 - 2.5 = 3.5
    expect(result.current).toEqual({
      used: 2.5,
      remaining: 3.5,
      cyberwareEssence: 2,
      biowareEssence: 1,
    })
  })
})
