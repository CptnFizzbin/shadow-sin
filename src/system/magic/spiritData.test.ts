import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import {
  calculateSpiritAttributes,
  calculateSpiritConditionMonitor,
  calculateSpiritInitiative,
  SpiritType,
} from "#/system/magic/spiritData.ts"

// ─── calculateSpiritAttributes ───────────────────────────────────────────────

describe("calculateSpiritAttributes", () => {
  describe("wind spirit (Spirit of Air)", () => {
    it("applies the correct modifiers at force 5", () => {
      const attrs = calculateSpiritAttributes(5, SpiritType.wind)

      expect(attrs[AttributeKey.body]).toBe(3) // F-2
      expect(attrs[AttributeKey.agility]).toBe(8) // F+3
      expect(attrs[AttributeKey.reaction]).toBe(9) // F+4
      expect(attrs[AttributeKey.strength]).toBe(2) // F-3
      expect(attrs[AttributeKey.charisma]).toBe(5) // unmodified
      expect(attrs[AttributeKey.intuition]).toBe(5) // unmodified
      expect(attrs[AttributeKey.willpower]).toBe(5) // unmodified
    })

    it("floors negative attributes at 1 when force is low", () => {
      // At force 1: body = -1, strength = -2 — both must be clamped to 1
      const attrs = calculateSpiritAttributes(1, SpiritType.wind)

      expect(attrs[AttributeKey.body]).toBe(1)
      expect(attrs[AttributeKey.strength]).toBe(1)
    })
  })

  describe("earth spirit", () => {
    it("applies the correct modifiers at force 5, including the intuition penalty", () => {
      const attrs = calculateSpiritAttributes(5, SpiritType.earth)

      expect(attrs[AttributeKey.body]).toBe(9) // F+4
      expect(attrs[AttributeKey.agility]).toBe(3) // F-2
      expect(attrs[AttributeKey.reaction]).toBe(3) // F-2
      expect(attrs[AttributeKey.strength]).toBe(9) // F+4
      expect(attrs[AttributeKey.intuition]).toBe(4) // F-1 (unique to earth)
      expect(attrs[AttributeKey.willpower]).toBe(5) // unmodified
    })
  })

  describe("fire spirit", () => {
    it("applies the correct modifiers at force 5", () => {
      const attrs = calculateSpiritAttributes(5, SpiritType.fire)

      expect(attrs[AttributeKey.body]).toBe(6) // F+1
      expect(attrs[AttributeKey.agility]).toBe(7) // F+2
      expect(attrs[AttributeKey.reaction]).toBe(8) // F+3
      expect(attrs[AttributeKey.strength]).toBe(3) // F-2
      expect(attrs[AttributeKey.intuition]).toBe(5) // unmodified
    })
  })

  describe("Spirit of Man", () => {
    it("only raises agility and intuition — all other attributes stay at base force", () => {
      const attrs = calculateSpiritAttributes(5, SpiritType.man)

      expect(attrs[AttributeKey.agility]).toBe(7) // F+2
      expect(attrs[AttributeKey.intuition]).toBe(6) // F+1
      // Every other attribute is unmodified
      expect(attrs[AttributeKey.body]).toBe(5)
      expect(attrs[AttributeKey.reaction]).toBe(5)
      expect(attrs[AttributeKey.strength]).toBe(5)
      expect(attrs[AttributeKey.charisma]).toBe(5)
      expect(attrs[AttributeKey.logic]).toBe(5)
      expect(attrs[AttributeKey.willpower]).toBe(5)
    })
  })

  describe("edge and magic", () => {
    it("sets edge equal to force, not floor(force/2)", () => {
      const attrs = calculateSpiritAttributes(6, SpiritType.beast)

      expect(attrs[AttributeKey.edge]).toBe(6)
    })

    it("sets magic equal to force", () => {
      const attrs = calculateSpiritAttributes(6, SpiritType.beast)

      expect(attrs[AttributeKey.magic]).toBe(6)
    })
  })

  describe("resonance", () => {
    it("is always 0 regardless of force", () => {
      const attrs = calculateSpiritAttributes(10, SpiritType.guardian)

      expect(attrs[AttributeKey.resonance]).toBe(0)
    })
  })
})

// ─── calculateSpiritInitiative ───────────────────────────────────────────────

describe("calculateSpiritInitiative", () => {
  it("gives wind spirits (F×2)+3 physical score (SR4A fixed per-type pool)", () => {
    const { physicalScore, physicalIp } = calculateSpiritInitiative(6, SpiritType.wind)

    expect(physicalScore).toBe(15) // 6×2+3
    expect(physicalIp).toBe(2)
  })

  it("gives fire spirits (F×2)+3 physical score", () => {
    const { physicalScore } = calculateSpiritInitiative(6, SpiritType.fire)

    expect(physicalScore).toBe(15) // 6×2+3
  })

  it("gives all other spirit types (F×2)+2 physical score", () => {
    const types = [
      SpiritType.beast,
      SpiritType.earth,
      SpiritType.guidance,
      SpiritType.guardian,
      SpiritType.man,
      SpiritType.plant,
      SpiritType.task,
      SpiritType.water,
    ]

    for (const type of types) {
      const { physicalScore } = calculateSpiritInitiative(6, type)
      expect(physicalScore, `${type} physicalScore`).toBe(14) // 6×2+2
    }
  })

  it("all spirits have 2 physical IP and 3 astral IP", () => {
    const { physicalIp, astralIp } = calculateSpiritInitiative(5, SpiritType.guardian)

    expect(physicalIp).toBe(2)
    expect(astralIp).toBe(3)
  })

  it("astral base is Intuition×2 — uses modified intuition for earth spirits", () => {
    // Earth at force 6: intuition = F-1 = 5, so astralBase = 10
    const { astralBase } = calculateSpiritInitiative(6, SpiritType.earth)

    expect(astralBase).toBe(10)
  })

  it("astral base reflects boosted intuition for Spirit of Man", () => {
    // Man at force 6: intuition = F+1 = 7, so astralBase = 14
    const { astralBase } = calculateSpiritInitiative(6, SpiritType.man)

    expect(astralBase).toBe(14)
  })
})

// ─── calculateSpiritConditionMonitor ─────────────────────────────────────────

describe("calculateSpiritConditionMonitor", () => {
  it("computes physical CM as 8 + ceil(Body/2) and stun CM as 8 + ceil(Willpower/2)", () => {
    // Beast at force 5: body = F+2 = 7, willpower = 5
    // physical = 8 + ceil(7/2) = 8 + 4 = 12, stun = 8 + ceil(5/2) = 8 + 3 = 11
    const { physical, stun } = calculateSpiritConditionMonitor(5, SpiritType.beast)

    expect(physical).toBe(12)
    expect(stun).toBe(11)
  })

  it("uses even body correctly — no rounding needed", () => {
    // Earth at force 6: body = F+4 = 10, willpower = 6
    // physical = 8 + ceil(10/2) = 8 + 5 = 13, stun = 8 + ceil(6/2) = 8 + 3 = 11
    const { physical, stun } = calculateSpiritConditionMonitor(6, SpiritType.earth)

    expect(physical).toBe(13)
    expect(stun).toBe(11)
  })

  it("uses odd body — ceil rounds up", () => {
    // Wind at force 5: body = F-2 = 3, willpower = 5
    // physical = 8 + ceil(3/2) = 8 + 2 = 10, stun = 8 + ceil(5/2) = 8 + 3 = 11
    const { physical, stun } = calculateSpiritConditionMonitor(5, SpiritType.wind)

    expect(physical).toBe(10)
    expect(stun).toBe(11)
  })
})
