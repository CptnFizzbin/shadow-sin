import type { GearData, GearType } from "./gearData.ts";

export interface ArmorData extends GearData {
  type: GearType.armor;
  ballistic: number;
  impact: number;
}
