import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Icons } from "#/lib/icons.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { DataCard } from "./dataCard.tsx"

describe("DataCard", () => {
  it("renders title and type", () => {
    render(
      <DataCard>
        <DataCard.Type label="Heavy Pistol" />
        <DataCard.Title title="Ares Predator V" />
        <DataCard.Stat label="DV" value="8P" type="damage" />
      </DataCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("Heavy Pistol")).toBeDefined()
  })

  it("renders status icons", () => {
    render(
      <DataCard>
        <DataCard.Title title="Ares Predator V" />
        <DataCard.StatusIcon icon={Icons.item.equipped} label="Equipped" />
        <DataCard.StatusIcon icon={Icons.item.wireless.disabled} label="Wireless off" />
      </DataCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByLabelText("Equipped")).toBeDefined()
    expect(screen.getByLabelText("Wireless off")).toBeDefined()
  })

  it("renders no status icons when none are given", () => {
    render(
      <DataCard>
        <DataCard.Title title="Ares Predator V" />
      </DataCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.queryByLabelText("Equipped")).toBeNull()
    expect(screen.queryByLabelText("Wireless off")).toBeNull()
  })

  it("is not tappable without onOpen", () => {
    render(
      <DataCard>
        <DataCard.Title title="Ares Predator V" />
      </DataCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.queryByRole("button", { name: /ares predator v/i })).toBeNull()
  })

  it("navigates to the detail view when tapped", () => {
    const onOpen = vi.fn()
    render(
      <DataCard onOpen={onOpen}>
        <DataCard.Title title="Ares Predator V" />
      </DataCard>,
      { wrapper: ThemeWrapper },
    )

    fireEvent.click(screen.getByRole("button"))

    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("navigates to the detail view via keyboard activation", () => {
    const onOpen = vi.fn()
    render(
      <DataCard onOpen={onOpen}>
        <DataCard.Title title="Ares Predator V" />
      </DataCard>,
      { wrapper: ThemeWrapper },
    )

    const card = screen.getByRole("button")
    fireEvent.keyDown(card, { key: "Enter" })
    fireEvent.keyDown(card, { key: " " })

    expect(onOpen).toHaveBeenCalledTimes(2)
  })

  it("composes stats, source, availability, cost, damage track, subitems, and footer", () => {
    const onDamageChange = vi.fn()

    render(
      <DataCard>
        <DataCard.Title title="Bulldog Step-Van" />
        <DataCard.Source source={{ book: "SR4A", page: 427 }} />
        <DataCard.Availability value={{ rating: 8, restricted: true }} />
        <DataCard.Cost value={1200} />
        <DataCard.Stat label="Handling" value="3" />
        <DataCard.DamageTrack label="Damage" max={12} current={2} onChange={onDamageChange} />
        <DataCard.Subitem name="GPS Jammer" stats={[{ label: "Rating", value: "4" }]} />
        <DataCard.Footer>
          <span>extra footer content</span>
        </DataCard.Footer>
      </DataCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Handling: 3")).toBeDefined()
    expect(screen.getByText("SR4A p.427")).toBeDefined()
    expect(screen.getByText("Avail: 8R")).toBeDefined()
    expect(screen.getByText("1,200¥")).toBeDefined()
    expect(screen.getByText("Damage 2/12")).toBeDefined()
    expect(screen.getByText("GPS Jammer")).toBeDefined()
    expect(screen.getByText("Rating: 4")).toBeDefined()
    expect(screen.getByText("extra footer content")).toBeDefined()
  })

  it("renders the footer band when only Source is present", () => {
    render(
      <DataCard>
        <DataCard.Title title="Ares Predator V" />
        <DataCard.Source source={{ book: "SR4A", page: 427 }} />
      </DataCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })

  it("renders the footer band when only Footer is present", () => {
    render(
      <DataCard>
        <DataCard.Title title="Ares Predator V" />
        <DataCard.Footer><span>350¥</span></DataCard.Footer>
      </DataCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("350¥")).toBeDefined()
  })

  it("renders a Content block below the main body", () => {
    render(
      <DataCard>
        <DataCard.Title title="Ares Predator V" />
        <DataCard.Content>
          <span>extra content</span>
        </DataCard.Content>
      </DataCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("extra content")).toBeDefined()
  })

  it("renders with no children", () => {
    render(<DataCard />, { wrapper: ThemeWrapper })
  })

  it("ignores children that are not a recognized slot", () => {
    render(
      <DataCard>
        <DataCard.Title title="Ares Predator V" />
        <div>unexpected child</div>
      </DataCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.queryByText("unexpected child")).toBeNull()
  })

  describe("quick action context menu", () => {
    it("does not open a menu on right-click when there are no quick actions", () => {
      render(
        <DataCard>
          <DataCard.Title title="Ares Predator V" />
        </DataCard>,
        { wrapper: ThemeWrapper },
      )

      fireEvent.contextMenu(screen.getByText("Ares Predator V"))

      expect(screen.queryByRole("menu")).toBeNull()
    })

    it("opens a context menu of quick actions on right-click", () => {
      const onEquip = vi.fn()
      render(
        <DataCard>
          <DataCard.Title title="Ares Predator V" />
          <DataCard.QuickAction label="Equip" onClick={onEquip} />
        </DataCard>,
        { wrapper: ThemeWrapper },
      )

      fireEvent.contextMenu(screen.getByText("Ares Predator V"))

      expect(screen.getByRole("menu")).toBeDefined()
      expect(screen.getByRole("menuitem", { name: "Equip" })).toBeDefined()
    })

    it("invokes the action and closes the menu when a quick action is clicked", () => {
      const onEquip = vi.fn()
      render(
        <DataCard>
          <DataCard.Title title="Ares Predator V" />
          <DataCard.QuickAction label="Equip" onClick={onEquip} />
        </DataCard>,
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
        <DataCard onOpen={onOpen} onEdit={vi.fn()}>
          <DataCard.Title title="Ares Predator V" />
          <DataCard.QuickAction label="Equip" onClick={vi.fn()} />
        </DataCard>,
        { wrapper: ThemeWrapper },
      )

      fireEvent.contextMenu(screen.getByRole("button"))

      expect(onOpen).not.toHaveBeenCalled()
    })

    it("adds an Edit quick action that calls onEdit (not onOpen) and closes the menu", () => {
      const onOpen = vi.fn()
      const onEdit = vi.fn()
      render(
        <DataCard onOpen={onOpen} onEdit={onEdit}>
          <DataCard.Title title="Ares Predator V" />
        </DataCard>,
        { wrapper: ThemeWrapper },
      )

      fireEvent.contextMenu(screen.getByRole("button"))
      fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))

      expect(onEdit).toHaveBeenCalledOnce()
      expect(onOpen).not.toHaveBeenCalled()
      expect(screen.queryByRole("menu")).toBeNull()
    })

    it("does not show an Edit quick action without onEdit", () => {
      render(
        <DataCard onOpen={vi.fn()} onRemove={vi.fn()}>
          <DataCard.Title title="Ares Predator V" />
        </DataCard>,
        { wrapper: ThemeWrapper },
      )

      fireEvent.contextMenu(screen.getByRole("button"))

      expect(screen.queryByRole("menuitem", { name: "Edit" })).toBeNull()
    })

    it("adds a Remove quick action that calls onRemove and closes the menu", () => {
      const onRemove = vi.fn()
      render(
        <DataCard onRemove={onRemove}>
          <DataCard.Title title="Ares Predator V" />
        </DataCard>,
        { wrapper: ThemeWrapper },
      )

      fireEvent.contextMenu(screen.getByText("Ares Predator V"))
      fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

      expect(onRemove).toHaveBeenCalledOnce()
      expect(screen.queryByRole("menu")).toBeNull()
    })

    it("separates type-specific quick actions from Edit/Remove with a divider", () => {
      render(
        <DataCard onEdit={vi.fn()} onRemove={vi.fn()}>
          <DataCard.Title title="Ares Predator V" />
          <DataCard.QuickAction label="Equip" onClick={vi.fn()} />
        </DataCard>,
        { wrapper: ThemeWrapper },
      )

      fireEvent.contextMenu(screen.getByText("Ares Predator V"))

      expect(screen.getByRole("menuitem", { name: "Equip" })).toBeDefined()
      expect(screen.getByRole("menuitem", { name: "Edit" })).toBeDefined()
      expect(screen.getByRole("menuitem", { name: "Remove" })).toBeDefined()
      expect(screen.getByRole("separator")).toBeDefined()
    })

    describe("long-press on touch devices", () => {
      beforeEach(() => vi.useFakeTimers())
      afterEach(() => vi.useRealTimers())

      it("opens the menu after holding for the long-press duration", () => {
        render(
          <DataCard>
            <DataCard.Title title="Ares Predator V" />
            <DataCard.QuickAction label="Equip" onClick={vi.fn()} />
          </DataCard>,
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
          <DataCard onOpen={onOpen}>
            <DataCard.Title title="Ares Predator V" />
            <DataCard.QuickAction label="Equip" onClick={vi.fn()} />
          </DataCard>,
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
          <DataCard>
            <DataCard.Title title="Ares Predator V" />
            <DataCard.QuickAction label="Equip" onClick={vi.fn()} />
          </DataCard>,
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
          <DataCard onOpen={onOpen}>
            <DataCard.Title title="Ares Predator V" />
            <DataCard.QuickAction label="Equip" onClick={vi.fn()} />
          </DataCard>,
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
