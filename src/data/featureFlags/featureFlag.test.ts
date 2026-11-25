import { describe, expect, it } from "vitest"

import { createFlagRegistry } from "./featureFlag.ts"

describe.concurrent("createFlagRegistry", () => {
  it("prefixes each flag's ref with the namespace", () => {
    // Arrange
    const flags = { "area.feature.toggle": { name: "Toggle", default: false } }

    // Act
    const registry = createFlagRegistry("testRules", flags)

    // Assert
    expect(registry["area.feature.toggle"].ref).toBe("testRules.area.feature.toggle")
  })

  it("keeps every field of the flag definition", () => {
    // Arrange
    const flags = {
      mode: {
        name: "Mode",
        description: "Picks a mode.",
        source: { book: "SR4A", page: 1 },
        default: "fast",
        options: [{ value: "fast", label: "Fast" }, { value: "slow", label: "Slow" }],
      },
    }

    // Act
    const registry = createFlagRegistry("testRules", flags)

    // Assert
    expect(registry.mode).toEqual({ ...flags.mode, ref: "testRules.mode" })
  })
})
