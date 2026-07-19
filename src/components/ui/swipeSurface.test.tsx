import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { markOverlayClosed, markOverlayOpened } from "./dialog/openOverlayTracker.ts"
import { SwipeSurface } from "./swipeSurface.tsx"

function swipe(element: Element, fromX: number, toX: number) {
  fireEvent.touchStart(element, { touches: [{ clientX: fromX, clientY: 0 }] })
  fireEvent.touchEnd(element, { changedTouches: [{ clientX: toX, clientY: 0 }] })
}

describe("SwipeSurface", () => {
  it("fires onSwipeRightToLeft when swiping right-to-left", () => {
    const onSwipeRightToLeft = vi.fn()
    render(
      <SwipeSurface onSwipeRightToLeft={onSwipeRightToLeft}>
        <div>content</div>
      </SwipeSurface>,
    )

    swipe(screen.getByText("content"), 200, 100)

    expect(onSwipeRightToLeft).toHaveBeenCalledTimes(1)
  })

  it("fires onSwipeLeftToRight when swiping left-to-right", () => {
    const onSwipeLeftToRight = vi.fn()
    render(
      <SwipeSurface onSwipeLeftToRight={onSwipeLeftToRight}>
        <div>content</div>
      </SwipeSurface>,
    )

    swipe(screen.getByText("content"), 100, 200)

    expect(onSwipeLeftToRight).toHaveBeenCalledTimes(1)
  })

  it("does not fire swipe callbacks while a dialog is open", () => {
    const onSwipeRightToLeft = vi.fn()
    const onSwipeLeftToRight = vi.fn()
    render(
      <SwipeSurface onSwipeRightToLeft={onSwipeRightToLeft} onSwipeLeftToRight={onSwipeLeftToRight}>
        <div>content</div>
      </SwipeSurface>,
    )
    const element = screen.getByText("content")

    markOverlayOpened()
    swipe(element, 200, 100)
    swipe(element, 100, 200)
    markOverlayClosed()

    expect(onSwipeRightToLeft).not.toHaveBeenCalled()
    expect(onSwipeLeftToRight).not.toHaveBeenCalled()

    // Sanity check: swiping works again once the dialog closes.
    swipe(element, 200, 100)
    expect(onSwipeRightToLeft).toHaveBeenCalledTimes(1)
  })
})
