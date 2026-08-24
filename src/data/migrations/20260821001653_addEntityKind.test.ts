import { describe, expect, it } from "vitest"

import migration from "./20260821001653_addEntityKind.ts"

describe.concurrent("026_addEntityKind", () => {
  it("stamps kind: \"runner\" on an otherwise-empty character", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.kind).toBe("runner")
  })

  it("stamps kind: \"item\" on every gear item that already has an itemType", () => {
    // Arrange
    const character = {
      gear: {
        a1: { itemType: "armor" },
        w1: { itemType: "weapon" },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.a1.kind).toBe("item")
    expect(result.gear?.w1.kind).toBe("item")
  })

  it("leaves a gear entry without an itemType unstamped", () => {
    // Arrange
    const character = {
      gear: {
        a1: {},
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.a1.kind).toBeUndefined()
  })

  it("stamps kind: \"spirit\" on every spirit", () => {
    // Arrange
    const character = { spirits: [{}, {}] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spirits?.every((spirit) => spirit.kind === "spirit")).toBe(true)
  })

  it("stamps kind: \"sprite\" on every sprite", () => {
    // Arrange
    const character = { sprites: [{}, {}] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.sprites?.every((sprite) => sprite.kind === "sprite")).toBe(true)
  })

  it("stamps kind: \"matrixNode\" on every known node", () => {
    // Arrange
    const character = { gameState: { matrix: { knownNodes: [{}, {}] } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gameState?.matrix?.knownNodes?.every((node) => node.kind === "matrixNode")).toBe(true)
  })

  it("leaves gameState alone when it has no matrix", () => {
    // Arrange
    const character = { gameState: {} }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gameState).toEqual({})
  })

  it("stamps kind: \"quality\" on every quality", () => {
    // Arrange
    const character = { qualities: [{}, {}] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.every((quality) => quality.kind === "quality")).toBe(true)
  })

  it("stamps kind: \"spell\" on every spell", () => {
    // Arrange
    const character = { spells: [{}, {}] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells?.every((spell) => spell.kind === "spell")).toBe(true)
  })

  it("stamps kind: \"complexForm\" on every complex form", () => {
    // Arrange
    const character = { complexForms: [{}, {}] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.complexForms?.every((complexForm) => complexForm.kind === "complexForm")).toBe(true)
  })

  it("stamps kind: \"adeptPower\" on every power", () => {
    // Arrange
    const character = { powers: [{}, {}] }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.powers?.every((power) => power.kind === "adeptPower")).toBe(true)
  })

  it("does not overwrite an already-stamped kind", () => {
    // Arrange
    const character = {
      kind: "runner",
      gear: { a1: { itemType: "armor", kind: "item" } },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.kind).toBe("runner")
    expect(result.gear?.a1.kind).toBe("item")
  })

  it("stamps kind across every subtree at once, including RunnerData itself", () => {
    // Arrange
    const character = {
      gear: { a1: { itemType: "armor" } },
      spirits: [{}],
      sprites: [{}],
      gameState: { matrix: { knownNodes: [{}] } },
      qualities: [{}],
      spells: [{}],
      complexForms: [{}],
      powers: [{}],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.kind).toBe("runner")
    expect(result.gear?.a1.kind).toBe("item")
    expect(result.spirits?.[0].kind).toBe("spirit")
    expect(result.sprites?.[0].kind).toBe("sprite")
    expect(result.gameState?.matrix?.knownNodes?.[0].kind).toBe("matrixNode")
    expect(result.qualities?.[0].kind).toBe("quality")
    expect(result.spells?.[0].kind).toBe("spell")
    expect(result.complexForms?.[0].kind).toBe("complexForm")
    expect(result.powers?.[0].kind).toBe("adeptPower")
  })
})
