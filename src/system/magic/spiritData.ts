import type { UUID } from "node:crypto"

import { z } from "zod"

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

// Thematic names indexed by [type][force tier]: 1-3, 4-6, 7-9, 10+
const spiritTierNames: Record<SpiritType, [string, string, string, string]> = {
  [SpiritType.wind]: ["Vagrant Breeze", "Howling Sirocco", "Tempest Walker", "Ancient Cyclone"],
  [SpiritType.beast]: ["Young Prowler", "Pack Alpha", "Elder Predator", "Ancient Hunter"],
  [SpiritType.earth]: ["Stone Wisp", "Bedrock Elemental", "Mountain Elder", "Ancient Bedrock"],
  [SpiritType.fire]: ["Ember Sprite", "Flame Dancer", "Pyre Elder", "Inferno Ancient"],
  [SpiritType.guidance]: ["Young Oracle", "Wandering Guide", "Elder Sage", "Eternal Pathfinder"],
  [SpiritType.guardian]: ["Young Sentinel", "Steadfast Warden", "Elder Aegis", "Ancient Bastion"],
  [SpiritType.man]: ["Nascent Shade", "Restless Specter", "Elder Wraith", "Ancient Visage"],
  [SpiritType.plant]: ["Young Sprig", "Thicket Walker", "Root Elder", "Ancient Grove"],
  [SpiritType.task]: ["Minor Toiler", "Dutiful Servant", "Tireless Worker", "Bound Ancient"],
  [SpiritType.water]: ["Fledgling Eddy", "River Current", "Tidal Elder", "Primordial Deep"],
}

export function generateSpiritName(type: SpiritType, force: number): string {
  const tier = force <= 3 ? 0 : force <= 6 ? 1 : force <= 9 ? 2 : 3
  return spiritTierNames[type][tier]
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
  damage: {
    physical: number
    stun: number
  }
}

export const SpiritDataSchema = z.object({
  id: z.uuid() as z.ZodType<UUID>,
  name: z.string(),
  spiritType: z.nativeEnum(SpiritType),
  force: z.number().int().min(1).max(20),
  services: z.object({
    max: z.number().int().min(0),
    used: z.number().int().min(0),
  }),
  bound: z.boolean(),
  optionalPowers: z.string().array(),
  notes: z.string().optional(),
  damage: z.object({
    physical: z.number().int().min(0),
    stun: z.number().int().min(0),
  }),
}) satisfies z.ZodType<SpiritData>

// SR4A p.295-302: spirit initiative is a fixed per-type pool, not the standard Reaction+Intuition formula.
// Air/Fire spirits roll (F×2)+3d6; all others roll (F×2)+2d6. Astral initiative = (Intuition×2)+3d6.
export function calculateSpiritInitiative(force: number, type: SpiritType) {
  const attrs = calculateSpiritAttributes(force, type)
  const physicalScore = (type === SpiritType.wind || type === SpiritType.fire)
    ? force * 2 + 3
    : force * 2 + 2
  return {
    physicalScore,
    physicalIp: 2,
    astralBase: attrs[AttributeKey.intuition] * 2,
    astralIp: 3,
  }
}

export function calculateSpiritConditionMonitor(force: number, type: SpiritType): { physical: number, stun: number } {
  const attrs = calculateSpiritAttributes(force, type)
  return {
    physical: 8 + Math.ceil(attrs[AttributeKey.body] / 2),
    stun: 8 + Math.ceil(attrs[AttributeKey.willpower] / 2),
  }
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
    [AttributeKey.edge]: force,
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
    // SR4: Spirit of Man only raises agility and intuition; all other stats stay at base force
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
    default:
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
