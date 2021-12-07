import { CharacterData } from '../Character/CharacterData'
import { GearData } from '../Gear/GearData'
import { OtherGearData } from '../Gear/OtherGearData'

export function addGear<T extends GearData = OtherGearData> (
  character: CharacterData,
  gear: T,
  attachedGear: GearData[] = [],
): T {
  if (gear.id === null) { throw new Error(`Null gear id for ${gear.name}`)}
  character.gear.push(gear)

  attachedGear
    .map(item => addGear(character, item))
    .map(item => item.attachedTo = gear.id)

  return gear
}
