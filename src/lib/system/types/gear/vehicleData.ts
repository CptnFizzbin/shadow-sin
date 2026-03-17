import type { GearData, GearType } from "./gearData.ts";

export interface VehicleData extends GearData {
  type: GearType.vehicle;
  vehicleType: string;
  model?: string;

  handling: number;
  accel: `${number}/${number}`;
  pilot: number;
  speed: number;
  body: number;
  armor: number;
  sensor: number;

  seats?: number;

  damage?: {
    physical: {
      current: number;
      max: number;
    };
  };
}
