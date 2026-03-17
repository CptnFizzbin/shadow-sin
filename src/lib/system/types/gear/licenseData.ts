import type { GearData, GearType } from "./gearData.ts";

export type VerificationData =
  | { kind: "real" }
  | { kind: "fake"; rating: number };

export interface LicenseData extends GearData {
  type: GearType.license;
  verification: VerificationData;
}

export interface SinData extends GearData {
  type: GearType.sin;
  verification: VerificationData;
  cost?: number;
  licenses?: Array<{ id: string }>;
}
