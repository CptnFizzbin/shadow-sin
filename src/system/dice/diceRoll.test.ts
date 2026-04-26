import { afterEach, describe, expect, it, vi } from "vitest"

import {
  countHits,
  countOnes,
  isCriticalGlitch,
  isGlitch,
  rerollMisses,
  rollD6,
  rollDice,
  rollDiceExploding,
  sumDice,
} from "#/system/dice/diceRoll.ts"

// ─── rollD6 ──────────────────────────────────────────────────────────────────

describe("rollD6", () => {
  afterEach(() => vi.restoreAllMocks())

  it("returns 1 when Math.random() is at its minimum (just above 0)", () => {
    // Arrange
    vi.spyOn(Math, "random").mockReturnValue(0)

    // Act
    const result = rollD6()

    // Assert
    expect(result).toBe(1)
  })

  it("returns 6 when Math.random() approaches its maximum (just below 1)", () => {
    // Arrange
    vi.spyOn(Math, "random").mockReturnValue(0.9999)

    // Act
    const result = rollD6()

    // Assert
    expect(result).toBe(6)
  })

  it("maps the mid-range correctly — 0.5 produces 4", () => {
    // Arrange
    vi.spyOn(Math, "random").mockReturnValue(0.5)

    // Act
    const result = rollD6()

    // Assert
    expect(result).toBe(4)
  })

  it("always returns an integer between 1 and 6 across many rolls", () => {
    // Arrange
    const results: number[] = []

    // Act
    for (let i = 0; i < 1000; i++) results.push(rollD6())

    // Assert
    for (const result of results) {
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(6)
      expect(Number.isInteger(result)).toBe(true)
    }
  })
})

// ─── rollDice ────────────────────────────────────────────────────────────────

describe("rollDice", () => {
  it("returns an array of the requested length", () => {
    // Arrange — no setup needed

    // Act
    const r1 = rollDice(1)
    const r5 = rollDice(5)
    const r12 = rollDice(12)

    // Assert
    expect(r1).toHaveLength(1)
    expect(r5).toHaveLength(5)
    expect(r12).toHaveLength(12)
  })

  it("returns an empty array for count 0", () => {
    // Arrange — no setup needed

    // Act
    const result = rollDice(0)

    // Assert
    expect(result).toEqual([])
  })

  it("each element is a valid d6 result", () => {
    // Arrange — no setup needed

    // Act
    const results = rollDice(100)

    // Assert
    for (const r of results) {
      expect(r).toBeGreaterThanOrEqual(1)
      expect(r).toBeLessThanOrEqual(6)
      expect(Number.isInteger(r)).toBe(true)
    }
  })
})

// ─── countHits ───────────────────────────────────────────────────────────────

describe("countHits", () => {
  it("counts 5s and 6s as hits", () => {
    // Arrange
    const pool = [5, 6]

    // Act
    const result = countHits(pool)

    // Assert
    expect(result).toBe(2)
  })

  it("does not count 1–4 as hits", () => {
    // Arrange
    const pool = [1, 2, 3, 4]

    // Act
    const result = countHits(pool)

    // Assert
    expect(result).toBe(0)
  })

  it("handles a mixed pool correctly", () => {
    // Arrange
    const pool = [1, 3, 5, 6, 2, 4]

    // Act
    const result = countHits(pool)

    // Assert
    expect(result).toBe(2)
  })

  it("returns 0 for an empty array", () => {
    // Arrange — no setup needed

    // Act
    const result = countHits([])

    // Assert
    expect(result).toBe(0)
  })

  it("returns the full count when every die is a hit", () => {
    // Arrange
    const pool = [5, 5, 6, 6, 5]

    // Act
    const result = countHits(pool)

    // Assert
    expect(result).toBe(5)
  })
})

// ─── countOnes ───────────────────────────────────────────────────────────────

describe("countOnes", () => {
  it("counts only 1s", () => {
    // Arrange
    const pool = [1, 1, 3, 5]

    // Act
    const result = countOnes(pool)

    // Assert
    expect(result).toBe(2)
  })

  it("returns 0 when no 1s are present", () => {
    // Arrange
    const pool = [2, 3, 4, 5, 6]

    // Act
    const result = countOnes(pool)

    // Assert
    expect(result).toBe(0)
  })

  it("returns 0 for an empty array", () => {
    // Arrange — no setup needed

    // Act
    const result = countOnes([])

    // Assert
    expect(result).toBe(0)
  })
})

// ─── isGlitch ────────────────────────────────────────────────────────────────

describe("isGlitch", () => {
  it("is a glitch when more than half the dice show 1s", () => {
    // Arrange
    const pool = [1, 1, 1, 3, 5] // 3 ones out of 5 dice — more than half

    // Act
    const result = isGlitch(pool)

    // Assert
    expect(result).toBe(true)
  })

  it("is not a glitch when exactly half the dice show 1s", () => {
    // Arrange
    const pool = [1, 1, 3, 5] // 2 ones out of 4 dice — exactly half, not more than half

    // Act
    const result = isGlitch(pool)

    // Assert
    expect(result).toBe(false)
  })

  it("is not a glitch when fewer than half show 1s", () => {
    // Arrange
    const pool = [1, 2, 3, 4, 5]

    // Act
    const result = isGlitch(pool)

    // Assert
    expect(result).toBe(false)
  })

  it("returns false for an empty array", () => {
    // Arrange — no setup needed

    // Act
    const result = isGlitch([])

    // Assert
    expect(result).toBe(false)
  })

  it("is a glitch with a single die showing 1", () => {
    // Arrange
    const pool = [1]

    // Act
    const result = isGlitch(pool)

    // Assert
    expect(result).toBe(true)
  })
})

// ─── isCriticalGlitch ────────────────────────────────────────────────────────

describe("isCriticalGlitch", () => {
  it("is a critical glitch when glitch conditions met and zero hits", () => {
    // Arrange
    const pool = [1, 1, 1, 3, 4] // 3 ones, no hits

    // Act
    const result = isCriticalGlitch(pool)

    // Assert
    expect(result).toBe(true)
  })

  it("is only a regular glitch when glitch conditions met but hits exist", () => {
    // Arrange
    const pool = [1, 1, 1, 5, 4] // 3 ones but one hit — glitch, not critical

    // Act
    const result = isCriticalGlitch(pool)

    // Assert
    expect(result).toBe(false)
  })

  it("is not a critical glitch when no glitch at all", () => {
    // Arrange
    const pool = [2, 3, 5, 6]

    // Act
    const result = isCriticalGlitch(pool)

    // Assert
    expect(result).toBe(false)
  })

  it("returns false for an empty array", () => {
    // Arrange — no setup needed

    // Act
    const result = isCriticalGlitch([])

    // Assert
    expect(result).toBe(false)
  })
})

// ─── rollDiceExploding ───────────────────────────────────────────────────────

describe("rollDiceExploding", () => {
  afterEach(() => vi.restoreAllMocks())

  it("returns at least count dice when no 6s are rolled", () => {
    // Arrange
    vi.spyOn(Math, "random").mockReturnValue(0.4) // floor(0.4 * 6) + 1 = 3, no explosions

    // Act
    const results = rollDiceExploding(4)

    // Assert
    expect(results).toHaveLength(4)
    expect(results.every((r) => r === 3)).toBe(true)
  })

  it("adds one extra die per 6 rolled (Rule of Six)", () => {
    // Arrange — first batch: two 6s and two 3s; second batch (explosions): two 3s
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.9999) // 6
      .mockReturnValueOnce(0.9999) // 6
      .mockReturnValueOnce(0.4)    // 3
      .mockReturnValueOnce(0.4)    // 3
      .mockReturnValueOnce(0.4)    // 3 (extra die 1)
      .mockReturnValueOnce(0.4)    // 3 (extra die 2)

    // Act
    const results = rollDiceExploding(4)

    // Assert — original 4 + 2 explosions = 6 dice total
    expect(results).toHaveLength(6)
  })

  it("all results are valid d6 values", () => {
    // Arrange — no setup needed

    // Act
    const results = rollDiceExploding(20)

    // Assert
    for (const r of results) {
      expect(r).toBeGreaterThanOrEqual(1)
      expect(r).toBeLessThanOrEqual(6)
    }
  })

  it("returns empty array for count 0", () => {
    // Arrange — no setup needed

    // Act
    const result = rollDiceExploding(0)

    // Assert
    expect(result).toEqual([])
  })
})

// ─── rerollMisses ────────────────────────────────────────────────────────────

describe("rerollMisses", () => {
  afterEach(() => vi.restoreAllMocks())

  it("preserves existing hits and re-rolls non-hits", () => {
    // Arrange — [5, 6, 2, 3]: 2 hits, 2 misses; re-rolled misses mocked to return 4 and 1
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.5) // 4
      .mockReturnValueOnce(0)   // 1

    // Act
    const result = rerollMisses([5, 6, 2, 3])

    // Assert
    expect(result).toHaveLength(4)
    expect(result.filter((r) => r === 5 || r === 6)).toHaveLength(2)
    expect(result).toContain(4)
    expect(result).toContain(1)
  })

  it("returns only hits when all dice were already hits", () => {
    // Arrange
    const pool = [5, 6, 5, 6]

    // Act
    const result = rerollMisses(pool)

    // Assert
    expect(result).toEqual([5, 6, 5, 6])
  })

  it("re-rolls all dice when none were hits", () => {
    // Arrange
    vi.spyOn(Math, "random").mockReturnValue(0.9999) // all 6s

    // Act
    const result = rerollMisses([1, 2, 3, 4])

    // Assert
    expect(result).toHaveLength(4)
    expect(result.every((r) => r === 6)).toBe(true)
  })

  it("returns empty array for empty input", () => {
    // Arrange — no setup needed

    // Act
    const result = rerollMisses([])

    // Assert
    expect(result).toEqual([])
  })
})

// ─── sumDice ─────────────────────────────────────────────────────────────────

describe("sumDice", () => {
  it("sums a single die correctly", () => {
    // Arrange
    const pool = [4]

    // Act
    const result = sumDice(pool)

    // Assert
    expect(result).toBe(4)
  })

  it("sums multiple dice correctly", () => {
    // Arrange
    const pool = [1, 2, 3]

    // Act
    const result = sumDice(pool)

    // Assert
    expect(result).toBe(6)
  })

  it("returns 0 for an empty array", () => {
    // Arrange — no setup needed

    // Act
    const result = sumDice([])

    // Assert
    expect(result).toBe(0)
  })

  it("handles a max roll", () => {
    // Arrange
    const pool = [6, 6, 6, 6]

    // Act
    const result = sumDice(pool)

    // Assert
    expect(result).toBe(24)
  })
})
