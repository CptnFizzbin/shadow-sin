import { describe, expect, it } from "vitest"

import type { CredstickData } from "#/system/gear/credstickData.ts"
import { CredstickType } from "#/system/gear/credstickData.ts"
import { createItem, createItemMap } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"

import { selectNetWorth } from "./useNetWorth.tsx"

describe("selectNetWorth", () => {
  it("is just the current nuyen when there's no gear or loans", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
      s.nuyen = { current: 5_000, loans: [] }
    } })

    // Act
    const netWorth = selectNetWorth({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(netWorth).toBe(5_000)
  })

  it("adds every credstick's balance", () => {
    // Arrange
    const [credstick] = createItem<CredstickData>({
      itemType: ItemType.credstick,
      name: "Silver Credstick",
      credstickType: CredstickType.silver,
      balance: 2_000,
    })

    const sheet = runnerDataFactory({
      items: createItemMap(credstick),
      afterBuild: (s) => {
        s.nuyen = { current: 1_000, loans: [] }
      },
    })

    // Act
    const netWorth = selectNetWorth({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(netWorth).toBe(3_000)
  })

  it("adds every other item's cost times quantity", () => {
    // Arrange
    const [item] = createItem({
      itemType: ItemType.other,
      name: "Fake SIN",
      cost: 500,
      quantity: 2,
    })

    const sheet = runnerDataFactory({
      items: createItemMap(item),
      afterBuild: (s) => {
        s.nuyen = { current: 1_000, loans: [] }
      },
    })

    // Act
    const netWorth = selectNetWorth({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(netWorth).toBe(2_000)
  })

  it("subtracts every loan's amount", () => {
    // Arrange
    const sheet = runnerDataFactory({ afterBuild: (s) => {
      s.nuyen = {
        current: 5_000,
        loans: [{ id: crypto.randomUUID(), lender: "Ares Macrotechnology", amount: 1_500, interestRate: 5 }],
      }
    } })

    // Act
    const netWorth = selectNetWorth({ runner: sheet, items: getItemCatalog(sheet) })

    // Assert
    expect(netWorth).toBe(3_500)
  })
})
