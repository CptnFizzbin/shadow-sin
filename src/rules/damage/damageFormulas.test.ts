import { describe, expect, it } from "vitest"

import { DamageFormulas } from "./damageFormulas.ts"

describe("DamageFormulas.matrixMax", () => {
  it("computes 8 + Ceil(System / 2)", () => {
    // Arrange / Act
    const max = DamageFormulas.matrixMax({ system: 4 })

    // Assert
    expect(max).toBe(10)
  })

  it("rounds an odd System up", () => {
    // Arrange / Act
    const max = DamageFormulas.matrixMax({ system: 5 })

    // Assert
    expect(max).toBe(11)
  })

  it("floors at 8 for a System of 0", () => {
    // Arrange / Act
    const max = DamageFormulas.matrixMax({ system: 0 })

    // Assert
    expect(max).toBe(8)
  })
})
