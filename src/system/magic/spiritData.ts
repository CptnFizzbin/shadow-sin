import type { UUID } from "node:crypto"

import { AttributeKey } from "#/system/attributeKey.ts"

export enum SpiritType {
  wind = "wind",
  beast = "beast",
  earth = "earth",
  fire = "fire",
  guidance = "guidance",
  guardian = "guardian",
  man = "man",
  plant = "plant",
  task = "task",
  water = "water",
}

export const SpiritTypeLabels: Record<SpiritType, string> = {
  [SpiritType.wind]: "Spirit of Air",
  [SpiritType.beast]: "Spirit of Beasts",
  [SpiritType.earth]: "Spirit of Earth",
  [SpiritType.fire]: "Spirit of Fire",
  [SpiritType.guidance]: "Guidance Spirit",
  [SpiritType.guardian]: "Guardian Spirit",
  [SpiritType.man]: "Spirit of Man",
  [SpiritType.plant]: "Plant Spirit",
  [SpiritType.task]: "Task Spirit",
  [SpiritType.water]: "Spirit of Water",
}

export interface SpiritData {
  id: UUID
  name: string
  spiritType: SpiritType
  force: number
  services: {
    max: number
    used: number
  }
  bound: boolean
  optionalPowers: string[]
  notes?: string
}

export function calculateSpiritAttributes(force: number, type: SpiritType): Record<AttributeKey, number> {
  const attrs = {
    [AttributeKey.body]: force,
    [AttributeKey.agility]: force,
    [AttributeKey.reaction]: force,
    [AttributeKey.strength]: force,
    [AttributeKey.charisma]: force,
    [AttributeKey.intuition]: force,
    [AttributeKey.logic]: force,
    [AttributeKey.willpower]: force,
    [AttributeKey.edge]: Math.floor(force / 2),
    [AttributeKey.magic]: force,
    [AttributeKey.essence]: force,
    [AttributeKey.resonance]: 0,
  }

  switch (type) {
    case SpiritType.wind:
      attrs[AttributeKey.body] = force - 2
      attrs[AttributeKey.agility] = force + 3
      attrs[AttributeKey.reaction] = force + 4
      attrs[AttributeKey.strength] = force - 3
      break
    case SpiritType.beast:
      attrs[AttributeKey.body] = force + 2
      attrs[AttributeKey.agility] = force + 1
      attrs[AttributeKey.reaction] = force + 2
      attrs[AttributeKey.strength] = force + 2
      break
    case SpiritType.earth:
      attrs[AttributeKey.body] = force + 4
      attrs[AttributeKey.agility] = force - 2
      attrs[AttributeKey.reaction] = force - 2
      attrs[AttributeKey.strength] = force + 4
      attrs[AttributeKey.intuition] = force - 1
      break
    case SpiritType.fire:
      attrs[AttributeKey.body] = force + 1
      attrs[AttributeKey.agility] = force + 2
      attrs[AttributeKey.reaction] = force + 3
      attrs[AttributeKey.strength] = force - 2
      break
    case SpiritType.guidance:
      attrs[AttributeKey.body] = force + 3
      attrs[AttributeKey.agility] = force - 1
      attrs[AttributeKey.reaction] = force + 2
      attrs[AttributeKey.strength] = force + 1
      break
    case SpiritType.guardian:
      attrs[AttributeKey.body] = force + 1
      attrs[AttributeKey.agility] = force + 2
      attrs[AttributeKey.reaction] = force + 3
      attrs[AttributeKey.strength] = force + 2
      break
    case SpiritType.man:
      attrs[AttributeKey.agility] = force + 2
      attrs[AttributeKey.intuition] = force + 1
      break
    case SpiritType.plant:
      attrs[AttributeKey.body] = force + 2
      attrs[AttributeKey.agility] = force - 1
      attrs[AttributeKey.reaction] = force + 1
      attrs[AttributeKey.strength] = force + 1
      break
    case SpiritType.task:
      attrs[AttributeKey.body] = force + 2
      attrs[AttributeKey.agility] = force + 1
      attrs[AttributeKey.reaction] = force + 2
      attrs[AttributeKey.strength] = force + 2
      break
    case SpiritType.water:
      attrs[AttributeKey.body] = force
      attrs[AttributeKey.agility] = force + 1
      attrs[AttributeKey.reaction] = force + 2
      attrs[AttributeKey.strength] = force - 1
      break
  }

  // All attributes have a minimum of 1
  Object.keys(attrs).forEach((key) => {
    const k = key as AttributeKey
    if (k !== AttributeKey.resonance && attrs[k] < 1) {
      attrs[k] = 1
    }
  })

  return attrs
}
