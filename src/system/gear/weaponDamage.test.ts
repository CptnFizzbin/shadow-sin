import { describe, expect, it } from "vitest"

import { applyNetHitsToDamage, parseDamageValue } from "./weaponDamage.ts"

describe("parseDamageValue", () => {
  it("splits a simple damage string into base and suffix", () => {
    // Arrange / Act
    const result = parseDamageValue("4P")

    // Assert
    expect(result).toEqual({ base: 4, suffix: "P" })
  })

  it("keeps notation like (e) as part of the suffix", () => {
    // Arrange / Act
    const result = parseDamageValue("10P(e)")

    // Assert
    expect(result).toEqual({ base: 10, suffix: "P(e)" })
  })

  it("returns null when there is no leading number", () => {
    // Arrange / Act
    const result = parseDamageValue("Special")

    // Assert
    expect(result).toBeNull()
  })
})

describe("applyNetHitsToDamage", () => {
  it("adds positive net hits to the base damage", () => {
    // Arrange / Act
    const result = applyNetHitsToDamage("4P", 2)

    // Assert
    expect(result).toBe("6P")
  })

  it("floors the result at zero for large negative net hits", () => {
    // Arrange / Act
    const result = applyNetHitsToDamage("4P", -10)

    // Assert
    expect(result).toBe("0P")
  })

  it("returns the original string unchanged when unparseable", () => {
    // Arrange / Act
    const result = applyNetHitsToDamage("Special", 3)

    // Assert
    expect(result).toBe("Special")
  })
})
