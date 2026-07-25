import { describe, expect, it } from "vitest"

import { buildLicenseCheckResult } from "./licenseCheckAlerts.ts"
import type { VerificationLane, VerificationOutcome } from "./licenseCheckTypes.ts"

describe("buildLicenseCheckResult", () => {
  it("produces no alerts when a single SIN lane clears entirely", () => {
    const lanes: VerificationLane[] = [
      { key: "sin-1", title: "John Smith", checks: [{ itemId: "sin-1", kind: "sin", credentialRating: 3 }] },
    ]
    const outcomes: VerificationOutcome[] = [
      { itemId: "sin-1", status: "clear", credentialHits: 2, scannerHits: 1 },
    ]

    const result = buildLicenseCheckResult(3, lanes, outcomes)

    expect(result).toEqual({ scannerRating: 3, outcomes, alerts: [] })
  })

  it("uses the exact 'you N vs scanner M' reason for a flagged rolled item", () => {
    const lanes: VerificationLane[] = [
      { key: "sin-1", title: "John Smith", checks: [{ itemId: "sin-1", kind: "sin", credentialRating: 3 }] },
    ]
    const outcomes: VerificationOutcome[] = [
      { itemId: "sin-1", status: "flagged", credentialHits: 1, scannerHits: 4 },
    ]

    const result = buildLicenseCheckResult(3, lanes, outcomes)

    expect(result.alerts).toEqual([{ itemId: "sin-1", reason: "you 1 vs scanner 4" }])
  })

  it("gives unlicensed and forbidden items their own short mechanical reasons", () => {
    const lanes: VerificationLane[] = [
      { key: "unlicensed", title: "Unlicensed Gear", checks: [{ itemId: "item-1", kind: "unlicensed-gear" }] },
      { key: "forbidden", title: "Forbidden Gear", checks: [{ itemId: "item-2", kind: "forbidden-gear" }] },
    ]
    const outcomes: VerificationOutcome[] = [
      { itemId: "item-1", status: "flagged" },
      { itemId: "item-2", status: "flagged" },
    ]

    const result = buildLicenseCheckResult(3, lanes, outcomes)

    expect(result.alerts).toEqual([
      { itemId: "item-1", reason: "unlicensed — no registration on file" },
      { itemId: "item-2", reason: "forbidden — no licence possible" },
    ])
  })

  it("adds a multiple-sins alert naming every active SIN, even if every outcome clears", () => {
    const lanes: VerificationLane[] = [
      { key: "sin-1", title: "John Smith", checks: [{ itemId: "sin-1", kind: "sin", credentialRating: "real" }] },
      { key: "sin-2", title: "Jane Doe", checks: [{ itemId: "sin-2", kind: "sin", credentialRating: "real" }] },
    ]
    const outcomes: VerificationOutcome[] = [
      { itemId: "sin-1", status: "clear" },
      { itemId: "sin-2", status: "clear" },
    ]

    const result = buildLicenseCheckResult(3, lanes, outcomes)

    expect(result.alerts).toEqual([{ itemId: "multiple-sins", reason: "John Smith + Jane Doe" }])
  })
})
