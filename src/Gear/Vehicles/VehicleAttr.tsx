import { AttrNames } from "../../System/Attribute"

export enum VehicleAttr {
  handling = "vehicle.handling",
  accel = "vehicle.accel",
  speedInterval = "vehicle.speedInterval",
  topSpeed = "vehicle.topSpeed",
  body = "vehicle.body",
  armor = "vehicle.armor",
  pilot = "vehicle.pilot",
  sensor = "vehicle.sensor",
  seat = "vehicle.seat",
}

export const VehicleAttrNames: AttrNames = {
  [VehicleAttr.handling]: "Handling",
  [VehicleAttr.accel]: "Accel",
  [VehicleAttr.speedInterval]: "Speed Interval",
  [VehicleAttr.topSpeed]: "Top Speed",
  [VehicleAttr.body]: "Body",
  [VehicleAttr.armor]: "Armor",
  [VehicleAttr.pilot]: "Pilot",
  [VehicleAttr.sensor]: "Sensor",
  [VehicleAttr.seat]: "Seat",
}
