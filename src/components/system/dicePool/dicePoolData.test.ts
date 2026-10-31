import { describe, expect, it } from "vitest"

import type { DicePoolConfig } from "./dicePoolData.tsx"
import { createDicePool } from "./dicePoolData.tsx"

const makeConfig = (overrides: Partial<DicePoolConfig> = {}): DicePoolConfig => ({
  id: "test.pool",
  label: "Test Pool",
  groups: [{ name: "AGI", size: 4, type: "attribute" }],
  ...overrides,
})

describe.concurrent("createDicePool", () => {
  it("appends a single Wound penalty group when the Runner is wounded", () => {
    // Arrange
    const config = makeConfig()

    // Act
    const pool = createDicePool(config, 2)

    // Assert
    expect(pool.groups).toEqual([
      { name: "AGI", size: 4, type: "attribute" },
      { name: "Wound", size: -2, type: "penalty" },
    ])
    expect(pool.size).toBe(2)
  })

  it("adds no Wound group when the Runner is unwounded", () => {
    // Arrange
    const config = makeConfig()

    // Act
    const pool = createDicePool(config, 0)

    // Assert
    expect(pool.groups).toEqual([{ name: "AGI", size: 4, type: "attribute" }])
    expect(pool.size).toBe(4)
  })

  it("adds no Wound group when excludeWoundMod is set", () => {
    // Arrange
    const config = makeConfig({ excludeWoundMod: true })

    // Act
    const pool = createDicePool(config, 2)

    // Assert
    expect(pool.groups).toEqual([{ name: "AGI", size: 4, type: "attribute" }])
    expect(pool.size).toBe(4)
  })
})
