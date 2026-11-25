import { describe, expect, it } from "vitest"

import { keepHighestPerTag } from "./effectTagStacking.ts"

interface Entry {
  name: string
  value: number
  tags?: string[]
  target?: string
}

const stack = (entries: Entry[], byTarget = false) => keepHighestPerTag(entries, {
  getTags: (entry) => entry.tags,
  getValue: (entry) => entry.value,
  getGroupKey: byTarget ? (entry) => entry.target ?? "" : undefined,
}).map((entry) => entry.name)

describe.concurrent("keepHighestPerTag", () => {
  it("keeps only the highest of the entries sharing a tag, and every untagged entry", () => {
    // Arrange
    const entries = [
      { name: "low focus", value: 2, tags: ["focus"] },
      { name: "untagged", value: 1 },
      { name: "high focus", value: 5, tags: ["focus"] },
    ]

    // Act / Assert
    expect(stack(entries)).toEqual(["untagged", "high focus"])
  })

  it("keeps the first of tied entries", () => {
    // Arrange
    const entries = [{ name: "first", value: 3, tags: ["focus"] }, { name: "second", value: 3, tags: ["focus"] }]

    // Act / Assert
    expect(stack(entries)).toEqual(["first"])
  })

  it("drops an entry with several tags when a higher one holds any of them, freeing its other tags", () => {
    // Arrange
    const entries = [
      { name: "both", value: 3, tags: ["focus", "magic"] },
      { name: "bigger magic", value: 4, tags: ["magic"] },
      { name: "smaller focus", value: 1, tags: ["focus"] },
    ]

    // Act / Assert
    expect(stack(entries)).toEqual(["bigger magic", "smaller focus"])
  })

  it("only compares entries within the same group", () => {
    // Arrange
    const entries = [
      { name: "agility", value: 2, tags: ["drug"], target: "agility" },
      { name: "reaction", value: 1, tags: ["drug"], target: "reaction" },
    ]

    // Act / Assert
    expect(stack(entries, true)).toEqual(["agility", "reaction"])
  })
})
