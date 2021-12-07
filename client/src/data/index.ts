import { CharacterData } from '../Character/CharacterData'
import { GearData } from '../Gear/GearData'
import { OtherGearData } from '../Gear/OtherGearData'

interface UsedId {
  gear: GearData
  character: CharacterData
}

const usedIds: Record<string, UsedId> = {}

export function addGear<T extends GearData = OtherGearData> (
  character: CharacterData,
  gear: T,
  attachedGear: GearData[] = [],
): T {
  if (gear.id === null) {
    throw new Error(`Null gear id for ${gear.name}`)
  }

  if (usedIds[gear.id] && usedIds[gear.id]?.gear !== gear) {
    const usedId = usedIds[gear.id]
    throw new Error(`Duplicate gear id for ${gear.name}. Already registered with ${usedId.character.bio.name} as ${usedId.gear.name}`)
  }

  usedIds[gear.id] = { gear, character }
  character.gear.push(gear)

  attachedGear
    .map(item => addGear(character, item))
    .map(item => item.attachedTo = gear.id)

  return gear
}
