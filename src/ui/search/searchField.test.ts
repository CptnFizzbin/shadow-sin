import { describe, expect, it } from "vitest"

import { filterBySearch } from "./searchField.tsx"

describe.concurrent("filterBySearch", () => {
  type Item = { name: string, tags: string[] }

  const rows: Item[] = [
    { name: "Arcane Armor", tags: ["gear", "magic"] },
    { name: "Street Samurai", tags: ["combat"] },
  ]

  const getSearchTexts = (item: Item) => [item.name, ...item.tags]

  it("requires every search term to match", () => {
    // Arrange
    const termsSplitAcrossRows = ["arcane", "combat"]
    const termsWithinOneRow = ["ARCANE", "magic"]

    // Act
    const splitMatches = rows.filter(filterBySearch(getSearchTexts, termsSplitAcrossRows))
    const withinOneRowMatches = rows.filter(filterBySearch(getSearchTexts, termsWithinOneRow))

    // Assert
    expect(splitMatches).toEqual([])
    expect(withinOneRowMatches).toEqual([rows[0]])
  })

  it("returns false for every row when no search terms are provided", () => {
    const predicate = filterBySearch(getSearchTexts, [])

    expect(rows.filter(predicate)).toEqual([])
  })
})
