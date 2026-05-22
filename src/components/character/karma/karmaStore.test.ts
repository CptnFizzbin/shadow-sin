import { describe, expect, it } from "vitest"

import type { KarmaState } from "./karmaStore.ts"
import { KarmaStore } from "./karmaStore.ts"

const makeKarma = (overrides: Partial<KarmaState> = {}): KarmaState => ({
  current: 0,
  total: 0,
  log: [],
  ...overrides,
})

describe("KarmaStore.addKarma", () => {
  it("increases both current and total by the given amount", () => {
    // Arrange
    const store = new KarmaStore(makeKarma({ current: 5, total: 10 }))

    // Act
    store.addKarma(3)

    // Assert
    expect(store.state.current).toBe(8)
    expect(store.state.total).toBe(13)
  })

  it("appends one positive-amount ledger entry per call", () => {
    // Arrange
    const store = new KarmaStore(makeKarma())

    // Act
    store.addKarma(7)

    // Assert
    expect(store.state.log).toHaveLength(1)
    const [entry] = store.state.log
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
    const store = new KarmaStore(makeKarma())

    // Act
    store.addKarma(1)
    store.addKarma(2)

    // Assert
    expect(store.state.log).toHaveLength(2)
    expect(store.state.log[0].amount).toBe(1)
    expect(store.state.log[1].amount).toBe(2)
  })
})

describe("KarmaStore.spendKarma", () => {
  it("decreases current by the given amount", () => {
    // Arrange
    const store = new KarmaStore(makeKarma({ current: 10, total: 10 }))

    // Act
    store.spendKarma(3)

    // Assert
    expect(store.state.current).toBe(7)
    expect(store.state.total).toBe(10)
  })

  it("throws on overspend instead of silently clamping current to zero", () => {
    // Arrange
    const store = new KarmaStore(makeKarma({ current: 2, total: 5 }))

    // Act + Assert
    expect(() => store.spendKarma(10)).toThrow(/insufficient karma/i)
    // current is unchanged
    expect(store.state.current).toBe(2)
  })

  it("throws when amount is non-positive", () => {
    // Arrange
    const store = new KarmaStore(makeKarma({ current: 5, total: 5 }))

    // Act + Assert
    expect(() => store.spendKarma(0)).toThrow(/positive/i)
    expect(() => store.spendKarma(-1)).toThrow(/positive/i)
  })
})

describe("KarmaStore.addKarma — positive-amount guard", () => {
  it("throws when amount is zero or negative", () => {
    // Arrange
    const store = new KarmaStore(makeKarma({ current: 5, total: 5 }))

    // Act + Assert
    expect(() => store.addKarma(0)).toThrow(/positive/i)
    expect(() => store.addKarma(-3)).toThrow(/positive/i)
    // state untouched
    expect(store.state.current).toBe(5)
    expect(store.state.total).toBe(5)
    expect(store.state.log).toEqual([])
  })
})
