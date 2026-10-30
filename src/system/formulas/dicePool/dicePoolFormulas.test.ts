import { describe, expect, it } from "vitest"

import { DicePoolFormulas } from "./dicePoolFormulas.ts"

describe.concurrent("DicePoolFormulas.isDefaulting", () => {
  it("defaults when untrained and defaulting is allowed", () => {
    // Arrange / Act
    const isDefaulting = DicePoolFormulas.isDefaulting({ rawValue: 0, defaulting: true })

    // Assert
    expect(isDefaulting).toBe(true)
  })

  it("doesn't default when trained", () => {
    // Arrange / Act
    const isDefaulting = DicePoolFormulas.isDefaulting({ rawValue: 1, defaulting: true })

    // Assert
    expect(isDefaulting).toBe(false)
  })

  it("doesn't default when defaulting is not allowed", () => {
    // Arrange / Act
    const isDefaulting = DicePoolFormulas.isDefaulting({ rawValue: 0, defaulting: false })

    // Assert
    expect(isDefaulting).toBe(false)
  })
})
