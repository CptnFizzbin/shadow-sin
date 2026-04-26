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
      const force = 5
      const attrs = calculateSpiritAttributes(force, SpiritType.wind)

      expect(attrs[AttributeKey.body]).toBe(force - 2)
      expect(attrs[AttributeKey.agility]).toBe(force + 3)
      expect(attrs[AttributeKey.reaction]).toBe(force + 4)
      expect(attrs[AttributeKey.strength]).toBe(force - 3)
      expect(attrs[AttributeKey.charisma]).toBe(force)
      expect(attrs[AttributeKey.intuition]).toBe(force)
      expect(attrs[AttributeKey.willpower]).toBe(force)
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
      const force = 5
      const attrs = calculateSpiritAttributes(force, SpiritType.earth)

      expect(attrs[AttributeKey.body]).toBe(force + 4)
      expect(attrs[AttributeKey.agility]).toBe(force - 2)
      expect(attrs[AttributeKey.reaction]).toBe(force - 2)
      expect(attrs[AttributeKey.strength]).toBe(force + 4)
      expect(attrs[AttributeKey.intuition]).toBe(force - 1)
      expect(attrs[AttributeKey.willpower]).toBe(force)
    })
  })

  describe("fire spirit", () => {
    it("applies the correct modifiers at force 5", () => {
      const force = 5
      const attrs = calculateSpiritAttributes(force, SpiritType.fire)

      expect(attrs[AttributeKey.body]).toBe(force + 1)
      expect(attrs[AttributeKey.agility]).toBe(force + 2)
      expect(attrs[AttributeKey.reaction]).toBe(force + 3)
      expect(attrs[AttributeKey.strength]).toBe(force - 2)
      expect(attrs[AttributeKey.intuition]).toBe(force)
    })
  })

  describe("Spirit of Man", () => {
    it("only raises agility and intuition — all other attributes stay at base force", () => {
      const force = 5
      const attrs = calculateSpiritAttributes(force, SpiritType.man)

      expect(attrs[AttributeKey.agility]).toBe(force + 2)
      expect(attrs[AttributeKey.intuition]).toBe(force + 1)
      // Every other attribute is unmodified
      expect(attrs[AttributeKey.body]).toBe(force)
      expect(attrs[AttributeKey.reaction]).toBe(force)
      expect(attrs[AttributeKey.strength]).toBe(force)
      expect(attrs[AttributeKey.charisma]).toBe(force)
      expect(attrs[AttributeKey.logic]).toBe(force)
      expect(attrs[AttributeKey.willpower]).toBe(force)
    })
  })

  describe("edge and magic", () => {
    it("sets edge equal to force", () => {
      const force = 6
      const attrs = calculateSpiritAttributes(force, SpiritType.beast)

      expect(attrs[AttributeKey.edge]).toBe(force)
    })

    it("sets magic equal to force", () => {
      const force = 6
      const attrs = calculateSpiritAttributes(force, SpiritType.beast)

      expect(attrs[AttributeKey.magic]).toBe(force)
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
    const force = 6
    const { physicalScore, physicalIp } = calculateSpiritInitiative(force, SpiritType.wind)

    expect(physicalScore).toBe(force * 2 + 3)
    expect(physicalIp).toBe(2)
  })

  it("gives fire spirits (F×2)+3 physical score", () => {
    const force = 6
    const { physicalScore } = calculateSpiritInitiative(force, SpiritType.fire)

    expect(physicalScore).toBe(force * 2 + 3)
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
      const force = 6
      const { physicalScore } = calculateSpiritInitiative(force, type)
      expect(physicalScore, `${type} physicalScore`).toBe(force * 2 + 2)
    }
  })

  it("all spirits have 2 physical IP and 3 astral IP", () => {
    const { physicalIp, astralIp } = calculateSpiritInitiative(5, SpiritType.guardian)

    expect(physicalIp).toBe(2)
    expect(astralIp).toBe(3)
  })

  it("astral base is F×2 for all spirit types, ignoring type-specific intuition modifiers", () => {
    const force = 6
    const { astralBase: earthAstral } = calculateSpiritInitiative(force, SpiritType.earth)
    const { astralBase: manAstral } = calculateSpiritInitiative(force, SpiritType.man)

    expect(earthAstral).toBe(force * 2)
    expect(manAstral).toBe(force * 2)
  })
})

// ─── calculateSpiritConditionMonitor ─────────────────────────────────────────

describe("calculateSpiritConditionMonitor", () => {
  it("computes physical CM as 8 + ceil(Body/2) and stun CM as 8 + ceil(Willpower/2)", () => {
    const force = 5
    // Beast at force 5: body = F+2 = 7, willpower = F = 5
    // physical = 8 + ceil(7/2) = 8 + 4 = 12, stun = 8 + ceil(5/2) = 8 + 3 = 11
    const { physical, stun } = calculateSpiritConditionMonitor(force, SpiritType.beast)

    expect(physical).toBe(12)
    expect(stun).toBe(11)
  })

  it("uses even body correctly — no rounding needed", () => {
    const force = 6
    // Earth at force 6: body = F+4 = 10, willpower = F = 6
    // physical = 8 + ceil(10/2) = 8 + 5 = 13, stun = 8 + ceil(6/2) = 8 + 3 = 11
    const { physical, stun } = calculateSpiritConditionMonitor(force, SpiritType.earth)

    expect(physical).toBe(13)
    expect(stun).toBe(11)
  })

  it("uses odd body — ceil rounds up", () => {
    const force = 5
    // Wind at force 5: body = F-2 = 3, willpower = F = 5
    // physical = 8 + ceil(3/2) = 8 + 2 = 10, stun = 8 + ceil(5/2) = 8 + 3 = 11
    const { physical, stun } = calculateSpiritConditionMonitor(force, SpiritType.wind)

    expect(physical).toBe(10)
    expect(stun).toBe(11)
  })
})
