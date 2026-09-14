import { describe, expect, it } from "vitest"

import type { ExtendedTestEntry } from "#/system/extendedTestData.ts"

import {
  addExtendedTest,
  removeExtendedTest,
  setExtendedTestAttempts,
  setExtendedTestHits,
  updateExtendedTest,
} from "./extendedTestsSlice.actions.ts"
import { extendedTestsReducer } from "./extendedTestsSlice.ts"

const makeTest = (overrides: Partial<ExtendedTestEntry> = {}): ExtendedTestEntry => ({
  id: "00000000-0000-0000-0000-000000000001",
  description: "Researching a fixer's background",
  interval: { days: 1 },
  hitsThreshold: 6,
  currentHits: 0,
  attempts: 0,
  ...overrides,
})

describe.concurrent("addExtendedTest", () => {
  it("appends a new entry with a stamped UUID id", () => {
    // Arrange
    const state: ExtendedTestEntry[] = []

    // Act
    const next = extendedTestsReducer(state, addExtendedTest({
      description: "Crafting a fake SIN",
      interval: { weeks: 1 },
      hitsThreshold: 10,
      currentHits: 0,
      attempts: 0,
    }))

    // Assert
    expect(next).toHaveLength(1)
    expect(next[0].description).toBe("Crafting a fake SIN")
    expect(next[0].id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
  })

  it("preserves existing entries across multiple adds", () => {
    // Arrange
    let state: ExtendedTestEntry[] = []

    // Act
    state = extendedTestsReducer(state, addExtendedTest({
      description: "First",
      interval: { days: 1 },
      hitsThreshold: 5,
      currentHits: 0,
      attempts: 0,
    }))
    state = extendedTestsReducer(state, addExtendedTest({
      description: "Second",
      interval: { hours: 1 },
      hitsThreshold: 3,
      currentHits: 0,
      attempts: 0,
    }))

    // Assert
    expect(state).toHaveLength(2)
    expect(state.map((test) => test.description)).toEqual(["First", "Second"])
  })
})

describe.concurrent("updateExtendedTest", () => {
  it("replaces the matching entry", () => {
    // Arrange
    const test = makeTest()
    const state = [test]

    // Act
    const next = extendedTestsReducer(state, updateExtendedTest({ ...test, description: "Updated", hitsThreshold: 8 }))

    // Assert
    expect(next[0].description).toBe("Updated")
    expect(next[0].hitsThreshold).toBe(8)
  })

  it("does nothing when no entry matches the given id", () => {
    // Arrange
    const test = makeTest()
    const state = [test]

    // Act
    const next = extendedTestsReducer(state, updateExtendedTest(makeTest({ id: "00000000-0000-0000-0000-000000000099" })))

    // Assert
    expect(next).toEqual(state)
  })
})

describe.concurrent("removeExtendedTest", () => {
  it("removes only the matching entry", () => {
    // Arrange
    const first = makeTest({ id: "00000000-0000-0000-0000-000000000001" })
    const second = makeTest({ id: "00000000-0000-0000-0000-000000000002" })
    const state = [first, second]

    // Act
    const next = extendedTestsReducer(state, removeExtendedTest(first.id))

    // Assert
    expect(next).toEqual([second])
  })
})

describe.concurrent("setExtendedTestHits", () => {
  it("updates only the matching entry's currentHits", () => {
    // Arrange
    const test = makeTest({ currentHits: 2 })
    const state = [test]

    // Act
    const next = extendedTestsReducer(state, setExtendedTestHits({ id: test.id, hits: 5 }))

    // Assert
    expect(next[0].currentHits).toBe(5)
  })
})

describe.concurrent("setExtendedTestAttempts", () => {
  it("updates only the matching entry's attempts", () => {
    // Arrange
    const test = makeTest({ attempts: 1 })
    const state = [test]

    // Act
    const next = extendedTestsReducer(state, setExtendedTestAttempts({ id: test.id, attempts: 2 }))

    // Assert
    expect(next[0].attempts).toBe(2)
  })
})
