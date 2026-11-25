import { describe, expect, it } from "vitest"

import { getRunnerStorageKey } from "./builderDraftKey.ts"

describe("getRunnerStorageKey", () => {
  it("returns the fixed builder/new key when no runnerId is given", () => {
    // Arrange & Act
    const key = getRunnerStorageKey()

    // Assert
    expect(key).toBe("builder/new")
  })

  it("returns an editor/<runnerId> key when a runnerId is given", () => {
    // Arrange & Act
    const key = getRunnerStorageKey("abc-123")

    // Assert
    expect(key).toBe("editor/abc-123")
  })
})
