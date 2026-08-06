import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import type { EntityData } from "#/system/entityData.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { EntityCard } from "./entityCard.tsx"
import { EntityCardElements } from "./entityCardElements.tsx"

const entity: EntityData = { id: "00000000-0000-0000-0000-000000000001", name: "Ares Predator V" }

describe("EntityCard", () => {
  it("renders the entity's name, rating, effects, and source automatically, with no extra children", () => {
    render(
      <EntityCard
        entity={{
          ...entity,
          rating: 4,
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.body, value: 2 }],
          source: { book: "SR4A", page: 427 },
        }}
      />,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("4")).toBeDefined()
    expect(screen.getByText("Attribute Modifier → BOD +2")).toBeDefined()
    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })

  it("renders no rating or effects when the entity has none", () => {
    render(<EntityCard entity={entity} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.queryByText(/attribute modifier/i)).toBeNull()
  })

  it("ignores children that are not a Layout region", () => {
    render(
      <EntityCard entity={entity}>
        <div>unexpected child</div>
      </EntityCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.queryByText("unexpected child")).toBeNull()
  })

  it("renders additional HeaderRow children alongside the entity's auto header", () => {
    render(
      <EntityCard entity={entity}>
        <EntityCard.Layout.HeaderRow>
          <EntityCard.Rating value={4} />
        </EntityCard.Layout.HeaderRow>
      </EntityCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("4")).toBeDefined()
  })

  it("renders its Layout regions with content elements inside them", () => {
    render(
      <EntityCard entity={entity}>
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
      <EntityCard entity={entity}>
        <EntityCard.Layout.FooterRow>
          <EntityCard.Source source={{ book: "SR4A", page: 427 }} />
        </EntityCard.Layout.FooterRow>
        <EntityCard.Layout.BodyRow>
          <EntityCard.Rating value={4} />
        </EntityCard.Layout.BodyRow>
      </EntityCard>,
      { wrapper: ThemeWrapper },
    )

    const text = container.textContent ?? ""
    expect(text.indexOf("4")).toBeLessThan(text.indexOf("SR4A p.427"))
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
