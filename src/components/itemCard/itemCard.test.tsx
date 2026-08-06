import { describe, expect, it } from "vitest"

import { EntityCard } from "#/components/entityCard/entityCard.tsx"

import { ItemCard } from "./itemCard.tsx"
import { ItemCardElements } from "./itemCardElements.tsx"

describe("ItemCard", () => {
  it("exposes EntityCard's content elements", () => {
    // Arrange / Act / Assert
    expect(ItemCard.Title).toBe(EntityCard.Title)
    expect(ItemCard.Rating).toBe(EntityCard.Rating)
    expect(ItemCard.Source).toBe(EntityCard.Source)
    expect(ItemCard.Effects).toBe(EntityCard.Effects)
    expect(ItemCard.Stat).toBe(EntityCard.Stat)
    expect(ItemCard.Action).toBe(EntityCard.Action)
  })

  it("exposes EntityCard's Layout regions", () => {
    // Arrange / Act / Assert
    expect(ItemCard.Layout.HeaderRow).toBe(EntityCard.Layout.HeaderRow)
    expect(ItemCard.Layout.BodyRow).toBe(EntityCard.Layout.BodyRow)
    expect(ItemCard.Layout.FooterRow).toBe(EntityCard.Layout.FooterRow)
  })

  it("exposes its own incremental elements from ItemCardElements", () => {
    // Arrange / Act / Assert
    expect(ItemCard.Availability).toBe(ItemCardElements.Availability)
    expect(ItemCard.Cost).toBe(ItemCardElements.Cost)
    expect(ItemCard.Quantity).toBe(ItemCardElements.Quantity)
    expect(ItemCard.DamageTrack).toBe(ItemCardElements.DamageTrack)
    expect(ItemCard.Subitem).toBe(ItemCardElements.Subitem)
    expect(ItemCard.SubType).toBe(ItemCardElements.SubType)
    expect(ItemCard.StatusIcon).toBe(ItemCardElements.StatusIcon)
  })

  it("only assembles EntityCard's content elements plus its own — no extra keys", () => {
    // Arrange / Act / Assert
    expect(Object.keys(ItemCard).sort()).toEqual([
      "Action", "Availability", "Cost", "DamageTrack", "Effects", "Layout", "Quantity",
      "Rating", "Source", "Stat", "StatusIcon", "SubType", "Subitem", "Title",
    ])
  })
})
