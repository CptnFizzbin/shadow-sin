import { milliseconds } from "date-fns"

import { NumberUtils } from "#/lib/numberUtils.ts"
import { selectHits } from "#/system/dice/diceRoller.selectors.ts"
import type { DiceRoller } from "#/system/dice/diceRoller.ts"

import type { CredentialRating, VerificationCheck, VerificationOutcome } from "./licenseCheckTypes.ts"

export function getOpposedPoolSize(rating: number, ratingPlusRating: boolean): number {
  return ratingPlusRating ? rating * 2 : rating
}

/**
 * Scan duration for a rolled item scales with the total dice pool size, per
 * docs/features/0011-license-check-dialog.md — passes a pool-size-derived timeout into the
 * existing `DiceRoller.rollAll` rather than changing the dice engine itself.
 */
export function getRollTimeout(totalDicePool: number): number {
  return NumberUtils.clamp(300 + totalDicePool * 120, {
    min: 600,
    max: 3000,
  })
}

export interface OpposedTestResult {
  credentialHits: number
  scannerHits: number
  status: "clear" | "flagged"
}

/**
 * Rolls a License Check Opposed Test: `credentialRating × 2` d6 (the SIN/Licence) against
 * `scannerRating × 2` d6 (the Verification System), per the `items.licenseCheck.ratingPlusRating`
 * House Rule. A tie favours the credential — it holds.
 */
export async function rollOpposedTest(
  credentialRoller: DiceRoller,
  scannerRoller: DiceRoller,
  credentialRating: number,
  scannerRating: number,
  ratingPlusRating: boolean,
): Promise<OpposedTestResult> {
  const credentialPool = getOpposedPoolSize(credentialRating, ratingPlusRating)
  const scannerPool = getOpposedPoolSize(scannerRating, ratingPlusRating)
  const timeout = milliseconds({ seconds: 5 })

  credentialRoller.setPoolSize(credentialPool)
  scannerRoller.setPoolSize(scannerPool)

  await Promise.all([
    credentialRoller.rollAll({ timeout }),
    scannerRoller.rollAll({ timeout }),
  ])

  const credentialHits = selectHits(credentialRoller.store.get())
  const scannerHits = selectHits(scannerRoller.store.get())
  const status = credentialHits >= scannerHits ? "clear" as const : "flagged" as const

  return { credentialHits, scannerHits, status }
}

export function isRealCredential(rating: CredentialRating): rating is "real" {
  return rating === "real"
}

/**
 * Resolves one `VerificationCheck`: a real credential or already-flagged item resolves instantly,
 * everything else runs the Opposed Test. Kept separate from `useLicenseCheckWorker` so the worker
 * hook stays focused on queue sequencing/rendering rather than per-item resolution rules.
 */
export async function resolveVerificationCheck(
  check: VerificationCheck,
  credentialRoller: DiceRoller,
  scannerRoller: DiceRoller,
  scannerRating: number,
  ratingPlusRating: boolean,
): Promise<VerificationOutcome> {
  if (check.kind === "unlicensed-gear" || check.kind === "forbidden-gear") {
    return { itemId: check.itemId, status: "flagged" }
  }

  const rating = check.credentialRating
  if (rating === undefined || isRealCredential(rating)) {
    return { itemId: check.itemId, status: "clear" }
  }

  credentialRoller.reset()
  scannerRoller.reset()
  const { credentialHits, scannerHits, status } = await rollOpposedTest(
    credentialRoller,
    scannerRoller,
    rating,
    scannerRating,
    ratingPlusRating,
  )
  return { itemId: check.itemId, status, credentialHits, scannerHits }
}
