import type { ItemData } from "#/system/itemData.ts"

import type {
  LicenseCheckAlert,
  LicenseCheckResult,
  VerificationCheck,
  VerificationOutcome,
} from "./licenseCheckTypes.ts"

function getOutcomeReason(outcome: VerificationOutcome, kind: VerificationCheck["kind"]): string {
  if (kind === "unlicensed-gear") return "unlicensed — no registration on file"
  if (kind === "forbidden-gear") return "forbidden — no licence possible"
  return `you ${outcome.credentialHits} vs scanner ${outcome.scannerHits}`
}

/**
 * Assembles the final `LicenseCheckResult` from the scan's resolved outcomes: per-item alerts for
 * flagged results, plus the multi-SIN alert, which fires whenever 2+ SINs were scanned this run —
 * independent of how the individual rolls went.
 */
export function buildLicenseCheckResult(
  scannerRating: number,
  gear: Record<string, ItemData>,
  checks: VerificationCheck[],
  outcomes: VerificationOutcome[],
): LicenseCheckResult {
  const kindByItemId = new Map(checks.map((check) => [check.itemId, check.kind]))

  const alerts: LicenseCheckAlert[] = outcomes
    .filter((outcome) => outcome.status === "flagged")
    .map((outcome) => ({
      itemId: outcome.itemId,
      reason: getOutcomeReason(outcome, kindByItemId.get(outcome.itemId) ?? "sin"),
    }))

  const sinChecks = checks.filter((check) => check.kind === "sin")
  if (sinChecks.length >= 2) {
    const names = sinChecks.map((check) => gear[check.itemId]?.name ?? check.itemId)
    alerts.push({ itemId: "multiple-sins", reason: names.join(" + ") })
  }

  return { scannerRating, outcomes, alerts }
}
