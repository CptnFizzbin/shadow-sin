import { BaseGearData, GearType, getAttr } from "../GearData"

export enum ModType {
  other = "vehicleMod.type.other",
  riggerInterface = "vehicleMod.type.riggerInterface",
  stdWeaponMount = "vehicleMod.type.stdWeaponMount",
  heavyWeaponMount = "vehicleMod.type.heavyWeaponMount",
  manualControl = "vehicleMod.type.manualControl",
}

export enum VehicleModAttr {
  rating = "vehicleMod.attr.rating",
  slotType = "vehicleMod.attr.slotType",
  slotCost = "vehicleMod.attr.slotCost",
  hardpointSize = "vehicleMod.attr.hardpointSize",
}

export const VehicleModAttrNames: Record<VehicleModAttr, string> = {
  [VehicleModAttr.rating]: "Rating",
  [VehicleModAttr.slotType]: "Slot Type",
  [VehicleModAttr.slotCost]: "Slot Cost",
  [VehicleModAttr.hardpointSize]: "Hardpoint Size",
}

export enum SlotType {
  chassis = "Chassis",
  powertrain = "Powertrain",
  electronic = "Electronic",
}

export enum HardpointSize {
  small = "Small",
  standard = "Standard",
  large = "Large",
  huge = "Huge",
}

const slotTypeNames: Record<SlotType, string> = {
  [SlotType.chassis]: "Chassis",
  [SlotType.powertrain]: "Powertrain",
  [SlotType.electronic]: "Electronic",
}

export function formatSlotType(type: SlotType): string {
  return slotTypeNames[type]
}

export interface VehicleModData extends BaseGearData {
  gearType: GearType.vehicleMod
  modType?: ModType

  attributes?: {
    [VehicleModAttr.rating]?: number
    [VehicleModAttr.slotType]?: SlotType
    [VehicleModAttr.slotCost]?: number
    [VehicleModAttr.hardpointSize]?: HardpointSize
  }
}

export interface SlottableMod extends VehicleModData {
  attributes: {
    [VehicleModAttr.slotType]: SlotType
    [VehicleModAttr.slotCost]: number
  }
}

export interface MountableMod extends VehicleModData {
  attributes: {
    [VehicleModAttr.hardpointSize]: HardpointSize
  }
}

export function isVehicleMod(gear: BaseGearData): gear is VehicleModData {
  return gear.gearType === GearType.vehicleMod
}

export function isSlottable(mod: VehicleModData): mod is SlottableMod {
  return !!getAttr(mod, VehicleModAttr.slotType)
}

export function isMountable(mod: VehicleModData): mod is MountableMod {
  return !!getAttr(mod, VehicleModAttr.hardpointSize)
}
