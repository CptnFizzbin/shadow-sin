import { BaseGearData, GearType } from "../GearData"
import { LicenseAttr } from "./LicenseAttr"

export interface LicenseData extends BaseGearData {
  gearType: GearType.license

  attributes: {
    [LicenseAttr.rating]: number
  }
}
