import { describe, expect, it } from "vitest"

import {
  GearBuildPointAllowance,
  GearMaxAvailability,
  GearNuyenAllowance,
  GearNuyenPerBuildPoint,
  getTotalCost,
} from "#/components/CharacterBuilder/Sections/Gear/GearUtils.ts"

describe("GearUtils constants", () => {
  it("GearBuildPointAllowance is 50", () => {
    expect(GearBuildPointAllowance).toBe(50)
  })

  it("GearNuyenPerBuildPoint is 5000", () => {
    expect(GearNuyenPerBuildPoint).toBe(5_000)
  })

  it("GearNuyenAllowance equals GearBuildPointAllowance × GearNuyenPerBuildPoint", () => {
    expect(GearNuyenAllowance).toBe(GearBuildPointAllowance * GearNuyenPerBuildPoint)
  })

  it("GearMaxAvailability is 12", () => {
    expect(GearMaxAvailability).toBe(12)
  })
})

describe("getTotalCost", () => {
  it("returns 0 when called with no items", () => {
    expect(getTotalCost()).toBe(0)
  })

  it("returns 0 for an item with no cost", () => {
    expect(getTotalCost({ cost: undefined })).toBe(0)
  })

  it("returns the item cost for a single item with quantity 1", () => {
    expect(getTotalCost({ cost: 500, quantity: 1 })).toBe(500)
  })

  it("defaults to quantity 1 when quantity is undefined", () => {
    expect(getTotalCost({ cost: 1_000 })).toBe(1_000)
  })

  it("multiplies cost by quantity when quantity > 1", () => {
    expect(getTotalCost({ cost: 200, quantity: 3 })).toBe(600)
  })

  it("returns 0 for an item with quantity 0", () => {
    expect(getTotalCost({ cost: 500, quantity: 0 })).toBe(0)
  })

  it("sums costs across multiple items", () => {
    expect(getTotalCost({ cost: 100 }, { cost: 200 }, { cost: 300 })).toBe(600)
  })

  it("correctly sums multiple items with varying quantities", () => {
    // 100 × 2 + 50 × 1 = 250
    expect(getTotalCost({ cost: 100, quantity: 2 }, { cost: 50, quantity: 1 })).toBe(250)
  })
})
