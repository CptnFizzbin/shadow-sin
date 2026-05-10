import { describe, expect, it } from "vitest"

import { resolveAlias } from "./resolveAlias.ts"

describe("resolveAlias", () => {
  it("returns 'Artemis 2' when 'Artemis' does not conflict", () => {
    // Arrange
    const existingAliases = new Set<string>(["Artemis"])

    // Act
    const result = resolveAlias("Artemis", existingAliases)

    // Assert
    expect(result).toBe("Artemis 2")
  })

  it("increments past existing suffixed aliases", () => {
    // Arrange
    const existingAliases = new Set(["Artemis", "Artemis 2", "Artemis 3"])

    // Act
    const result = resolveAlias("Artemis", existingAliases)

    // Assert
    expect(result).toBe("Artemis 4")
  })

  it("returns suffix 2 for a name with no conflicts", () => {
    // Arrange
    const existingAliases = new Set<string>([])

    // Act
    const result = resolveAlias("Runner", existingAliases)

    // Assert
    expect(result).toBe("Runner 2")
  })

  it("is not affected by the base alias being absent from existing", () => {
    // Arrange — "Ghost" itself is not in the set; only "Ghost 2" is
    const existingAliases = new Set(["Ghost 2"])

    // Act
    const result = resolveAlias("Ghost", existingAliases)

    // Assert
    expect(result).toBe("Ghost 3")
  })

  it("skips large gaps to find a free slot", () => {
    // Arrange — 2-5 are taken, so 6 should be returned
    const existingAliases = new Set(["Blade 2", "Blade 3", "Blade 4", "Blade 5"])

    // Act
    const result = resolveAlias("Blade", existingAliases)

    // Assert
    expect(result).toBe("Blade 6")
  })
})
