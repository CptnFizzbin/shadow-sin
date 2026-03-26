import type { GearData, GearType } from "#/lib/system/gear/gearData.ts"
import type {
  LicenseData,
  VerificationData,
} from "#/lib/system/gear/licenseData.ts"

export interface SinData extends GearData {
  itemType: GearType.sin
  verification: VerificationData
  cost?: number
  licenses?: LicenseData[]
}
