import type {
  LicenseCheckAlert,
  LicenseCheckResult,
  VerificationCheck,
  VerificationLane,
  VerificationOutcome,
} from "./licenseCheckTypes.ts"

function getOutcomeReason(outcome: VerificationOutcome, kind: VerificationCheck["kind"]): string {
  if (kind === "unlicensed-gear") return "unlicensed — no registration on file"
  if (kind === "forbidden-gear") return "forbidden — no licence possible"
  return `you ${outcome.credentialHits} vs scanner ${outcome.scannerHits}`
}

/**
 * Assembles the final `LicenseCheckResult` from every lane's resolved outcomes: per-item alerts
 * for flagged results, plus the multi-SIN alert, which fires whenever 2+ SIN lanes were scanned —
 * independent of how the individual rolls went.
 */
export function buildLicenseCheckResult(
  scannerRating: number,
  lanes: VerificationLane[],
  outcomes: VerificationOutcome[],
): LicenseCheckResult {
  const kindByItemId = new Map(
    lanes.flatMap((lane) => lane.checks).map((check) => [check.itemId, check.kind]),
  )

  const alerts: LicenseCheckAlert[] = outcomes
    .filter((outcome) => outcome.status === "flagged")
    .map((outcome) => ({
      itemId: outcome.itemId,
      reason: getOutcomeReason(outcome, kindByItemId.get(outcome.itemId) ?? "sin"),
    }))

  const sinLanes = lanes.filter((lane) => lane.checks[0]?.kind === "sin")
  if (sinLanes.length >= 2) {
    alerts.push({ itemId: "multiple-sins", reason: sinLanes.map((lane) => lane.title).join(" + ") })
  }

  return { scannerRating, outcomes, alerts }
}
