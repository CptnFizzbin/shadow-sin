import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { DiceRoller } from "#/system/dice/diceRoller.ts"

import { getOpposedPoolSize, getRollTimeout, isRealCredential, resolveVerificationCheck, rollOpposedTest } from "./licenseCheckDice.ts"
import type { VerificationCheck } from "./licenseCheckTypes.ts"

describe("getOpposedPoolSize", () => {
  it("doubles the rating when ratingPlusRating is enabled", () => {
    expect(getOpposedPoolSize(3, true)).toBe(6)
  })

  it("uses the rating alone when ratingPlusRating is disabled", () => {
    expect(getOpposedPoolSize(3, false)).toBe(3)
  })
})

describe("getRollTimeout", () => {
  it("scales with the total dice pool size", () => {
    expect(getRollTimeout(4)).toBeLessThan(getRollTimeout(20))
  })

  it("clamps to a minimum of 600ms", () => {
    expect(getRollTimeout(0)).toBe(600)
  })

  it("clamps to a maximum of 3000ms", () => {
    expect(getRollTimeout(1000)).toBe(3000)
  })
})

describe("isRealCredential", () => {
  it("is true for 'real'", () => {
    expect(isRealCredential("real")).toBe(true)
  })

  it("is false for a numeric rating", () => {
    expect(isRealCredential(3)).toBe(false)
  })
})

describe("rollOpposedTest", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("resolves 'clear' when the credential rolls more hits than the scanner", async () => {
    const credentialRoller = new DiceRoller()
    const scannerRoller = new DiceRoller()
    vi.spyOn(credentialRoller, "rollD6").mockReturnValue(6) // all hits
    vi.spyOn(scannerRoller, "rollD6").mockReturnValue(1) // no hits

    const resultPromise = rollOpposedTest(credentialRoller, scannerRoller, 3, 3, false)
    await vi.runAllTimersAsync()
    const result = await resultPromise

    expect(result).toEqual({ credentialHits: 3, scannerHits: 0, status: "clear" })
  })

  it("resolves 'flagged' when the scanner rolls more hits than the credential", async () => {
    const credentialRoller = new DiceRoller()
    const scannerRoller = new DiceRoller()
    vi.spyOn(credentialRoller, "rollD6").mockReturnValue(1) // no hits
    vi.spyOn(scannerRoller, "rollD6").mockReturnValue(6) // all hits

    const resultPromise = rollOpposedTest(credentialRoller, scannerRoller, 3, 3, false)
    await vi.runAllTimersAsync()
    const result = await resultPromise

    expect(result).toEqual({ credentialHits: 0, scannerHits: 3, status: "flagged" })
  })

  it("favours the credential on a tie", async () => {
    const credentialRoller = new DiceRoller()
    const scannerRoller = new DiceRoller()
    vi.spyOn(credentialRoller, "rollD6").mockReturnValue(5)
    vi.spyOn(scannerRoller, "rollD6").mockReturnValue(5)

    const resultPromise = rollOpposedTest(credentialRoller, scannerRoller, 2, 2, false)
    await vi.runAllTimersAsync()
    const result = await resultPromise

    expect(result.status).toBe("clear")
  })

  it("sizes each pool by rating × 2 when ratingPlusRating is enabled", async () => {
    const credentialRoller = new DiceRoller()
    const scannerRoller = new DiceRoller()
    vi.spyOn(credentialRoller, "rollD6").mockReturnValue(6)
    vi.spyOn(scannerRoller, "rollD6").mockReturnValue(6)

    const resultPromise = rollOpposedTest(credentialRoller, scannerRoller, 3, 4, true)
    await vi.runAllTimersAsync()
    await resultPromise

    expect(credentialRoller.store.get().dice).toHaveLength(6)
    expect(scannerRoller.store.get().dice).toHaveLength(8)
  })
})

describe("resolveVerificationCheck", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("flags unlicensed gear without rolling", async () => {
    const check: VerificationCheck = { itemId: "item-1", kind: "unlicensed-gear" }
    const outcome = await resolveVerificationCheck(check, new DiceRoller(), new DiceRoller(), 3, false)

    expect(outcome).toEqual({ itemId: "item-1", status: "flagged" })
  })

  it("flags forbidden gear without rolling", async () => {
    const check: VerificationCheck = { itemId: "item-2", kind: "forbidden-gear" }
    const outcome = await resolveVerificationCheck(check, new DiceRoller(), new DiceRoller(), 3, false)

    expect(outcome).toEqual({ itemId: "item-2", status: "flagged" })
  })

  it("clears a real credential without rolling", async () => {
    const check: VerificationCheck = { itemId: "sin-1", kind: "sin", credentialRating: "real" }
    const outcome = await resolveVerificationCheck(check, new DiceRoller(), new DiceRoller(), 3, false)

    expect(outcome).toEqual({ itemId: "sin-1", status: "clear" })
  })

  it("clears a check with no credential rating without rolling", async () => {
    const check: VerificationCheck = { itemId: "item-3", kind: "licensed-gear" }
    const outcome = await resolveVerificationCheck(check, new DiceRoller(), new DiceRoller(), 3, false)

    expect(outcome).toEqual({ itemId: "item-3", status: "clear" })
  })

  it("rolls an Opposed Test for a fake numeric-rating credential", async () => {
    const credentialRoller = new DiceRoller()
    const scannerRoller = new DiceRoller()
    vi.spyOn(credentialRoller, "rollD6").mockReturnValue(6)
    vi.spyOn(scannerRoller, "rollD6").mockReturnValue(1)
    const check: VerificationCheck = { itemId: "sin-2", kind: "sin", credentialRating: 3 }

    const outcomePromise = resolveVerificationCheck(check, credentialRoller, scannerRoller, 3, false)
    await vi.runAllTimersAsync()
    const outcome = await outcomePromise

    expect(outcome).toEqual({ itemId: "sin-2", status: "clear", credentialHits: 3, scannerHits: 0 })
  })
})
