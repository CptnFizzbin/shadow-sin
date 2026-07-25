import { describe, expect, it } from "vitest"

import { ArrayUtils } from "./arrayUtils.ts"

describe("shuffle", () => {
  it("returns an array with the same elements", () => {
    const result = ArrayUtils.shuffle([1, 2, 3, 4, 5])
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5])
  })

  it("does not mutate the input array", () => {
    const input = [1, 2, 3]
    ArrayUtils.shuffle(input)
    expect(input).toEqual([1, 2, 3])
  })

  it("returns an empty array for an empty input", () => {
    expect(ArrayUtils.shuffle([])).toEqual([])
  })
})
