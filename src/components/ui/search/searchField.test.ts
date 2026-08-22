import { describe, expect, it } from "vitest"

import { filterBySearch } from "./searchField.tsx"

describe.concurrent("filterBySearch", () => {
  type Item = { name: string, tags: string[] }

  const rows: Item[] = [
    { name: "Arcane Armor", tags: ["gear", "magic"] },
    { name: "Street Samurai", tags: ["combat"] },
  ]

  const getSearchTexts = (item: Item) => [item.name, ...item.tags]

  it("supports AND matching when matchAll is true", () => {
    const predicate = filterBySearch(getSearchTexts, ["arcane", "gear"])

    expect(rows.filter(predicate)).toEqual([rows[0]])
  })

  it("returns false for every row when no search terms are provided", () => {
    const predicate = filterBySearch(getSearchTexts, [])

    expect(rows.filter(predicate)).toEqual([])
  })
})
