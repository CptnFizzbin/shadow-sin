import { beforeEach, describe, expect, it, vi } from "vitest"

import { DiceTrayApi } from "./diceTrayApi.ts"
import { TestType } from "./testType.ts"

describe("DiceTrayApi", () => {
  let api: DiceTrayApi

  beforeEach(() => {
    api = new DiceTrayApi()
    vi.spyOn(api.roller, "rollAll").mockResolvedValue(api.roller)
    vi.spyOn(api.roller, "rollMisses").mockResolvedValue(api.roller)
    vi.spyOn(api.roller, "addDice").mockReturnValue(api.roller)
    vi.spyOn(api.roller, "rollDice").mockResolvedValue(api.roller)
    vi.spyOn(api.roller, "reset").mockReturnValue(api.roller)
    vi.spyOn(api.roller, "setPoolSize").mockReturnValue(api.roller)
  })

  // ─── setDice ───────────────────────────────────────────────────────────────

  describe("setDice", () => {
    it("opens the tray, sets pool size, and clears edge state", () => {
      api.store.setState((prev) => ({ ...prev, edgeSpent: true }))

      api.setDice(8)

      expect(api.store.state.open).toBe(true)
      expect(api.store.state.poolSize).toBe(8)
      expect(api.store.state.edgeSpent).toBe(false)
    })

    it("clamps pool size to a minimum of 0", () => {
      api.setDice(0)

      expect(api.store.state.poolSize).toBe(0)
    })
  })

  // ─── rollEdge ──────────────────────────────────────────────────────────────

  describe("rollEdge", () => {
    it("marks edge as spent and delegates to the roller", () => {
      api.rollEdge(3)

      expect(api.store.state.edgeSpent).toBe(true)
      expect(vi.mocked(api.roller.addDice)).toHaveBeenCalledWith(3)
    })

    it("is a no-op when edge is already spent", () => {
      api.store.setState((prev) => ({ ...prev, edgeSpent: true }))

      api.rollEdge(3)

      expect(vi.mocked(api.roller.addDice)).not.toHaveBeenCalled()
    })

    it("is a no-op when edge count is 0 or less", () => {
      api.rollEdge(0)

      expect(api.store.state.edgeSpent).toBe(false)
      expect(vi.mocked(api.roller.addDice)).not.toHaveBeenCalled()
    })
  })

  // ─── rerollMisses ─────────────────────────────────────────────────────────

  describe("rerollMisses", () => {
    it("marks edge as spent and delegates to the roller", () => {
      api.rerollMisses()

      expect(api.store.state.edgeSpent).toBe(true)
      expect(vi.mocked(api.roller.rollMisses)).toHaveBeenCalled()
    })

    it("is a no-op when edge is already spent", () => {
      api.store.setState((prev) => ({ ...prev, edgeSpent: true }))

      api.rerollMisses()

      expect(vi.mocked(api.roller.rollMisses)).not.toHaveBeenCalled()
    })
  })

  // ─── close ────────────────────────────────────────────────────────────────

  describe("close", () => {
    it("sets open to false", () => {
      api.open()
      api.close()

      expect(api.store.state.open).toBe(false)
    })
  })

  // ─── reset ────────────────────────────────────────────────────────────────

  describe("reset", () => {
    it("clears edgeSpent and extendedHistory", () => {
      api.store.setState((prev) => ({
        ...prev,
        edgeSpent: true,
        extendedHistory: [{ hits: 2, edgeUsed: false }],
      }))

      api.reset()

      expect(api.store.state.edgeSpent).toBe(false)
      expect(api.store.state.extendedHistory).toHaveLength(0)
    })
  })

  // ─── setTestType ──────────────────────────────────────────────────────────

  describe("setTestType", () => {
    it("resets state while preserving poolSize, physicalMode, and open", () => {
      api.setDice(10)
      api.store.setState((prev) => ({ ...prev, edgeSpent: true, physicalMode: true }))

      api.setTestType(TestType.Extended)

      expect(api.store.state.testType).toBe(TestType.Extended)
      expect(api.store.state.poolSize).toBe(10)
      expect(api.store.state.physicalMode).toBe(true)
      expect(api.store.state.open).toBe(true)
      expect(api.store.state.edgeSpent).toBe(false)
    })
  })
})
