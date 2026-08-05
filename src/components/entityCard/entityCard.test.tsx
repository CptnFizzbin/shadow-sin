import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { EntityCard, EntityCardElements } from "./entityCard.tsx"

describe("EntityCard", () => {
  it("renders with no children", () => {
    render(<EntityCard />, { wrapper: ThemeWrapper })
  })

  it("ignores children that are not a Layout region", () => {
    render(
      <EntityCard>
        <EntityCard.Layout.HeaderRow>
          <EntityCard.Title title="Ares Predator V" />
        </EntityCard.Layout.HeaderRow>
        <div>unexpected child</div>
      </EntityCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.queryByText("unexpected child")).toBeNull()
  })

  it("renders its Layout regions with content elements inside them", () => {
    render(
      <EntityCard>
        <EntityCard.Layout.HeaderRow>
          <EntityCard.Title title="Ares Predator V" />
        </EntityCard.Layout.HeaderRow>
        <EntityCard.Layout.BodyRow>
          <EntityCard.Rating value={4} />
          <EntityCard.Stat label="DV" value="4P" type="damage" />
        </EntityCard.Layout.BodyRow>
        <EntityCard.Layout.FooterRow>
          <EntityCard.Source source={{ book: "SR4A", page: 427 }} />
        </EntityCard.Layout.FooterRow>
      </EntityCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("4")).toBeDefined()
    expect(screen.getByText("DV: 4P")).toBeDefined()
    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })

  it("renders Layout regions in canonical HeaderRow/BodyRow/FooterRow order regardless of JSX order", () => {
    const { container } = render(
      <EntityCard>
        <EntityCard.Layout.FooterRow>
          <EntityCard.Source source={{ book: "SR4A", page: 427 }} />
        </EntityCard.Layout.FooterRow>
        <EntityCard.Layout.HeaderRow>
          <EntityCard.Title title="Ares Predator V" />
        </EntityCard.Layout.HeaderRow>
      </EntityCard>,
      { wrapper: ThemeWrapper },
    )

    const text = container.textContent ?? ""
    expect(text.indexOf("Ares Predator V")).toBeLessThan(text.indexOf("SR4A p.427"))
  })

  it("keeps Layout separate from the top-level content elements", () => {
    expect(Object.keys(EntityCard.Layout).sort()).toEqual(["BodyRow", "FooterRow", "HeaderRow"])
    expect("Layout" in EntityCardElements).toBe(false)
  })

  it("excludes Layout regions from EntityCardElements", () => {
    expect(Object.keys(EntityCardElements).sort()).toEqual([
      "Action", "Effects", "Rating", "Source", "Stat", "Title",
    ])
  })

  it("exposes the same content elements flat on EntityCardElements", () => {
    expect(EntityCardElements.Title).toBe(EntityCard.Title)
    expect(EntityCardElements.Rating).toBe(EntityCard.Rating)
    expect(EntityCardElements.Source).toBe(EntityCard.Source)
    expect(EntityCardElements.Effects).toBe(EntityCard.Effects)
    expect(EntityCardElements.Stat).toBe(EntityCard.Stat)
    expect(EntityCardElements.Action).toBe(EntityCard.Action)
  })
})
