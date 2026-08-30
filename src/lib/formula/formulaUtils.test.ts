import { describe, expect, it } from "vitest"

import { createFormula, FormulaInput } from "./formulaUtils.ts"

describe("createFormula", () => {
  it("wraps a plain combiner when no providers are given", () => {
    // Arrange
    const getSum = createFormula(({ base, mods }: { base: number, mods: number }) => base + mods)

    // Act
    const result = getSum({ base: 3, mods: 2 })

    // Assert
    expect(result).toBe(5)
  })

  it("resolves a FormulaInput provider straight from the outer inputs", () => {
    // Arrange
    const getDoubled = createFormula(
      { base: FormulaInput },
      ({ base }: { base: number }) => base * 2,
    )

    // Act
    const result = getDoubled({ base: 4 })

    // Assert
    expect(result).toBe(8)
  })

  it("resolves a nested Formula provider by calling it with the same outer inputs", () => {
    // Arrange
    const getSum = createFormula(({ base, mods }: { base: number, mods: number }) => base + mods)
    const getDoubledSum = createFormula<
      { base: number, mods: number },
      { sum: typeof getSum },
      number
    >(
      { sum: getSum },
      ({ sum }: { sum: number }) => sum * 2,
    )

    // Act
    const result = getDoubledSum({ base: 3, mods: 2 })

    // Assert
    expect(result).toBe(10)
  })

  it("mixes FormulaInput and nested-Formula providers in one combiner", () => {
    // Arrange
    const getSum = createFormula(({ base, mods }: { base: number, mods: number }) => base + mods)
    const getLabeled = createFormula<
      { base: number, mods: number, label: string },
      { sum: typeof getSum, label: typeof FormulaInput },
      string
    >(
      { sum: getSum, label: FormulaInput },
      ({ sum, label }: { sum: number, label: string }) => `${label}: ${sum}`,
    )

    // Act
    const result = getLabeled({ base: 3, mods: 2, label: "total" })

    // Assert
    expect(result).toBe("total: 5")
  })

  it("recomputes fresh on every call instead of memoizing", () => {
    // Arrange
    const getDoubled = createFormula(
      { base: FormulaInput },
      ({ base }: { base: number }) => base * 2,
    )

    // Act
    const first = getDoubled({ base: 1 })
    const second = getDoubled({ base: 2 })

    // Assert
    expect(first).toBe(2)
    expect(second).toBe(4)
  })
})
