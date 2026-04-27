import { describe, expect, it } from "vitest"

import type { InitiativePassState } from "#/components/system/initiative/initiativePassStore.ts"
import { InitiativePassStore } from "#/components/system/initiative/initiativePassStore.ts"

const makeStore = (overrides: Partial<InitiativePassState> = {}) =>
  new InitiativePassStore({
    passesCompleted: [],
    rolledResults: undefined,
    goingFirst: undefined,
    extraPasses: 0,
    ...overrides,
  })

// ─── initial state ────────────────────────────────────────────────────────────

describe("initial state", () => {
  it("starts with empty passesCompleted and zero extraPasses", () => {
    // Arrange — no setup needed

    // Act
    const store = makeStore()

    // Assert
    expect(store.state.passesCompleted).toEqual([])
    expect(store.state.extraPasses).toBe(0)
    expect(store.state.rolledResults).toBeUndefined()
    expect(store.state.goingFirst).toBeUndefined()
  })
})

// ─── togglePass ───────────────────────────────────────────────────────────────

describe("togglePass", () => {
  it("marks a pass as completed when it was not completed", () => {
    // Arrange
    const store = makeStore()

    // Act
    store.togglePass(0)

    // Assert
    expect(store.state.passesCompleted).toContain(0)
  })

  it("removes a pass when it was already completed", () => {
    // Arrange
    const store = makeStore({ passesCompleted: [0] })

    // Act
    store.togglePass(0)

    // Assert
    expect(store.state.passesCompleted).not.toContain(0)
  })

  it("toggling multiple passes accumulates independently", () => {
    // Arrange
    const store = makeStore()

    // Act
    store.togglePass(0)
    store.togglePass(2)

    // Assert
    expect(store.state.passesCompleted).toContain(0)
    expect(store.state.passesCompleted).toContain(2)
    expect(store.state.passesCompleted).not.toContain(1)
  })
})

// ─── setRolledResults ─────────────────────────────────────────────────────────

describe("setRolledResults", () => {
  it("stores the provided results array", () => {
    // Arrange
    const store = makeStore()

    // Act
    store.setRolledResults([1, 3, 5, 6])

    // Assert
    expect(store.state.rolledResults).toEqual([1, 3, 5, 6])
  })

  it("replaces previously stored results", () => {
    // Arrange
    const store = makeStore({ rolledResults: [2, 4] })

    // Act
    store.setRolledResults([5, 6])

    // Assert
    expect(store.state.rolledResults).toEqual([5, 6])
  })
})

// ─── clearRolledResults ───────────────────────────────────────────────────────

describe("clearRolledResults", () => {
  it("sets rolledResults back to undefined", () => {
    // Arrange
    const store = makeStore({ rolledResults: [5, 6] })

    // Act
    store.clearRolledResults()

    // Assert
    expect(store.state.rolledResults).toBeUndefined()
  })
})

// ─── setGoingFirst ────────────────────────────────────────────────────────────

describe("setGoingFirst", () => {
  it("sets goingFirst to true", () => {
    // Arrange
    const store = makeStore()

    // Act
    store.setGoingFirst(true)

    // Assert
    expect(store.state.goingFirst).toBe(true)
  })

  it("sets goingFirst to false", () => {
    // Arrange
    const store = makeStore({ goingFirst: true })

    // Act
    store.setGoingFirst(false)

    // Assert
    expect(store.state.goingFirst).toBe(false)
  })
})

// ─── gainExtraPass ────────────────────────────────────────────────────────────

describe("gainExtraPass", () => {
  it("increments extraPasses by 1", () => {
    // Arrange
    const store = makeStore()

    // Act
    store.gainExtraPass()

    // Assert
    expect(store.state.extraPasses).toBe(1)
  })

  it("accumulates across multiple calls", () => {
    // Arrange
    const store = makeStore()

    // Act
    store.gainExtraPass()
    store.gainExtraPass()
    store.gainExtraPass()

    // Assert
    expect(store.state.extraPasses).toBe(3)
  })

  it("stacks on top of a pre-existing extraPasses value", () => {
    // Arrange
    const store = makeStore({ extraPasses: 2 })

    // Act
    store.gainExtraPass()

    // Assert
    expect(store.state.extraPasses).toBe(3)
  })
})

// ─── resetPasses ──────────────────────────────────────────────────────────────

describe("resetPasses", () => {
  it("clears passesCompleted, rolledResults, goingFirst, and extraPasses", () => {
    // Arrange
    const store = makeStore({
      passesCompleted: [0, 1],
      rolledResults: [3, 5, 6],
      goingFirst: true,
      extraPasses: 2,
    })

    // Act
    store.resetPasses()

    // Assert
    expect(store.state.passesCompleted).toEqual([])
    expect(store.state.rolledResults).toBeUndefined()
    expect(store.state.goingFirst).toBeUndefined()
    expect(store.state.extraPasses).toBe(0)
  })
})
