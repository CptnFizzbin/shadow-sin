import { describe, expect, it } from "vitest"

import migration from "./20261030_00_repairAgentStats.ts"

describe.concurrent("repairAgentStats", () => {
  it("adds attributes and a Matrix damage track to an Agent missing them", () => {
    // Arrange
    const character = { _data_: { items: { agent: { itemType: "program", programType: "agent", rating: 3 } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.agent).toEqual({
      itemType: "program",
      programType: "agent",
      rating: 3,
      attributes: {},
      damage: { matrix: 0 },
    })
  })

  it("keeps an Agent's existing attributes and damage", () => {
    // Arrange
    const agent = { itemType: "program", programType: "agent", attributes: { system: 4 }, damage: { matrix: 2 } }
    const character = { _data_: { items: { agent } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.agent).toEqual(agent)
  })

  it("leaves other Programs untouched", () => {
    // Arrange
    const browse = { itemType: "program", programType: "browse" }
    const character = { _data_: { items: { browse } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.browse).toEqual(browse)
  })
})
