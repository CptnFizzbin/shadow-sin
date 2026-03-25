import type { GearData, GearType } from "#/lib/system/types/gear/gearData.ts"
import type {
  LicenseData,
  VerificationData,
} from "#/lib/system/types/gear/licenseData.ts"

export interface SinData extends GearData {
  itemType: GearType.sin
  verification: VerificationData
  cost?: number
  licenses?: LicenseData[]
}
