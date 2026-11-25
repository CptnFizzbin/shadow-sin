import type { ParsedLocation } from "@tanstack/react-router"
import { describe, expect, it } from "vitest"

import { dialogBackGuardState } from "#ui/dialog/dialogBackGuard.ts"

import { createDialogAwareScrollRestoration } from "./dialogAwareScrollRestoration.ts"

const makeLocation = (key: string, state: object = {}) => ({
  location: { state: { __TSR_key: key, ...state } } as ParsedLocation,
})

describe.concurrent("createDialogAwareScrollRestoration", () => {
  it("restores scroll for an ordinary navigation", () => {
    // Arrange
    const shouldRestoreScroll = createDialogAwareScrollRestoration()
    shouldRestoreScroll(makeLocation("page-a"))

    // Act
    const result = shouldRestoreScroll(makeLocation("page-b"))

    // Assert
    expect(result).toBe(true)
  })

  it("leaves scroll alone when a dialog pushes its back guard", () => {
    // Arrange
    const shouldRestoreScroll = createDialogAwareScrollRestoration()
    shouldRestoreScroll(makeLocation("page-a"))

    // Act
    const result = shouldRestoreScroll(makeLocation("guard", dialogBackGuardState))

    // Assert
    expect(result).toBe(false)
  })

  it("leaves scroll alone when history returns from the guard to the page the dialog opened over", () => {
    // Arrange
    const shouldRestoreScroll = createDialogAwareScrollRestoration()
    shouldRestoreScroll(makeLocation("page-a"))
    shouldRestoreScroll(makeLocation("guard", dialogBackGuardState))

    // Act
    const result = shouldRestoreScroll(makeLocation("page-a"))

    // Assert
    expect(result).toBe(false)
  })

  it("restores scroll when the dialog navigates somewhere else", () => {
    // Arrange
    const shouldRestoreScroll = createDialogAwareScrollRestoration()
    shouldRestoreScroll(makeLocation("page-a"))
    shouldRestoreScroll(makeLocation("guard", dialogBackGuardState))

    // Act
    const result = shouldRestoreScroll(makeLocation("page-b"))

    // Assert
    expect(result).toBe(true)
  })

  it("returns to the original page when one dialog's guard replaces another's", () => {
    // Arrange
    const shouldRestoreScroll = createDialogAwareScrollRestoration()
    shouldRestoreScroll(makeLocation("page-a"))
    shouldRestoreScroll(makeLocation("guard-1", dialogBackGuardState))
    shouldRestoreScroll(makeLocation("guard-2", dialogBackGuardState))

    // Act
    const result = shouldRestoreScroll(makeLocation("page-a"))

    // Assert
    expect(result).toBe(false)
  })
})
