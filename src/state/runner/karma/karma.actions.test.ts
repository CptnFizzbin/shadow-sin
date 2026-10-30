import { describe, expect, it } from "vitest"

import { addKarma, adjustKarma, buyKarma, sellKarma, spendKarma } from "./karma.actions.ts"
import { karmaReducer } from "./karma.state.ts"

const makeKarma = (overrides: Partial<ReturnType<typeof karmaReducer>> = {}) => ({
  current: 0,
  total: 0,
  log: [],
  ...overrides,
})

describe.concurrent("addKarma", () => {
  it("increases both current and total by the given amount", () => {
    // Arrange
    const state = makeKarma({ current: 5, total: 10 })

    // Act
    const next = karmaReducer(state, addKarma(3))

    // Assert
    expect(next.current).toBe(8)
    expect(next.total).toBe(13)
  })

  it("appends one positive-amount ledger entry per call", () => {
    // Arrange
    const state = makeKarma()

    // Act
    const next = karmaReducer(state, addKarma(7))

    // Assert
    expect(next.log).toHaveLength(1)
    const [entry] = next.log
    expect(entry.amount).toBe(7)
    expect(entry.source).toBe("addKarma")
    expect(entry.description).toMatch(/7/)
    expect(entry.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
    expect(new Date(entry.timestamp).toISOString()).toBe(entry.timestamp)
  })

  it("preserves existing log entries across multiple adds", () => {
    // Arrange
    let state = makeKarma()

    // Act
    state = karmaReducer(state, addKarma(1))
    state = karmaReducer(state, addKarma(2))

    // Assert
    expect(state.log).toHaveLength(2)
    expect(state.log[0].amount).toBe(1)
    expect(state.log[1].amount).toBe(2)
  })

  it("throws when amount is zero or negative", () => {
    // Arrange / Act / Assert
    expect(() => addKarma(0)).toThrow(/positive/i)
    expect(() => addKarma(-3)).toThrow(/positive/i)
  })
})

describe.concurrent("spendKarma", () => {
  it("decreases current by the given amount", () => {
    // Arrange
    const state = makeKarma({ current: 10, total: 10 })

    // Act
    const next = karmaReducer(state, spendKarma(3))

    // Assert
    expect(next.current).toBe(7)
    expect(next.total).toBe(10)
  })

  it("throws on overspend instead of silently clamping current to zero", () => {
    // Arrange
    const state = makeKarma({ current: 2, total: 5 })

    // Act
    const overspend = () => karmaReducer(state, spendKarma(10))

    // Assert
    expect(overspend).toThrow(/insufficient karma/i)
  })

  it("throws when amount is non-positive", () => {
    // Arrange / Act / Assert
    expect(() => spendKarma(0)).toThrow(/positive/i)
    expect(() => spendKarma(-1)).toThrow(/positive/i)
  })
})

describe.concurrent("buyKarma", () => {
  it("raises current karma, leaves total earned alone, and logs the nuyen cost", () => {
    // Arrange
    const state = makeKarma({ current: 4, total: 10 })

    // Act
    const next = karmaReducer(state, buyKarma(2, 5000))

    // Assert
    expect(next.current).toBe(6)
    expect(next.total).toBe(10)
    expect(next.log).toHaveLength(1)
    expect(next.log[0]).toMatchObject({ amount: 2, source: "buyKarma" })
    expect(next.log[0].description).toMatch(/10,000¥/)
  })

  it("throws when amount is non-positive", () => {
    // Arrange / Act / Assert
    expect(() => buyKarma(0, 5000)).toThrow(/positive/i)
  })
})

describe.concurrent("sellKarma", () => {
  it("lowers current karma and logs a negative entry with the nuyen gained", () => {
    // Arrange
    const state = makeKarma({ current: 4, total: 10 })

    // Act
    const next = karmaReducer(state, sellKarma(3, 2500))

    // Assert
    expect(next.current).toBe(1)
    expect(next.total).toBe(10)
    expect(next.log[0]).toMatchObject({ amount: -3, source: "sellKarma" })
    expect(next.log[0].description).toMatch(/7,500¥/)
  })

  it("throws when selling more karma than the Runner has", () => {
    // Arrange
    const state = makeKarma({ current: 2, total: 5 })

    // Act
    const oversell = () => karmaReducer(state, sellKarma(3, 2500))

    // Assert
    expect(oversell).toThrow(/insufficient karma/i)
  })
})

describe.concurrent("adjustKarma", () => {
  it("applies both deltas and logs the change to current karma with the reason", () => {
    // Arrange
    const state = makeKarma({ current: 4, total: 10 })

    // Act
    const next = karmaReducer(state, adjustKarma({ currentDelta: -1, totalDelta: 5, reason: "GM correction" }))

    // Assert
    expect(next.current).toBe(3)
    expect(next.total).toBe(15)
    expect(next.log[0]).toMatchObject({ amount: -1, source: "adjustKarma" })
    expect(next.log[0].description).toBe("Adjusted karma (current -1, total earned +5): GM correction")
  })

  it("logs a zero-amount entry when only the total earned changes", () => {
    // Arrange
    const state = makeKarma({ current: 4, total: 10 })

    // Act
    const next = karmaReducer(state, adjustKarma({ currentDelta: 0, totalDelta: 2 }))

    // Assert
    expect(next.current).toBe(4)
    expect(next.total).toBe(12)
    expect(next.log[0]).toMatchObject({ amount: 0, description: "Adjusted karma (total earned +2)" })
  })

  it("throws when the adjustment would leave karma negative", () => {
    // Arrange
    const state = makeKarma({ current: 1, total: 1 })

    // Act
    const overAdjust = () => karmaReducer(state, adjustKarma({ currentDelta: -2, totalDelta: 0 }))

    // Assert
    expect(overAdjust).toThrow(/negative/i)
  })

  it("throws when nothing changes", () => {
    // Arrange / Act / Assert
    expect(() => adjustKarma({ currentDelta: 0, totalDelta: 0 })).toThrow(/non-zero/i)
  })
})
