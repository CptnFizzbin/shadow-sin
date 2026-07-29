import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { ItemCard } from "./itemCard.tsx"

describe("ItemCard", () => {
  it("renders name and type", () => {
    render(
      <ItemCard name="Ares Predator V" type="Heavy Pistol">
        <ItemCard.Stat label="DV" value="8P" type="damage" />
      </ItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("Heavy Pistol")).toBeDefined()
  })

  it("renders equipped/stashed/wireless-off status icons", () => {
    render(
      <ItemCard
        name="Transys Avalon"
        statusIcons={{ equipped: true, stashed: true, wirelessOff: true }}
      >
        <ItemCard.Stat value="Rating 4" />
      </ItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByLabelText("Equipped")).toBeDefined()
    expect(screen.getByLabelText("Stashed")).toBeDefined()
    expect(screen.getByLabelText("Wireless off")).toBeDefined()
  })

  it("renders no status icons when none are set", () => {
    render(
      <ItemCard name="Transys Avalon">
        <ItemCard.Stat value="Rating 4" />
      </ItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.queryByLabelText("Equipped")).toBeNull()
  })

  it("is not tappable without onOpen", () => {
    render(
      <ItemCard name="Ares Predator V">
        <ItemCard.Stat value="8P" />
      </ItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.queryByRole("button", { name: /ares predator v/i })).toBeNull()
  })

  it("navigates to the detail view when tapped", () => {
    const onOpen = vi.fn()
    render(
      <ItemCard name="Ares Predator V" onOpen={onOpen}>
        <ItemCard.Stat value="8P" />
      </ItemCard>,
      { wrapper: ThemeWrapper },
    )

    fireEvent.click(screen.getByRole("button"))

    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("navigates to the detail view via keyboard activation", () => {
    const onOpen = vi.fn()
    render(
      <ItemCard name="Ares Predator V" onOpen={onOpen}>
        <ItemCard.Stat value="8P" />
      </ItemCard>,
      { wrapper: ThemeWrapper },
    )

    const card = screen.getByRole("button")
    fireEvent.keyDown(card, { key: "Enter" })
    fireEvent.keyDown(card, { key: " " })

    expect(onOpen).toHaveBeenCalledTimes(2)
  })

  it("composes stats, source, damage track, subitems, and footer", () => {
    const onDamageChange = vi.fn()
    render(
      <ItemCard name="Bulldog Step-Van">
        <ItemCard.Stat label="Handling" value="3" />
        <ItemCard.Source>Rigger 5.0 p.123</ItemCard.Source>
        <ItemCard.DamageTrack label="Damage" max={12} current={2} onChange={onDamageChange} />
        <ItemCard.Subitem name="GPS Jammer" stats={[{ label: "Rating", value: "4" }]} />
        <ItemCard.Footer>
          <span>1,200¥</span>
        </ItemCard.Footer>
      </ItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Handling: 3")).toBeDefined()
    expect(screen.getByText("Rigger 5.0 p.123")).toBeDefined()
    expect(screen.getByText("Damage 2/12")).toBeDefined()
    expect(screen.getByText("GPS Jammer")).toBeDefined()
    expect(screen.getByText("Rating: 4")).toBeDefined()
    expect(screen.getByText("1,200¥")).toBeDefined()
  })

  it("renders the footer band when only Source is present", () => {
    render(
      <ItemCard name="Ares Predator V">
        <ItemCard.Source>Core p.427</ItemCard.Source>
      </ItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Core p.427")).toBeDefined()
  })

  it("renders the footer band when only Footer is present", () => {
    render(
      <ItemCard name="Ares Predator V">
        <ItemCard.Footer><span>350¥</span></ItemCard.Footer>
      </ItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("350¥")).toBeDefined()
  })

  it("ignores children that are not a recognized slot", () => {
    render(
      <ItemCard name="Ares Predator V">
        <div>unexpected child</div>
      </ItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.queryByText("unexpected child")).toBeNull()
  })
})
