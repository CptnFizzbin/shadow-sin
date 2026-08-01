import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { BasicItemCard } from "./basicItemCard.tsx"
import { ItemCardSlot } from "./itemCardSlot.tsx"

const baseItem: ItemData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Ares Predator V",
  itemType: ItemType.other,
}

describe("BasicItemCard", () => {
  it("renders name and type", () => {
    render(
      <BasicItemCard item={baseItem} type="Heavy Pistol">
        <ItemCardSlot.Stat label="DV" value="8P" type="damage" />
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Ares Predator V")).toBeDefined()
    expect(screen.getByText("Heavy Pistol")).toBeDefined()
  })

  it("renders equipped and wireless-off status icons from the item", () => {
    render(
      <BasicItemCard item={{ ...baseItem, equipped: true, wireless: { enabled: false } }}>
        <ItemCardSlot.Stat value="Rating 4" />
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByLabelText("Equipped")).toBeDefined()
    expect(screen.getByLabelText("Wireless off")).toBeDefined()
  })

  it("renders no status icons when the item has none set", () => {
    render(
      <BasicItemCard item={baseItem}>
        <ItemCardSlot.Stat value="Rating 4" />
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.queryByLabelText("Equipped")).toBeNull()
    expect(screen.queryByLabelText("Wireless off")).toBeNull()
  })

  it("is not tappable without onOpen", () => {
    render(
      <BasicItemCard item={baseItem}>
        <ItemCardSlot.Stat value="8P" />
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.queryByRole("button", { name: /ares predator v/i })).toBeNull()
  })

  it("navigates to the detail view when tapped", () => {
    const onOpen = vi.fn()
    render(
      <BasicItemCard item={baseItem} onOpen={onOpen}>
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
      <BasicItemCard item={baseItem} onOpen={onOpen}>
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
    const item: ItemData = {
      ...baseItem,
      name: "Bulldog Step-Van",
      source: { book: "SR4A", page: 427 },
    }

    render(
      <BasicItemCard item={item}>
        <ItemCardSlot.Stat label="Handling" value="3" />
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

  it("renders the footer band when the item has a source", () => {
    render(
      <BasicItemCard item={{ ...baseItem, source: { book: "SR4A", page: 427 } }} />,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })

  it("renders the footer band when only Footer is present", () => {
    render(
      <BasicItemCard item={baseItem}>
        <ItemCardSlot.Footer><span>350¥</span></ItemCardSlot.Footer>
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("350¥")).toBeDefined()
  })

  it("renders with no children", () => {
    render(<BasicItemCard item={baseItem} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
  })

  it("ignores children that are not a recognized slot", () => {
    render(
      <BasicItemCard item={baseItem}>
        <div>unexpected child</div>
      </BasicItemCard>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.queryByText("unexpected child")).toBeNull()
  })

  describe("quick action context menu", () => {
    it("does not open a menu on right-click when there are no quick actions", () => {
      render(
        <BasicItemCard item={baseItem}>
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
        <BasicItemCard item={baseItem}>
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
        <BasicItemCard item={baseItem}>
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
        <BasicItemCard item={baseItem} onOpen={onOpen} onEdit={vi.fn()}>
          <ItemCardSlot.QuickAction label="Equip" onClick={vi.fn()} />
        </BasicItemCard>,
        { wrapper: ThemeWrapper },
      )

      fireEvent.contextMenu(screen.getByRole("button"))

      expect(onOpen).not.toHaveBeenCalled()
    })

    it("adds an Edit quick action that calls onEdit (not onOpen) and closes the menu", () => {
      const onOpen = vi.fn()
      const onEdit = vi.fn()
      render(<BasicItemCard item={baseItem} onOpen={onOpen} onEdit={onEdit} />, { wrapper: ThemeWrapper })

      fireEvent.contextMenu(screen.getByRole("button"))
      fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))

      expect(onEdit).toHaveBeenCalledOnce()
      expect(onOpen).not.toHaveBeenCalled()
      expect(screen.queryByRole("menu")).toBeNull()
    })

    it("does not show an Edit quick action without onEdit", () => {
      render(<BasicItemCard item={baseItem} onOpen={vi.fn()} onRemove={vi.fn()} />, { wrapper: ThemeWrapper })

      fireEvent.contextMenu(screen.getByRole("button"))

      expect(screen.queryByRole("menuitem", { name: "Edit" })).toBeNull()
    })

    it("adds a Remove quick action that calls onRemove and closes the menu", () => {
      const onRemove = vi.fn()
      render(<BasicItemCard item={baseItem} onRemove={onRemove} />, { wrapper: ThemeWrapper })

      fireEvent.contextMenu(screen.getByText("Ares Predator V"))
      fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

      expect(onRemove).toHaveBeenCalledOnce()
      expect(screen.queryByRole("menu")).toBeNull()
    })

    it("separates type-specific quick actions from Edit/Remove with a divider", () => {
      render(
        <BasicItemCard item={baseItem} onEdit={vi.fn()} onRemove={vi.fn()}>
          <ItemCardSlot.QuickAction label="Equip" onClick={vi.fn()} />
        </BasicItemCard>,
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
          <BasicItemCard item={baseItem}>
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
          <BasicItemCard item={baseItem} onOpen={onOpen}>
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
          <BasicItemCard item={baseItem}>
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
          <BasicItemCard item={baseItem} onOpen={onOpen}>
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
