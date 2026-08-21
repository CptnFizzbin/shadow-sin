import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type { EntityData } from "#/system/entityData.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { EntityCard } from "./entityCard.tsx"
import { EntityCardElements } from "./entityCardElements.tsx"

const entity: EntityData = { kind: EntityKind.item, id: "00000000-0000-0000-0000-000000000001", name: "Ares Predator V" }

describe("EntityCard", () => {
  it("renders the entity's name, rating, and source automatically, with no extra children", () => {
    render(
      <EntityCard
        entity={{
          ...entity,
          rating: 4,
          source: { book: "SR4A", page: 427 },
        }}
      />,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("Rating: 4")).toBeDefined()
    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })

  it("renders no rating when the entity has none", () => {
    render(<EntityCard entity={entity} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.queryByText(/rating/i)).toBeNull()
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
    expect(screen.getByText("Rating: 4")).toBeDefined()
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
    expect(screen.getByText("Rating: 4")).toBeDefined()
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
    expect(Object.keys(EntityCard.Layout).sort()).toEqual([
      "BodyRow", "FooterLeft", "FooterRight", "FooterRow", "HeaderRow", "TitleRight", "TopRight",
    ])
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

  it("renders no actions menu button when neither onEdit nor onRemove is provided", () => {
    render(<EntityCard entity={entity} />, { wrapper: ThemeWrapper })

    expect(screen.queryByRole("button", { name: "Actions menu" })).toBeNull()
  })

  it("opens a menu with Edit and Remove items from the actions menu button, without triggering onOpen", () => {
    const onOpen = vi.fn()
    const onEdit = vi.fn()
    const onRemove = vi.fn()
    render(
      <EntityCard entity={entity} onOpen={onOpen} onEdit={onEdit} onRemove={onRemove} />,
      { wrapper: ThemeWrapper },
    )

    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))

    expect(screen.getByText("Edit")).toBeDefined()
    expect(screen.getByText("Remove")).toBeDefined()
    expect(onOpen).not.toHaveBeenCalled()
  })

  it("fires onEdit and closes the menu when the Edit item is clicked", () => {
    const onEdit = vi.fn()
    render(<EntityCard entity={entity} onEdit={onEdit} />, { wrapper: ThemeWrapper })

    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByText("Edit"))

    expect(onEdit).toHaveBeenCalledOnce()
  })

  it("fires onRemove when the Remove item is clicked", () => {
    const onRemove = vi.fn()
    render(<EntityCard entity={entity} onRemove={onRemove} />, { wrapper: ThemeWrapper })

    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByText("Remove"))

    expect(onRemove).toHaveBeenCalledOnce()
  })

  it("renders a leftAction button and fires its onClick without triggering onOpen", () => {
    const onOpen = vi.fn()
    const onLeftAction = vi.fn()
    render(
      <EntityCard
        entity={entity}
        onOpen={onOpen}
        leftAction={{ icon: <span>icon</span>, onClick: onLeftAction }}
      />,
      { wrapper: ThemeWrapper },
    )

    fireEvent.click(screen.getByRole("button", { name: "Action" }))

    expect(onLeftAction).toHaveBeenCalledOnce()
    expect(onOpen).not.toHaveBeenCalled()
  })

  it("renders no leftAction button when leftAction is not provided", () => {
    render(<EntityCard entity={entity} />, { wrapper: ThemeWrapper })

    expect(screen.queryByRole("button", { name: "Action" })).toBeNull()
  })
})
