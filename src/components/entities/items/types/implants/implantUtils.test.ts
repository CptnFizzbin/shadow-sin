import { describe, expect, it } from "vitest"

import type { ImplantData } from "#/system/model/items/implantData.ts"
import { ImplantGrade, ImplantType } from "#/system/model/items/implantData.ts"
import { createItem } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"

import { getEssenceUsage } from "./implantUtils.ts"

const makeImplant = (overrides: Partial<ImplantData>, attached: ImplantData[] = []): ImplantData[] =>
  createItem<ImplantData>({
    name: "Wired Reflexes",
    itemType: ItemType.implant,
    implantType: ImplantType.cyberware,
    essenceCost: 2,
    ...overrides,
  }, attached) as ImplantData[]

describe.concurrent("getEssenceUsage", () => {
  it("returns no Essence loss without implants", () => {
    // Act
    const usage = getEssenceUsage([])

    // Assert
    expect(usage).toEqual({ cyberware: 0, bioware: 0, total: 0 })
  })

  it("counts every cyberware implant whatever its equipped state", () => {
    // Arrange
    const implants = [
      ...makeImplant({ equipped: true, essenceCost: 2 }),
      ...makeImplant({ equipped: false, essenceCost: 0.5 }),
      ...makeImplant({ essenceCost: 0.2 }),
    ]

    // Act
    const usage = getEssenceUsage(implants)

    // Assert
    expect(usage.cyberware).toBeCloseTo(2.7)
    expect(usage.total).toBeCloseTo(2.7)
  })

  it("counts implant accessories", () => {
    // Arrange
    const [accessory] = makeImplant({ name: "Smartlink", essenceCost: 0.1 })
    const implants = makeImplant({ name: "Cybereyes", essenceCost: 0.4 }, [accessory])

    // Act
    const usage = getEssenceUsage(implants)

    // Assert
    expect(usage.cyberware).toBeCloseTo(0.5)
  })

  it("applies the grade multiplier", () => {
    // Arrange
    const implants = makeImplant({ grade: ImplantGrade.alpha, essenceCost: 2 })

    // Act
    const usage = getEssenceUsage(implants)

    // Assert
    expect(usage.cyberware).toBeCloseTo(1.6)
  })

  it("adds half of the smaller implant type to the larger one", () => {
    // Arrange
    const implants = [
      ...makeImplant({ essenceCost: 1 }),
      ...makeImplant({ name: "Muscle Toner", implantType: ImplantType.bioware, essenceCost: 2 }),
    ]

    // Act
    const usage = getEssenceUsage(implants)

    // Assert
    expect(usage).toEqual({ cyberware: 1, bioware: 2, total: 2.5 })
  })
})
