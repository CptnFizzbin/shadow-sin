import { describe, expect, it } from "vitest"

import { addKarma, spendKarma } from "./karmaSlice.actions.ts"
import { karmaReducer } from "./karmaSlice.ts"

const makeKarma = (overrides: Partial<ReturnType<typeof karmaReducer>> = {}) => ({
  current: 0,
  total: 0,
  log: [],
  ...overrides,
})

describe("addKarma", () => {
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

describe("spendKarma", () => {
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
