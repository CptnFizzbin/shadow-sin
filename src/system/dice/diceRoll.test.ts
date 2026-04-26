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
    vi.spyOn(Math, "random").mockReturnValue(0)
    expect(rollD6()).toBe(1)
  })

  it("returns 6 when Math.random() approaches its maximum (just below 1)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9999)
    expect(rollD6()).toBe(6)
  })

  it("maps the mid-range correctly — 0.5 produces 4", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    expect(rollD6()).toBe(4)
  })

  it("always returns an integer between 1 and 6 across many rolls", () => {
    for (let i = 0; i < 1000; i++) {
      const result = rollD6()
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(6)
      expect(Number.isInteger(result)).toBe(true)
    }
  })
})

// ─── rollDice ────────────────────────────────────────────────────────────────

describe("rollDice", () => {
  it("returns an array of the requested length", () => {
    expect(rollDice(1)).toHaveLength(1)
    expect(rollDice(5)).toHaveLength(5)
    expect(rollDice(12)).toHaveLength(12)
  })

  it("returns an empty array for count 0", () => {
    expect(rollDice(0)).toEqual([])
  })

  it("each element is a valid d6 result", () => {
    const results = rollDice(100)
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
    expect(countHits([5, 6])).toBe(2)
  })

  it("does not count 1–4 as hits", () => {
    expect(countHits([1, 2, 3, 4])).toBe(0)
  })

  it("handles a mixed pool correctly", () => {
    expect(countHits([1, 3, 5, 6, 2, 4])).toBe(2)
  })

  it("returns 0 for an empty array", () => {
    expect(countHits([])).toBe(0)
  })

  it("returns the full count when every die is a hit", () => {
    expect(countHits([5, 5, 6, 6, 5])).toBe(5)
  })
})

// ─── countOnes ───────────────────────────────────────────────────────────────

describe("countOnes", () => {
  it("counts only 1s", () => {
    expect(countOnes([1, 1, 3, 5])).toBe(2)
  })

  it("returns 0 when no 1s are present", () => {
    expect(countOnes([2, 3, 4, 5, 6])).toBe(0)
  })

  it("returns 0 for an empty array", () => {
    expect(countOnes([])).toBe(0)
  })
})

// ─── isGlitch ────────────────────────────────────────────────────────────────

describe("isGlitch", () => {
  it("is a glitch when more than half the dice show 1s", () => {
    // 3 ones out of 5 dice — more than half
    expect(isGlitch([1, 1, 1, 3, 5])).toBe(true)
  })

  it("is not a glitch when exactly half the dice show 1s", () => {
    // 2 ones out of 4 dice — exactly half, not more than half
    expect(isGlitch([1, 1, 3, 5])).toBe(false)
  })

  it("is not a glitch when fewer than half show 1s", () => {
    expect(isGlitch([1, 2, 3, 4, 5])).toBe(false)
  })

  it("returns false for an empty array", () => {
    expect(isGlitch([])).toBe(false)
  })

  it("is a glitch with a single die showing 1", () => {
    expect(isGlitch([1])).toBe(true)
  })
})

// ─── isCriticalGlitch ────────────────────────────────────────────────────────

describe("isCriticalGlitch", () => {
  it("is a critical glitch when glitch conditions met and zero hits", () => {
    // 3 ones, no hits
    expect(isCriticalGlitch([1, 1, 1, 3, 4])).toBe(true)
  })

  it("is only a regular glitch when glitch conditions met but hits exist", () => {
    // 3 ones but one hit — glitch, not critical
    expect(isCriticalGlitch([1, 1, 1, 5, 4])).toBe(false)
  })

  it("is not a critical glitch when no glitch at all", () => {
    expect(isCriticalGlitch([2, 3, 5, 6])).toBe(false)
  })

  it("returns false for an empty array", () => {
    expect(isCriticalGlitch([])).toBe(false)
  })
})

// ─── rollDiceExploding ───────────────────────────────────────────────────────

describe("rollDiceExploding", () => {
  afterEach(() => vi.restoreAllMocks())

  it("returns at least count dice when no 6s are rolled", () => {
    // Mock to always return 3 — no explosions
    vi.spyOn(Math, "random").mockReturnValue(0.4) // floor(0.4 * 6) + 1 = 3
    const results = rollDiceExploding(4)
    expect(results).toHaveLength(4)
    expect(results.every((r) => r === 3)).toBe(true)
  })

  it("adds one extra die per 6 rolled (Rule of Six)", () => {
    // First batch: two 6s and two 3s. Second batch (from explosions): two 3s.
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.9999) // 6
      .mockReturnValueOnce(0.9999) // 6
      .mockReturnValueOnce(0.4) // 3
      .mockReturnValueOnce(0.4) // 3
      .mockReturnValueOnce(0.4) // 3 (extra die 1)
      .mockReturnValueOnce(0.4) // 3 (extra die 2)

    const results = rollDiceExploding(4)
    // Original 4 + 2 explosions = 6 dice total
    expect(results).toHaveLength(6)
  })

  it("all results are valid d6 values", () => {
    const results = rollDiceExploding(20)
    for (const r of results) {
      expect(r).toBeGreaterThanOrEqual(1)
      expect(r).toBeLessThanOrEqual(6)
    }
  })

  it("returns empty array for count 0", () => {
    expect(rollDiceExploding(0)).toEqual([])
  })
})

// ─── rerollMisses ────────────────────────────────────────────────────────────

describe("rerollMisses", () => {
  afterEach(() => vi.restoreAllMocks())

  it("preserves existing hits and re-rolls non-hits", () => {
    // Existing: [5, 6, 2, 3] — 2 hits, 2 misses
    // Re-roll mocked to return 4 and 1
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.5) // 4
      .mockReturnValueOnce(0) // 1

    const result = rerollMisses([5, 6, 2, 3])
    expect(result).toHaveLength(4)
    // Hits are kept
    expect(result.filter((r) => r === 5 || r === 6)).toHaveLength(2)
    // Misses replaced with new rolls
    expect(result).toContain(4)
    expect(result).toContain(1)
  })

  it("returns only hits when all dice were already hits", () => {
    const result = rerollMisses([5, 6, 5, 6])
    expect(result).toEqual([5, 6, 5, 6])
  })

  it("re-rolls all dice when none were hits", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9999) // all 6s
    const result = rerollMisses([1, 2, 3, 4])
    expect(result).toHaveLength(4)
    expect(result.every((r) => r === 6)).toBe(true)
  })

  it("returns empty array for empty input", () => {
    expect(rerollMisses([])).toEqual([])
  })
})

// ─── sumDice ─────────────────────────────────────────────────────────────────

describe("sumDice", () => {
  it("sums a single die correctly", () => {
    expect(sumDice([4])).toBe(4)
  })

  it("sums multiple dice correctly", () => {
    expect(sumDice([1, 2, 3])).toBe(6)
  })

  it("returns 0 for an empty array", () => {
    expect(sumDice([])).toBe(0)
  })

  it("handles a max roll", () => {
    expect(sumDice([6, 6, 6, 6])).toBe(24)
  })
})
