import type { AvailablityInfo } from "#/lib/system/availablity-info.ts"
import type { LicenseData } from "#/lib/system/gear/license-data.ts"

export const getLicenseAvailability = (
  rating: LicenseData["rating"],
): AvailablityInfo => {
  if (rating === "real") return { rating: 0 }

  return {
    rating: Number(rating) * 3,
    forbidden: true,
  }
}

export const getLicenseCost = (rating: LicenseData["rating"]): number => {
  if (rating === "real") return 0
  return Number(rating) * 100
}
