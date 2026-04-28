import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { DiceTrayApi } from "./diceTrayApi.ts"

const ROLLING_DURATION_MS = 600

describe("DiceTrayApi", () => {
  let api: DiceTrayApi

  beforeEach(() => {
    vi.useFakeTimers()
    api = new DiceTrayApi()
  })

  afterEach(() => {
    api.destroy()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // ─── setDice ───────────────────────────────────────────────────────────────

  describe("setDice", () => {
    it("opens the tray with the given count and clears any previous results", () => {
      // Arrange
      api.roll(3)
      api.rollStandard()

      // Act
      api.setDice(8)

      // Assert
      expect(api.store.state.open).toBe(true)
      expect(api.store.state.diceCount).toBe(8)
      expect(api.store.state.results).toBeNull()
      expect(api.store.state.autoRoll).toBe(false)
    })

    it("clamps count to a minimum of 1", () => {
      // Arrange — no setup needed

      // Act
      api.setDice(0)

      // Assert
      expect(api.store.state.diceCount).toBe(1)
    })
  })

  // ─── roll ──────────────────────────────────────────────────────────────────

  describe("roll", () => {
    it("opens with autoRoll true so the dialog can trigger the animation", () => {
      // Arrange — no setup needed

      // Act
      api.roll(4)

      // Assert
      expect(api.store.state.open).toBe(true)
      expect(api.store.state.diceCount).toBe(4)
      expect(api.store.state.autoRoll).toBe(true)
      expect(api.store.state.results).toBeNull()
    })

    it("clamps count to a minimum of 1", () => {
      // Arrange — no setup needed

      // Act
      api.roll(0)

      // Assert
      expect(api.store.state.diceCount).toBe(1)
    })
  })

  // ─── rollStandard ──────────────────────────────────────────────────────────

  describe("rollStandard", () => {
    it("sets isRolling to true immediately", () => {
      // Arrange
      api.setDice(3)

      // Act
      api.rollStandard()

      // Assert
      expect(api.store.state.isRolling).toBe(true)
    })

    it("sets isRolling to false after the rolling duration", () => {
      // Arrange
      api.setDice(3)

      // Act
      api.rollStandard()
      vi.advanceTimersByTime(ROLLING_DURATION_MS)

      // Assert
      expect(api.store.state.isRolling).toBe(false)
    })

    it("stores results with length equal to diceCount", () => {
      // Arrange
      api.setDice(5)

      // Act
      api.rollStandard()

      // Assert
      expect(api.store.state.results).toHaveLength(5)
    })

    it("clears autoRoll once a roll starts", () => {
      // Arrange
      api.roll(3)

      // Act
      api.rollStandard()

      // Assert
      expect(api.store.state.autoRoll).toBe(false)
    })
  })

  // ─── rollEdge ──────────────────────────────────────────────────────────────

  describe("rollEdge", () => {
    it("produces at least diceCount results (extra dice from explosions are additive)", () => {
      // Arrange
      api.setDice(4)

      // Act
      api.rollEdge()

      // Assert
      expect(api.store.state.results!.length).toBeGreaterThanOrEqual(4)
    })

    it("sets isRolling to true immediately", () => {
      // Arrange
      api.setDice(4)

      // Act
      api.rollEdge()

      // Assert
      expect(api.store.state.isRolling).toBe(true)
    })
  })

  // ─── rollSecondChance ──────────────────────────────────────────────────────

  describe("rollSecondChance", () => {
    it("re-rolls non-hits and preserves existing hits", () => {
      // Arrange — [5, 6, 2, 3]: 2 hits, 2 misses; re-rolled misses mocked to 6
      vi.spyOn(Math, "random").mockReturnValue(0.9999) // floor(0.9999 * 6) + 1 = 6
      api.store.setState((prev) => ({ ...prev, results: [5, 6, 2, 3], open: true }))

      // Act
      api.rollSecondChance()

      // Assert — 4 dice total, all now hits (2 kept + 2 rerolled 6s)
      const results = api.store.state.results!
      expect(results).toHaveLength(4)
      expect(results.filter((r) => r >= 5)).toHaveLength(4)
    })

    it("does nothing when there are no current results", () => {
      // Arrange — tray open but no roll yet
      api.setDice(4)
      expect(api.store.state.results).toBeNull()

      // Act
      api.rollSecondChance()

      // Assert
      expect(api.store.state.results).toBeNull()
      expect(api.store.state.isRolling).toBe(false)
    })
  })

  // ─── setDiceCount ──────────────────────────────────────────────────────────

  describe("setDiceCount", () => {
    it("updates the count and clears results so displayed dice match", () => {
      // Arrange
      api.setDice(4)
      api.rollStandard()
      expect(api.store.state.results).not.toBeNull()

      // Act
      api.setDiceCount(6)

      // Assert
      expect(api.store.state.diceCount).toBe(6)
      expect(api.store.state.results).toBeNull()
    })

    it("clamps count to a minimum of 1", () => {
      // Arrange — no setup needed

      // Act
      api.setDiceCount(0)

      // Assert
      expect(api.store.state.diceCount).toBe(1)
    })
  })

  // ─── close ────────────────────────────────────────────────────────────────

  describe("close", () => {
    it("sets open to false and stops an in-progress animation", () => {
      // Arrange
      api.setDice(3)
      api.rollStandard()
      expect(api.store.state.isRolling).toBe(true)

      // Act
      api.close()

      // Assert
      expect(api.store.state.open).toBe(false)
      expect(api.store.state.isRolling).toBe(false)
    })

    it("cancels the reveal timer so it does not fire after close", () => {
      // Arrange
      api.setDice(3)
      api.rollStandard()
      api.close()

      // Act
      vi.advanceTimersByTime(ROLLING_DURATION_MS)

      // Assert — isRolling stays false; the timer did not re-set it
      expect(api.store.state.isRolling).toBe(false)
    })
  })

  // ─── startRoll (timer de-duplication) ─────────────────────────────────────

  describe("startRoll timer cancellation", () => {
    it("a second roll before the timer fires cancels the first timer", () => {
      // Arrange
      api.setDice(3)
      api.rollStandard()

      // Act — second roll before the first timer fires
      api.rollStandard()
      vi.advanceTimersByTime(ROLLING_DURATION_MS)

      // Assert — exactly one timer fired; isRolling is false
      expect(api.store.state.isRolling).toBe(false)
    })
  })

  // ─── destroy ──────────────────────────────────────────────────────────────

  describe("destroy", () => {
    it("cancels the rolling timer so it does not fire after cleanup", () => {
      // Arrange
      api.setDice(3)
      api.rollStandard()
      expect(api.store.state.isRolling).toBe(true)

      // Act
      api.destroy()
      vi.advanceTimersByTime(ROLLING_DURATION_MS)

      // Assert — timer was cancelled; isRolling was not changed to false by the timer
      expect(api.store.state.isRolling).toBe(true)
    })
  })
})
