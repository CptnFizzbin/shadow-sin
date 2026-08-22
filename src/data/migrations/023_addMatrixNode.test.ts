import { describe, expect, it } from "vitest"

import migration from "./023_addMatrixNode.ts"

describe.concurrent("023_addMatrixNode", () => {
  it("defaults all matrix node fields when matrix is absent", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.matrix).toEqual({
      name: "",
      system: 0,
      firewall: 0,
      response: 0,
      signal: 0,
      numberOfPrograms: 0,
    })
  })

  it("preserves existing matrix node fields without overwriting them", () => {
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
    expect(result.matrix).toEqual({
      name: "Fairlight Excalibur",
      system: 4,
      firewall: 5,
      response: 3,
      signal: 6,
      numberOfPrograms: 2,
    })
  })

  it("backfills only the missing fields on a partially migrated matrix", () => {
    // Arrange
    const character = { matrix: { name: "Renraku Tsurugi", system: 3 } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.matrix).toEqual({
      name: "Renraku Tsurugi",
      system: 3,
      firewall: 0,
      response: 0,
      signal: 0,
      numberOfPrograms: 0,
    })
  })

  it("does not mutate the input object", () => {
    // Arrange
    const character = {}

    // Act
    migration.up(character)

    // Assert
    expect(character).toEqual({})
  })
})
