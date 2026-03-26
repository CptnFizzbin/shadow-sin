import { describe, expect, it } from "vitest"

import { getProgress } from "#/lib/ProgressUtils.ts"

describe("getProgress", () => {
  it("returns 0 when total is 0 (division guard)", () => {
    expect(getProgress(0, 0)).toBe(0)
  })

  it("returns 0 when current is 0", () => {
    expect(getProgress(0, 100)).toBe(0)
  })

  it("returns 50 for halfway progress", () => {
    expect(getProgress(50, 100)).toBe(50)
  })

  it("returns 100 for complete progress", () => {
    expect(getProgress(100, 100)).toBe(100)
  })

  it("caps at 100 when current exceeds total", () => {
    expect(getProgress(150, 100)).toBe(100)
  })

  it("floors at 0 when current is negative", () => {
    expect(getProgress(-10, 100)).toBe(0)
  })

  it("rounds the percentage to the nearest integer", () => {
    // 1/3 ≈ 33.33 → rounds to 33
    expect(getProgress(1, 3)).toBe(33)
    // 2/3 ≈ 66.67 → rounds to 67
    expect(getProgress(2, 3)).toBe(67)
  })
})
