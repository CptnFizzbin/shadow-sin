import { describe, expect, it, vi } from "vitest"

import { DiceTrayApi } from "./diceTrayApi.ts"
import { TestType } from "./testType.ts"

// Each test gets its own `DiceTrayApi` (and spied roller) so the suite can run
// concurrently — a shared instance from `beforeEach` would race across tests.
function makeApi(): DiceTrayApi {
  const api = new DiceTrayApi()
  vi.spyOn(api.roller, "rollAll").mockResolvedValue(api.roller)
  vi.spyOn(api.roller, "rollMisses").mockResolvedValue(api.roller)
  vi.spyOn(api.roller, "addDice").mockReturnValue(api.roller)
  vi.spyOn(api.roller, "rollDice").mockResolvedValue(api.roller)
  vi.spyOn(api.roller, "reset").mockReturnValue(api.roller)
  vi.spyOn(api.roller, "setPoolSize").mockReturnValue(api.roller)
  return api
}

describe.concurrent("DiceTrayApi", () => {
  describe("setDice", () => {
    it("opens the tray, sets pool size, and clears edge state", () => {
      const api = makeApi()
      api.store.setState((prev) => ({ ...prev, edgeSpent: true }))

      api.setDice(8)

      expect(api.store.getState().open).toBe(true)
      expect(api.store.getState().poolSize).toBe(8)
      expect(api.store.getState().edgeSpent).toBe(false)
    })

    it("clamps pool size to a minimum of 0", () => {
      const api = makeApi()

      api.setDice(0)

      expect(api.store.getState().poolSize).toBe(0)
    })
  })

  describe("rollEdge", () => {
    it("marks edge as spent and delegates to the roller", () => {
      const api = makeApi()

      api.rollEdge(3)

      expect(api.store.getState().edgeSpent).toBe(true)
      expect(vi.mocked(api.roller.addDice)).toHaveBeenCalledWith(3)
    })

    it("is a no-op when edge is already spent", () => {
      const api = makeApi()
      api.store.setState((prev) => ({ ...prev, edgeSpent: true }))

      api.rollEdge(3)

      expect(vi.mocked(api.roller.addDice)).not.toHaveBeenCalled()
    })

    it("is a no-op when edge count is 0 or less", () => {
      const api = makeApi()

      api.rollEdge(0)

      expect(api.store.getState().edgeSpent).toBe(false)
      expect(vi.mocked(api.roller.addDice)).not.toHaveBeenCalled()
    })
  })

  describe("rerollMisses", () => {
    it("marks edge as spent and delegates to the roller", () => {
      const api = makeApi()

      api.rerollMisses()

      expect(api.store.getState().edgeSpent).toBe(true)
      expect(vi.mocked(api.roller.rollMisses)).toHaveBeenCalled()
    })

    it("is a no-op when edge is already spent", () => {
      const api = makeApi()
      api.store.setState((prev) => ({ ...prev, edgeSpent: true }))

      api.rerollMisses()

      expect(vi.mocked(api.roller.rollMisses)).not.toHaveBeenCalled()
    })
  })

  describe("close", () => {
    it("sets open to false", () => {
      const api = makeApi()
      api.open()

      api.close()

      expect(api.store.getState().open).toBe(false)
    })
  })

  describe("reset", () => {
    it("clears edgeSpent and extendedHistory", () => {
      const api = makeApi()
      api.store.setState((prev) => ({
        ...prev,
        edgeSpent: true,
        extendedHistory: [{ hits: 2, edgeUsed: false }],
      }))

      api.reset()

      expect(api.store.getState().edgeSpent).toBe(false)
      expect(api.store.getState().extendedHistory).toHaveLength(0)
    })
  })

  describe("setTestType", () => {
    it("resets state while preserving poolSize, physicalMode, and open", () => {
      const api = makeApi()
      api.setDice(10)
      api.store.setState((prev) => ({ ...prev, edgeSpent: true, physicalMode: true }))

      api.setTestType(TestType.Extended)

      expect(api.store.getState().testType).toBe(TestType.Extended)
      expect(api.store.getState().poolSize).toBe(10)
      expect(api.store.getState().physicalMode).toBe(true)
      expect(api.store.getState().open).toBe(true)
      expect(api.store.getState().edgeSpent).toBe(false)
    })
  })
})
