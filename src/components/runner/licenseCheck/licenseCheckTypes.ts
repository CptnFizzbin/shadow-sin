// Matches SinData/LicenseData's isReal-flag shape (see #535). `rating` is only meaningful (and
// only ever set) when `isReal` is `false`.
export interface CredentialRating {
  isReal: boolean
  rating?: number
}

export interface VerificationCheck {
  itemId: string // SinData.id or ItemData.id
  kind: "sin" | "licensed-gear" | "unlicensed-gear" | "forbidden-gear"
  credentialRating?: CredentialRating // absent for unlicensed/forbidden — nothing to roll
}

export interface VerificationLane {
  key: string // a SIN's id, or "unlicensed" / "forbidden"
  title: string // the SIN's display name, or "Unlicensed Gear" / "Forbidden Gear"
  checks: VerificationCheck[] // Setup checklist display order — the scan itself runs a separately shuffled, flattened queue
}

export interface VerificationOutcome {
  itemId: string
  status: "clear" | "flagged"
  credentialHits?: number
  scannerHits?: number
}

export interface LicenseCheckAlert {
  itemId: string | "multiple-sins"
  reason: string
}

export interface LicenseCheckResult {
  scannerRating: number // 1–6, set for this run
  outcomes: VerificationOutcome[]
  alerts: LicenseCheckAlert[]
}
