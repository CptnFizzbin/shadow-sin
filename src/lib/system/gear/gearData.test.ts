import { describe, expect, it } from "vitest"

import type { GearData } from "#/lib/system/gear/gearData.ts"
import { GearType, createGear } from "#/lib/system/gear/gearData.ts"

describe("createGear", () => {
  it("assigns a non-empty string id to the created gear item", () => {
    const gear = createGear<GearData>({ name: "Mirrorshades", itemType: GearType.other })

    expect(gear.id).toBeTruthy()
    expect(typeof gear.id).toBe("string")
  })

  it("assigns a UUID-formatted id", () => {
    const gear = createGear<GearData>({ name: "Mirrorshades", itemType: GearType.other })

    expect(gear.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
  })

  it("assigns a unique id on each call", () => {
    const gearA = createGear<GearData>({ name: "Item A", itemType: GearType.other })
    const gearB = createGear<GearData>({ name: "Item B", itemType: GearType.other })

    expect(gearA.id).not.toBe(gearB.id)
  })

  it("preserves all provided fields in the result", () => {
    const gear = createGear<GearData>({
      name: "Ares Predator VI",
      itemType: GearType.firearm,
      notes: "Reliable sidearm",
      cost: 725,
      equipped: true,
    })

    expect(gear.name).toBe("Ares Predator VI")
    expect(gear.itemType).toBe(GearType.firearm)
    expect(gear.notes).toBe("Reliable sidearm")
    expect(gear.cost).toBe(725)
    expect(gear.equipped).toBe(true)
  })

  it("does not require optional fields to be provided", () => {
    const gear = createGear<GearData>({ name: "Generic Item", itemType: GearType.other })

    expect(gear.notes).toBeUndefined()
    expect(gear.cost).toBeUndefined()
    expect(gear.equipped).toBeUndefined()
  })
})

describe("GearType", () => {
  it("includes the expected gear categories", () => {
    expect(GearType.armor).toBe("armor")
    expect(GearType.implant).toBe("implant")
    expect(GearType.firearm).toBe("firearm")
    expect(GearType.weapon).toBe("weapon")
    expect(GearType.vehicle).toBe("vehicle")
    expect(GearType.device).toBe("device")
    expect(GearType.software).toBe("software")
    expect(GearType.sin).toBe("sin")
    expect(GearType.license).toBe("license")
    expect(GearType.firearmAccessory).toBe("firearmAccessory")
    expect(GearType.lifestyle).toBe("lifestyle")
    expect(GearType.other).toBe("other")
  })
})
