import type { GearData, GearType } from "./gearData.ts"

export enum VerificationKind {
  Real = "Real",
  Fake = "Fake",
}

export type VerificationData =
  | { kind: VerificationKind.Real }
  | { kind: VerificationKind.Fake, rating: number }

export interface LicenseData extends GearData {
  itemType: GearType.license
  verification: VerificationData
}
