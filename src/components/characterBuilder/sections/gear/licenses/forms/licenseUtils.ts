import type { AvailablityInfo } from "#/system/availablityInfo.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"

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
