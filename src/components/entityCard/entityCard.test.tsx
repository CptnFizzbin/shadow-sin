import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { EntityCard, EntityCardElements } from "./entityCard.tsx"

describe("EntityCard", () => {
  it("renders its Layout regions with content elements inside them", () => {
    render(
      <>
        <EntityCard.Layout.Header>
          <EntityCard.Title title="Ares Predator V" />
        </EntityCard.Layout.Header>
        <EntityCard.Layout.Body>
          <EntityCard.Rating value={4} />
          <EntityCard.Stat label="DV" value="4P" type="damage" />
        </EntityCard.Layout.Body>
        <EntityCard.Layout.Footer>
          <EntityCard.Source source={{ book: "SR4A", page: 427 }} />
        </EntityCard.Layout.Footer>
      </>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("4")).toBeDefined()
    expect(screen.getByText("DV: 4P")).toBeDefined()
    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })

  it("keeps Layout separate from the top-level content elements", () => {
    expect(Object.keys(EntityCard.Layout).sort()).toEqual(["Body", "Footer", "Header"])
    expect("Layout" in EntityCardElements).toBe(false)
  })

  it("exposes the same building blocks flat on EntityCardElements", () => {
    expect(EntityCardElements.Header).toBe(EntityCard.Layout.Header)
    expect(EntityCardElements.Body).toBe(EntityCard.Layout.Body)
    expect(EntityCardElements.Footer).toBe(EntityCard.Layout.Footer)
    expect(EntityCardElements.Title).toBe(EntityCard.Title)
    expect(EntityCardElements.Rating).toBe(EntityCard.Rating)
    expect(EntityCardElements.Source).toBe(EntityCard.Source)
    expect(EntityCardElements.Effects).toBe(EntityCard.Effects)
    expect(EntityCardElements.Stat).toBe(EntityCard.Stat)
    expect(EntityCardElements.Action).toBe(EntityCard.Action)
  })
})
