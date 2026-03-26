import { describe, expect, it } from "vitest"

import { createRatingOptions } from "#/components/CharacterBuilder/General/RatingUtils.ts"

describe("createRatingOptions", () => {
  it("creates an option for each integer from min to max (inclusive)", () => {
    const options = createRatingOptions({ min: 1, max: 3 })

    expect(options).toHaveLength(3)
    expect(options[0]).toEqual({ label: "1", value: "1" })
    expect(options[1]).toEqual({ label: "2", value: "2" })
    expect(options[2]).toEqual({ label: "3", value: "3" })
  })

  it("creates a single option when min equals max", () => {
    const options = createRatingOptions({ min: 5, max: 5 })

    expect(options).toHaveLength(1)
    expect(options[0]).toEqual({ label: "5", value: "5" })
  })

  it("returns an empty array when min exceeds max", () => {
    const options = createRatingOptions({ min: 4, max: 2 })

    expect(options).toHaveLength(0)
  })

  it("returns options where label and value are both strings of the integer", () => {
    const options = createRatingOptions({ min: 1, max: 6 })

    for (const option of options) {
      expect(typeof option.label).toBe("string")
      expect(typeof option.value).toBe("string")
      expect(option.label).toBe(option.value)
    }
  })

  it("creates options starting at min = 0 when allowed", () => {
    const options = createRatingOptions({ min: 0, max: 2 })

    expect(options).toHaveLength(3)
    expect(options[0]).toEqual({ label: "0", value: "0" })
  })
})
