import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { BasicItemCard } from "./basicItemCard.tsx"
import { ItemCardSlot } from "./itemCardSlot.tsx"

describe("BasicItemCard", () => {
  it("renders name and type", () => {
    render(
      <BasicItemCard name="Ares Predator V" type="Heavy Pistol">
        <ItemCardSlot.Stat label="DV" value="8P" type="damage" />
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("Heavy Pistol")).toBeDefined()
  })

  it("renders equipped/stashed/wireless-off status icons", () => {
    render(
      <BasicItemCard
        name="Transys Avalon"
        statusIcons={{ equipped: true, stashed: true, wirelessOff: true }}
      >
        <ItemCardSlot.Stat value="Rating 4" />
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByLabelText("Equipped")).toBeDefined()
    expect(screen.getByLabelText("Stashed")).toBeDefined()
    expect(screen.getByLabelText("Wireless off")).toBeDefined()
  })

  it("renders no status icons when none are set", () => {
    render(
      <BasicItemCard name="Transys Avalon">
        <ItemCardSlot.Stat value="Rating 4" />
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.queryByLabelText("Equipped")).toBeNull()
  })

  it("is not tappable without onOpen", () => {
    render(
      <BasicItemCard name="Ares Predator V">
        <ItemCardSlot.Stat value="8P" />
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.queryByRole("button", { name: /ares predator v/i })).toBeNull()
  })

  it("navigates to the detail view when tapped", () => {
    const onOpen = vi.fn()
    render(
      <BasicItemCard name="Ares Predator V" onOpen={onOpen}>
        <ItemCardSlot.Stat value="8P" />
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    fireEvent.click(screen.getByRole("button"))

    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("navigates to the detail view via keyboard activation", () => {
    const onOpen = vi.fn()
    render(
      <BasicItemCard name="Ares Predator V" onOpen={onOpen}>
        <ItemCardSlot.Stat value="8P" />
      </BasicItemCard>,
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
      <BasicItemCard name="Bulldog Step-Van">
        <ItemCardSlot.Stat label="Handling" value="3" />
        <ItemCardSlot.Source source={{ book: "SR4A", page: 427 }} />
        <ItemCardSlot.DamageTrack label="Damage" max={12} current={2} onChange={onDamageChange} />
        <ItemCardSlot.Subitem name="GPS Jammer" stats={[{ label: "Rating", value: "4" }]} />
        <ItemCardSlot.Footer>
          <span>1,200¥</span>
        </ItemCardSlot.Footer>
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Handling: 3")).toBeDefined()
    expect(screen.getByText("SR4A p.427")).toBeDefined()
    expect(screen.getByText("Damage 2/12")).toBeDefined()
    expect(screen.getByText("GPS Jammer")).toBeDefined()
    expect(screen.getByText("Rating: 4")).toBeDefined()
    expect(screen.getByText("1,200¥")).toBeDefined()
  })

  it("renders the footer band when only Source is present", () => {
    render(
      <BasicItemCard name="Ares Predator V">
        <ItemCardSlot.Source source={{ book: "SR4A", page: 427 }} />
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })

  it("renders the footer band when only Footer is present", () => {
    render(
      <BasicItemCard name="Ares Predator V">
        <ItemCardSlot.Footer><span>350¥</span></ItemCardSlot.Footer>
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("350¥")).toBeDefined()
  })

  it("renders with no children", () => {
    render(<BasicItemCard name="Ares Predator V" />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
  })

  it("ignores children that are not a recognized slot", () => {
    render(
      <BasicItemCard name="Ares Predator V">
        <div>unexpected child</div>
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.queryByText("unexpected child")).toBeNull()
  })

  describe("quick action context menu", () => {
    it("does not open a menu on right-click when there are no quick actions", () => {
      render(
        <BasicItemCard name="Ares Predator V">
          <ItemCardSlot.Stat value="8P" />
        </BasicItemCard>,
        { wrapper: ThemeWrapper },
      )

      fireEvent.contextMenu(screen.getByText("Ares Predator V"))

      expect(screen.queryByRole("menu")).toBeNull()
    })

    it("opens a context menu of quick actions on right-click", () => {
      const onEquip = vi.fn()
      render(
        <BasicItemCard name="Ares Predator V">
          <ItemCardSlot.QuickAction label="Equip" onClick={onEquip} />
        </BasicItemCard>,
        { wrapper: ThemeWrapper },
      )

      fireEvent.contextMenu(screen.getByText("Ares Predator V"))

      expect(screen.getByRole("menu")).toBeDefined()
      expect(screen.getByRole("menuitem", { name: "Equip" })).toBeDefined()
    })

    it("invokes the action and closes the menu when a quick action is clicked", () => {
      const onEquip = vi.fn()
      render(
        <BasicItemCard name="Ares Predator V">
          <ItemCardSlot.QuickAction label="Equip" onClick={onEquip} />
        </BasicItemCard>,
        { wrapper: ThemeWrapper },
      )

      fireEvent.contextMenu(screen.getByText("Ares Predator V"))
      fireEvent.click(screen.getByRole("menuitem", { name: "Equip" }))

      expect(onEquip).toHaveBeenCalledOnce()
      expect(screen.queryByRole("menu")).toBeNull()
    })

    it("does not trigger onOpen when right-clicking to open the menu", () => {
      const onOpen = vi.fn()
      render(
        <BasicItemCard name="Ares Predator V" onOpen={onOpen}>
          <ItemCardSlot.QuickAction label="Equip" onClick={vi.fn()} />
        </BasicItemCard>,
        { wrapper: ThemeWrapper },
      )

      fireEvent.contextMenu(screen.getByRole("button"))

      expect(onOpen).not.toHaveBeenCalled()
    })

    describe("long-press on touch devices", () => {
      beforeEach(() => vi.useFakeTimers())
      afterEach(() => vi.useRealTimers())

      it("opens the menu after holding for the long-press duration", () => {
        render(
          <BasicItemCard name="Ares Predator V">
            <ItemCardSlot.QuickAction label="Equip" onClick={vi.fn()} />
          </BasicItemCard>,
          { wrapper: ThemeWrapper },
        )

        const card = screen.getByText("Ares Predator V")
        fireEvent.touchStart(card, { touches: [{ clientX: 10, clientY: 10 }] })
        act(() => vi.advanceTimersByTime(500))

        expect(screen.getByRole("menu")).toBeDefined()
      })

      it("does not open the menu for a short tap", () => {
        const onOpen = vi.fn()
        render(
          <BasicItemCard name="Ares Predator V" onOpen={onOpen}>
            <ItemCardSlot.QuickAction label="Equip" onClick={vi.fn()} />
          </BasicItemCard>,
          { wrapper: ThemeWrapper },
        )

        const card = screen.getByRole("button")
        fireEvent.touchStart(card, { touches: [{ clientX: 10, clientY: 10 }] })
        fireEvent.touchEnd(card)
        fireEvent.click(card)

        expect(screen.queryByRole("menu")).toBeNull()
        expect(onOpen).toHaveBeenCalledOnce()
      })

      it("cancels the long-press when the touch moves beyond the tolerance", () => {
        render(
          <BasicItemCard name="Ares Predator V">
            <ItemCardSlot.QuickAction label="Equip" onClick={vi.fn()} />
          </BasicItemCard>,
          { wrapper: ThemeWrapper },
        )

        const card = screen.getByText("Ares Predator V")
        fireEvent.touchStart(card, { touches: [{ clientX: 10, clientY: 10 }] })
        fireEvent.touchMove(card, { touches: [{ clientX: 40, clientY: 40 }] })
        act(() => vi.advanceTimersByTime(500))

        expect(screen.queryByRole("menu")).toBeNull()
      })

      it("suppresses the trailing click's onOpen after a long-press opens the menu", () => {
        const onOpen = vi.fn()
        render(
          <BasicItemCard name="Ares Predator V" onOpen={onOpen}>
            <ItemCardSlot.QuickAction label="Equip" onClick={vi.fn()} />
          </BasicItemCard>,
          { wrapper: ThemeWrapper },
        )

        const card = screen.getByRole("button")
        fireEvent.touchStart(card, { touches: [{ clientX: 10, clientY: 10 }] })
        act(() => vi.advanceTimersByTime(500))
        fireEvent.touchEnd(card)
        fireEvent.click(card)

        expect(onOpen).not.toHaveBeenCalled()
      })
    })
  })
})
