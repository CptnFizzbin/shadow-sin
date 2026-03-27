import { describe, expect, it } from "vitest"

import type { ImplantFormState } from "#/components/CharacterBuilder/Gear/Cyberware/Forms/ImplantFormState.ts"
import {
  BASE_ESSENCE,
  ImplantGradeEssenceMultiplier,
  ImplantGradeNuyenMultiplier,
  calculateImplantEssence,
  getImplantEffectiveEssenceCost,
  getImplantEffectiveNuyenCost,
  wouldExceedEssence,
} from "#/components/CharacterBuilder/Gear/Cyberware/ImplantUtils.ts"
import { ImplantGrade, ImplantType } from "#/lib/system/gear/implantData.ts"

function makeImplant(
  overrides: Partial<ImplantFormState> & {
    grade: ImplantGrade | string
    implantType: ImplantType | string
  },
): ImplantFormState {
  return {
    id: "test-implant",
    name: "Test Implant",
    cost: 1_000,
    essenceCost: 0.5,
    location: "generic",
    ...overrides,
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

describe("ImplantUtils constants", () => {
  it("BASE_ESSENCE is 6", () => {
    expect(BASE_ESSENCE).toBe(6)
  })

  it("standard grade essence multiplier is 1.0", () => {
    expect(ImplantGradeEssenceMultiplier[ImplantGrade.standard]).toBe(1.0)
  })

  it("alpha grade essence multiplier is 0.8", () => {
    expect(ImplantGradeEssenceMultiplier[ImplantGrade.alpha]).toBe(0.8)
  })

  it("beta grade essence multiplier is 0.7", () => {
    expect(ImplantGradeEssenceMultiplier[ImplantGrade.beta]).toBe(0.7)
  })

  it("delta grade essence multiplier is 0.5", () => {
    expect(ImplantGradeEssenceMultiplier[ImplantGrade.delta]).toBe(0.5)
  })

  it("standard grade nuyen multiplier is 1", () => {
    expect(ImplantGradeNuyenMultiplier[ImplantGrade.standard]).toBe(1)
  })

  it("alpha grade nuyen multiplier is 2", () => {
    expect(ImplantGradeNuyenMultiplier[ImplantGrade.alpha]).toBe(2)
  })

  it("beta grade nuyen multiplier is 4", () => {
    expect(ImplantGradeNuyenMultiplier[ImplantGrade.beta]).toBe(4)
  })

  it("delta grade nuyen multiplier is 10", () => {
    expect(ImplantGradeNuyenMultiplier[ImplantGrade.delta]).toBe(10)
  })
})

// ─── getImplantEffectiveEssenceCost ───────────────────────────────────────────

describe("getImplantEffectiveEssenceCost", () => {
  it("applies no multiplier for standard grade (×1.0)", () => {
    const implant = makeImplant({
      grade: ImplantGrade.standard,
      implantType: ImplantType.cyberware,
      essenceCost: 0.5,
    })
    expect(getImplantEffectiveEssenceCost(implant)).toBe(0.5)
  })

  it("applies 0.8 multiplier for alpha grade", () => {
    const implant = makeImplant({
      grade: ImplantGrade.alpha,
      implantType: ImplantType.cyberware,
      essenceCost: 1.0,
    })
    expect(getImplantEffectiveEssenceCost(implant)).toBeCloseTo(0.8)
  })

  it("applies 0.7 multiplier for beta grade", () => {
    const implant = makeImplant({
      grade: ImplantGrade.beta,
      implantType: ImplantType.cyberware,
      essenceCost: 1.0,
    })
    expect(getImplantEffectiveEssenceCost(implant)).toBeCloseTo(0.7)
  })

  it("applies 0.5 multiplier for delta grade", () => {
    const implant = makeImplant({
      grade: ImplantGrade.delta,
      implantType: ImplantType.cyberware,
      essenceCost: 2.0,
    })
    expect(getImplantEffectiveEssenceCost(implant)).toBeCloseTo(1.0)
  })

  it("falls back to standard multiplier for an unknown grade", () => {
    const implant = makeImplant({
      grade: "unknown-grade",
      implantType: ImplantType.cyberware,
      essenceCost: 1.0,
    })
    expect(getImplantEffectiveEssenceCost(implant)).toBe(1.0)
  })
})

// ─── getImplantEffectiveNuyenCost ─────────────────────────────────────────────

describe("getImplantEffectiveNuyenCost", () => {
  it("returns base cost for standard grade (×1)", () => {
    const implant = makeImplant({
      grade: ImplantGrade.standard,
      implantType: ImplantType.cyberware,
      cost: 10_000,
    })
    expect(getImplantEffectiveNuyenCost(implant)).toBe(10_000)
  })

  it("doubles cost for alpha grade (×2)", () => {
    const implant = makeImplant({
      grade: ImplantGrade.alpha,
      implantType: ImplantType.cyberware,
      cost: 10_000,
    })
    expect(getImplantEffectiveNuyenCost(implant)).toBe(20_000)
  })

  it("quadruples cost for beta grade (×4)", () => {
    const implant = makeImplant({
      grade: ImplantGrade.beta,
      implantType: ImplantType.cyberware,
      cost: 10_000,
    })
    expect(getImplantEffectiveNuyenCost(implant)).toBe(40_000)
  })

  it("applies ×10 multiplier for delta grade", () => {
    const implant = makeImplant({
      grade: ImplantGrade.delta,
      implantType: ImplantType.cyberware,
      cost: 10_000,
    })
    expect(getImplantEffectiveNuyenCost(implant)).toBe(100_000)
  })

  it("falls back to standard multiplier for an unknown grade", () => {
    const implant = makeImplant({
      grade: "unknown-grade",
      implantType: ImplantType.cyberware,
      cost: 5_000,
    })
    expect(getImplantEffectiveNuyenCost(implant)).toBe(5_000)
  })
})

// ─── calculateImplantEssence ──────────────────────────────────────────────────

describe("calculateImplantEssence", () => {
  it("returns full BASE_ESSENCE remaining when there are no implants", () => {
    const result = calculateImplantEssence([])
    expect(result.cyberwareTotal).toBe(0)
    expect(result.biowareTotal).toBe(0)
    expect(result.higherType).toBeNull()
    expect(result.effectiveEssenceUsed).toBe(0)
    expect(result.remainingEssence).toBe(BASE_ESSENCE)
  })

  it("counts cyberware at full cost with no bioware", () => {
    const implants = [
      makeImplant({
        grade: ImplantGrade.standard,
        implantType: ImplantType.cyberware,
        essenceCost: 1.0,
      }),
      makeImplant({
        grade: ImplantGrade.standard,
        implantType: ImplantType.cyberware,
        essenceCost: 0.5,
      }),
    ]
    const result = calculateImplantEssence(implants)
    expect(result.cyberwareTotal).toBeCloseTo(1.5)
    expect(result.biowareTotal).toBe(0)
    expect(result.higherType).toBe(ImplantType.cyberware)
    expect(result.effectiveEssenceUsed).toBeCloseTo(1.5)
    expect(result.remainingEssence).toBeCloseTo(BASE_ESSENCE - 1.5)
  })

  it("counts bioware at full cost with no cyberware", () => {
    const implants = [
      makeImplant({
        grade: ImplantGrade.standard,
        implantType: ImplantType.bioware,
        essenceCost: 2.0,
      }),
    ]
    const result = calculateImplantEssence(implants)
    expect(result.biowareTotal).toBeCloseTo(2.0)
    expect(result.cyberwareTotal).toBe(0)
    expect(result.higherType).toBe(ImplantType.bioware)
    expect(result.effectiveEssenceUsed).toBeCloseTo(2.0)
    expect(result.remainingEssence).toBeCloseTo(BASE_ESSENCE - 2.0)
  })

  it("uses cyberware as higher type and halves bioware cost when cyberware total is greater", () => {
    // cyberware: 3.0, bioware: 1.0 → effective = 3.0 + 1.0 × 0.5 = 3.5
    const implants = [
      makeImplant({
        grade: ImplantGrade.standard,
        implantType: ImplantType.cyberware,
        essenceCost: 3.0,
      }),
      makeImplant({
        grade: ImplantGrade.standard,
        implantType: ImplantType.bioware,
        essenceCost: 1.0,
      }),
    ]
    const result = calculateImplantEssence(implants)
    expect(result.higherType).toBe(ImplantType.cyberware)
    expect(result.effectiveEssenceUsed).toBeCloseTo(3.5)
    expect(result.remainingEssence).toBeCloseTo(BASE_ESSENCE - 3.5)
  })

  it("uses bioware as higher type and halves cyberware cost when bioware total is greater", () => {
    // cyberware: 1.0, bioware: 3.0 → effective = 3.0 + 1.0 × 0.5 = 3.5
    const implants = [
      makeImplant({
        grade: ImplantGrade.standard,
        implantType: ImplantType.cyberware,
        essenceCost: 1.0,
      }),
      makeImplant({
        grade: ImplantGrade.standard,
        implantType: ImplantType.bioware,
        essenceCost: 3.0,
      }),
    ]
    const result = calculateImplantEssence(implants)
    expect(result.higherType).toBe(ImplantType.bioware)
    expect(result.effectiveEssenceUsed).toBeCloseTo(3.5)
    expect(result.remainingEssence).toBeCloseTo(BASE_ESSENCE - 3.5)
  })

  it("uses cyberware as higher type when both totals are equal", () => {
    const implants = [
      makeImplant({
        grade: ImplantGrade.standard,
        implantType: ImplantType.cyberware,
        essenceCost: 1.0,
      }),
      makeImplant({
        grade: ImplantGrade.standard,
        implantType: ImplantType.bioware,
        essenceCost: 1.0,
      }),
    ]
    const result = calculateImplantEssence(implants)
    expect(result.higherType).toBe(ImplantType.cyberware)
    // cyberware 1.0 (full) + bioware 1.0 × 0.5 = 1.5
    expect(result.effectiveEssenceUsed).toBeCloseTo(1.5)
  })

  it("respects grade multipliers when computing totals", () => {
    // alpha cyberware 1.0 ess × 0.8 = 0.8
    const implants = [
      makeImplant({
        grade: ImplantGrade.alpha,
        implantType: ImplantType.cyberware,
        essenceCost: 1.0,
      }),
    ]
    const result = calculateImplantEssence(implants)
    expect(result.cyberwareTotal).toBeCloseTo(0.8)
  })
})

// ─── wouldExceedEssence ───────────────────────────────────────────────────────

describe("wouldExceedEssence", () => {
  it("returns false when adding a small implant still leaves remaining essence", () => {
    const existing = [
      makeImplant({
        grade: ImplantGrade.standard,
        implantType: ImplantType.cyberware,
        essenceCost: 1.0,
      }),
    ]
    const newImplant = makeImplant({
      grade: ImplantGrade.standard,
      implantType: ImplantType.cyberware,
      essenceCost: 1.0,
    })
    expect(wouldExceedEssence(existing, newImplant)).toBe(false)
  })

  it("returns true when adding the implant would deplete all remaining essence", () => {
    // 6 essence already used — adding anything pushes remaining ≤ 0
    const existing = [
      makeImplant({
        grade: ImplantGrade.standard,
        implantType: ImplantType.cyberware,
        essenceCost: 6.0,
      }),
    ]
    const newImplant = makeImplant({
      grade: ImplantGrade.standard,
      implantType: ImplantType.cyberware,
      essenceCost: 0.5,
    })
    expect(wouldExceedEssence(existing, newImplant)).toBe(true)
  })

  it("returns true when adding the implant would push remaining essence below 0", () => {
    const existing = [
      makeImplant({
        grade: ImplantGrade.standard,
        implantType: ImplantType.cyberware,
        essenceCost: 5.5,
      }),
    ]
    const newImplant = makeImplant({
      grade: ImplantGrade.standard,
      implantType: ImplantType.cyberware,
      essenceCost: 1.0,
    })
    expect(wouldExceedEssence(existing, newImplant)).toBe(true)
  })

  it("returns false with an empty existing list and a small implant", () => {
    const newImplant = makeImplant({
      grade: ImplantGrade.standard,
      implantType: ImplantType.cyberware,
      essenceCost: 0.5,
    })
    expect(wouldExceedEssence([], newImplant)).toBe(false)
  })
})
