import { describe, expect, it } from "vitest"

import migration from "./025_addMatrixGameState.ts"

describe.concurrent("025_addMatrixGameState", () => {
  it("defaults to an empty Matrix Game State when there is no prior matrix data", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gameState?.matrix).toEqual({ knownNodes: [], activePrograms: [] })
  })

  it("converts existing matrix node data into knownNodes[0] and activeNodeId", () => {
    // Arrange
    const character = {
      matrix: {
        name: "Fairlight Excalibur",
        system: 4,
        firewall: 5,
        response: 3,
        signal: 6,
        numberOfPrograms: 2,
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    const matrixState = result.gameState?.matrix
    expect(matrixState?.knownNodes).toHaveLength(1)
    expect(matrixState?.knownNodes[0]).toMatchObject({
      name: "Fairlight Excalibur",
      matrix: { system: 4, firewall: 5, response: 3, signal: 6 },
      nodeType: "general",
      accessLevel: "public",
    })
    expect(matrixState?.knownNodes[0]).not.toHaveProperty("numberOfPrograms")
    expect(matrixState?.activeNodeId).toBe((matrixState?.knownNodes[0] as { id: string }).id)
    expect(matrixState?.activePrograms).toEqual([])
  })

  it("removes the old flat matrix field", () => {
    // Arrange
    const character = { matrix: { name: "Renraku Tsurugi" } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).not.toHaveProperty("matrix")
  })

  it("backfills missing matrix node fields with defaults", () => {
    // Arrange
    const character = { matrix: { name: "Renraku Tsurugi", system: 3 } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gameState?.matrix?.knownNodes[0]).toMatchObject({
      name: "Renraku Tsurugi",
      matrix: { system: 3, firewall: 0, response: 0, signal: 0 },
    })
  })

  it("does not mutate the input object", () => {
    // Arrange
    const character = { matrix: { name: "Fairlight Excalibur" } }

    // Act
    migration.up(character)

    // Assert
    expect(character).toEqual({ matrix: { name: "Fairlight Excalibur" } })
  })
})
