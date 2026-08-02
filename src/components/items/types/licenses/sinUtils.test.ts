import { describe, expect, it } from "vitest"

import { SinNameList } from "#/system/gear/sinNameList.ts"

import { getRandomSinName } from "./sinUtils.ts"

describe("getRandomSinName", () => {
  it("returns a name from SinNameList", () => {
    // Act
    const name = getRandomSinName()

    // Assert
    expect(SinNameList).toContain(name)
  })

  it("can return different names across calls", () => {
    // Act
    const names = new Set(Array.from({ length: 50 }, () => getRandomSinName()))

    // Assert
    expect(names.size).toBeGreaterThan(1)
  })
})
