import { describe, expect, it } from "vitest"

import migration from "./20260802_addAgentsArray.ts"

describe("20260802_addAgentsArray", () => {
  it("initialises agents to an empty array when missing", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.agents).toEqual([])
  })

  it("preserves an existing agents array", () => {
    // Arrange
    const agents = [{ id: "a1", name: "Watchdog" }]
    const character = { agents }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.agents).toEqual(agents)
  })

  it("does not mutate the input character", () => {
    // Arrange
    const original = { agents: [{ id: "a1" }] }
    const snapshot = JSON.parse(JSON.stringify(original)) as typeof original

    // Act
    migration.up(original)

    // Assert
    expect(original).toEqual(snapshot)
  })
})
