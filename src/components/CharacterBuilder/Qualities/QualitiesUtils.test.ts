import { describe, expect, it } from "vitest"

import { getQualityBpValue } from "#/components/CharacterBuilder/Qualities/QualitiesUtils.ts"

describe("getQualityBpValue", () => {
  it("returns the positive bpValue for a positive quality", () => {
    expect(getQualityBpValue({ bpValue: 5, type: "positive" })).toBe(5)
  })

  it("returns the negated bpValue for a negative quality", () => {
    expect(getQualityBpValue({ bpValue: 10, type: "negative" })).toBe(-10)
  })

  it("returns 0 for a positive quality with no bpValue", () => {
    expect(getQualityBpValue({ type: "positive" })).toBe(0)
  })

  it("returns -0 for a negative quality with no bpValue (JavaScript negation of 0)", () => {
    // -bpValue where bpValue is 0 yields JavaScript's -0
    expect(getQualityBpValue({ type: "negative" })).toBe(-0)
  })

  it("handles a zero bpValue on a positive quality", () => {
    expect(getQualityBpValue({ bpValue: 0, type: "positive" })).toBe(0)
  })

  it("handles a zero bpValue on a negative quality (returns JavaScript -0)", () => {
    // -bpValue where bpValue is 0 yields JavaScript's -0
    expect(getQualityBpValue({ bpValue: 0, type: "negative" })).toBe(-0)
  })
})
