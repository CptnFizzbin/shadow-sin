import { describe, expect, it } from "vitest"

import { DamageTrackKey } from "./DamageTrackKey.ts"

describe("DamageTrackKey", () => {
  it("has the expected string values", () => {
    expect(DamageTrackKey.physical).toBe("physical")
    expect(DamageTrackKey.stun).toBe("stun")
    expect(DamageTrackKey.matrix).toBe("matrix")
  })

  it("contains exactly 3 members", () => {
    expect(Object.values(DamageTrackKey)).toHaveLength(3)
  })

  it("all values are lowercase strings", () => {
    for (const value of Object.values(DamageTrackKey)) {
      expect(value).toBe(value.toLowerCase())
    }
  })
})