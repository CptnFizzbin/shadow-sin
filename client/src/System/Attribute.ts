import { CharacterAttr } from '../Character/CharacterAttr'
import { AugmentAttr } from '../Gear/Augments/AugmentAttr'
import { RccAttr } from '../Gear/Rcc/RccAttr'
import { SinAttr } from '../Gear/Sins/SinAttr'
import { AutosoftAttr } from '../Gear/Software/Autosoft/AutosoftAttr'
import { VehicleAttr } from '../Gear/Vehicles/VehicleAttr'
import { WeaponAttr } from '../Gear/Weapons/WeaponAttr'

export type AttrType = string
export type AttrValue = number | string | null | undefined
export type AttrList = { [type: string]: AttrValue }

const attributeNames: Record<AttrType, string> = {
  [CharacterAttr.body]: 'Body',
  [CharacterAttr.agility]: 'Agility',
  [CharacterAttr.reaction]: 'Reaction',
  [CharacterAttr.strength]: 'Strength',
  [CharacterAttr.willpower]: 'Willpower',
  [CharacterAttr.logic]: 'Logic',
  [CharacterAttr.intuition]: 'Intuition',
  [CharacterAttr.charisma]: 'Charisma',
  [CharacterAttr.edge]: 'Edge',
  [CharacterAttr.essence]: 'Essence',
  [CharacterAttr.magic]: 'Magic',
  [CharacterAttr.resonance]: 'Resonance',

  [WeaponAttr.dv]: 'DV',
  [WeaponAttr.attackRatings]: 'Atk. Ratings',
  [WeaponAttr.modes]: 'Modes',
  [WeaponAttr.ammo]: 'Ammo',

  [AugmentAttr.grade]: 'Grade',
  [AugmentAttr.rating]: 'Rating',
  [AugmentAttr.capacity]: 'Capacity',
  [AugmentAttr.capacityCost]: 'Capacity Cost',

  [SinAttr.rating]: 'Rating',

  [AutosoftAttr.rating]: 'Rating',
  [AutosoftAttr.attr]: 'Attr',
  [AutosoftAttr.skill]: 'Skill',
  [AutosoftAttr.weapon]: 'Weapon',

  [RccAttr.deviceRating]: 'Device Rating',
  [RccAttr.dataProcessing]: 'Data Processing',
  [RccAttr.firewall]: 'Firewall',

  [VehicleAttr.handling]: 'Handling',
  [VehicleAttr.accel]: 'Accel',
  [VehicleAttr.speedInterval]: 'Speed Interval',
  [VehicleAttr.topSpeed]: 'Top Speed',
  [VehicleAttr.body]: 'Body',
  [VehicleAttr.armor]: 'Armor',
  [VehicleAttr.pilot]: 'Pilot',
  [VehicleAttr.sensor]: 'Sensor',
  [VehicleAttr.seat]: 'Seat',
}

export const formatAttr = (type: string): string => {
  return attributeNames[type] || type
}
