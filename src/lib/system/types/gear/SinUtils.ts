import type { AvailablityInfo } from "#/lib/system/types/availablityInfo.ts"
import type { VerificationData } from "#/lib/system/types/gear/licenseData.ts"
import { VerificationKind } from "#/lib/system/types/gear/licenseData.ts"

export function getSinAvailability(
  verification: VerificationData,
): AvailablityInfo {
  if (verification.kind === VerificationKind.Real) return { rating: 0 }
  return { rating: verification.rating * 3, forbidden: true }
}

export function getSinCost(verification: VerificationData): number {
  if (verification.kind === VerificationKind.Real) return 0
  return verification.rating * 1_000
}

export function getLicenseAvailability(
  verification: VerificationData,
): AvailablityInfo {
  if (verification.kind === VerificationKind.Real) return { rating: 0 }
  return { rating: verification.rating * 3, forbidden: true }
}

export function getLicenseCost(verification: VerificationData): number {
  if (verification.kind === VerificationKind.Real) return 0
  return verification.rating * 100
}
