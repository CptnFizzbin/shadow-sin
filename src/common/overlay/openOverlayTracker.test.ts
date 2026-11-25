import { describe, expect, it } from "vitest"

import { isAnyOverlayOpen, markOverlayClosed, markOverlayOpened } from "./openOverlayTracker.ts"

describe("openOverlayTracker", () => {
  it("starts with no overlay open", () => {
    expect(isAnyOverlayOpen()).toBe(false)
  })

  it("reports open after markOverlayOpened() and closed after a matching markOverlayClosed()", () => {
    markOverlayOpened()
    expect(isAnyOverlayOpen()).toBe(true)

    markOverlayClosed()
    expect(isAnyOverlayOpen()).toBe(false)
  })

  it("stays open while any of several overlays remains open", () => {
    markOverlayOpened()
    markOverlayOpened()

    markOverlayClosed()
    expect(isAnyOverlayOpen()).toBe(true)

    markOverlayClosed()
    expect(isAnyOverlayOpen()).toBe(false)
  })

  it("does not go negative when closed more times than opened", () => {
    markOverlayClosed()
    markOverlayClosed()
    expect(isAnyOverlayOpen()).toBe(false)

    markOverlayOpened()
    expect(isAnyOverlayOpen()).toBe(true)
    markOverlayClosed()
  })
})
