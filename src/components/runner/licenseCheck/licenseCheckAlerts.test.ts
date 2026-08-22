import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { buildLicenseCheckResult } from "./licenseCheckAlerts.ts"
import type { VerificationCheck, VerificationOutcome } from "./licenseCheckTypes.ts"

const sinId1 = "00000000-0000-0000-0000-000000000001" as UUID
const sinId2 = "00000000-0000-0000-0000-000000000002" as UUID

function gearMap(...items: ItemData[]): Record<string, ItemData> {
  return Object.fromEntries(items.map((item) => [item.id, item]))
}

describe.concurrent("buildLicenseCheckResult", () => {
  it("produces no alerts when a single SIN check clears entirely", () => {
    const checks: VerificationCheck[] = [{ itemId: "sin-1", kind: "sin", credentialRating: 3 }]
    const outcomes: VerificationOutcome[] = [
      { itemId: "sin-1", status: "clear", credentialHits: 2, scannerHits: 1 },
    ]

    const result = buildLicenseCheckResult(3, {}, checks, outcomes)

    expect(result).toEqual({ scannerRating: 3, outcomes, alerts: [] })
  })

  it("uses the exact 'you N vs scanner M' reason for a flagged rolled item", () => {
    const checks: VerificationCheck[] = [{ itemId: "sin-1", kind: "sin", credentialRating: 3 }]
    const outcomes: VerificationOutcome[] = [
      { itemId: "sin-1", status: "flagged", credentialHits: 1, scannerHits: 4 },
    ]

    const result = buildLicenseCheckResult(3, {}, checks, outcomes)

    expect(result.alerts).toEqual([{ itemId: "sin-1", reason: "you 1 vs scanner 4" }])
  })

  it("gives unlicensed and forbidden items their own short mechanical reasons", () => {
    const checks: VerificationCheck[] = [
      { itemId: "item-1", kind: "unlicensed-gear" },
      { itemId: "item-2", kind: "forbidden-gear" },
    ]
    const outcomes: VerificationOutcome[] = [
      { itemId: "item-1", status: "flagged" },
      { itemId: "item-2", status: "flagged" },
    ]

    const result = buildLicenseCheckResult(3, {}, checks, outcomes)

    expect(result.alerts).toEqual([
      { itemId: "item-1", reason: "unlicensed — no registration on file" },
      { itemId: "item-2", reason: "forbidden — no licence possible" },
    ])
  })

  it("adds a multiple-sins alert naming every scanned SIN, even if every outcome clears", () => {
    const johnSmith: SinData = { kind: EntityKind.item, id: sinId1, name: "John Smith", itemType: ItemType.sin, rating: 3 }
    const janeDoe: SinData = { kind: EntityKind.item, id: sinId2, name: "Jane Doe", itemType: ItemType.sin, rating: 3 }
    const gear = gearMap(johnSmith, janeDoe)

    const checks: VerificationCheck[] = [
      { itemId: sinId1, kind: "sin", credentialRating: "real" },
      { itemId: sinId2, kind: "sin", credentialRating: "real" },
    ]
    const outcomes: VerificationOutcome[] = [
      { itemId: sinId1, status: "clear" },
      { itemId: sinId2, status: "clear" },
    ]

    const result = buildLicenseCheckResult(3, gear, checks, outcomes)

    expect(result.alerts).toEqual([{ itemId: "multiple-sins", reason: "John Smith + Jane Doe" }])
  })
})
