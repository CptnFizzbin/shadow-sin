import { z } from "zod"

import type { UUID } from "#/lib/uuidUtils.ts"
import { AttrKey } from "#/system/attributeKey.ts"
import type { AttributeCatalog } from "#/system/attributes/attributeCatalog.ts"
import type { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { EntityDamage } from "#/system/entityData.ts"
import { EntityKind } from "#/system/entityKind.ts"

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
  watcher = "watcher",
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
  [SpiritType.watcher]: ["Watcher", "Watcher", "Watcher", "Watcher"],
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
  [SpiritType.watcher]: "Watcher",
}

// Plural form used for Conjuring (Summoning/Binding/Banishing) specializations
// where the skill targets a category of spirits rather than a single one.
export const SpiritTypePluralLabels: Record<SpiritType, string> = {
  [SpiritType.wind]: "Spirits of Air",
  [SpiritType.beast]: "Spirits of Beasts",
  [SpiritType.earth]: "Spirits of Earth",
  [SpiritType.fire]: "Spirits of Fire",
  [SpiritType.guidance]: "Guidance Spirits",
  [SpiritType.guardian]: "Guardian Spirits",
  [SpiritType.man]: "Spirits of Man",
  [SpiritType.plant]: "Plant Spirits",
  [SpiritType.task]: "Task Spirits",
  [SpiritType.water]: "Spirits of Water",
  [SpiritType.watcher]: "Watchers",
}

export interface SpiritData {
  kind: EntityKind.spirit
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
  damage: EntityDamage<DamageTrackKey.physical | DamageTrackKey.stun>
}

export const SpiritDataSchema = z.object({
  kind: z.literal(EntityKind.spirit),
  id: z.uuid(),
  name: z.string(),
  spiritType: z.enum(SpiritType),
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
}).superRefine(({ spiritType, force }, ctx) => {
  if (spiritType === SpiritType.watcher && force !== 1) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["force"], message: "Watchers always have Force 1" })
  }
}) satisfies z.ZodType<SpiritData>

// SR4A p.295-302: physical initiative bonus added to F×2, keyed by spirit type.
const physicalInitBonus: Record<SpiritType, number> = {
  [SpiritType.wind]: 3,
  [SpiritType.fire]: 3,
  [SpiritType.guardian]: 1,
  [SpiritType.guidance]: 0,
  [SpiritType.plant]: 0,
  [SpiritType.task]: 0,
  [SpiritType.beast]: 2,
  [SpiritType.earth]: 2,
  [SpiritType.man]: 2,
  [SpiritType.water]: 2,
  [SpiritType.watcher]: 0,
}

// SR4A p.295-302: spirit initiative is a flat score, not a dice roll.
// Astral initiative = F×2, 3 IP. Watchers: fixed Init 2 (3 IP), astral 2 (3 IP).
export function calculateSpiritInitiative(force: number, type: SpiritType) {
  if (type === SpiritType.watcher) {
    return { physicalScore: 2, physicalIp: 3, astralBase: 2, astralIp: 3 }
  }
  return {
    physicalScore: force * 2 + physicalInitBonus[type],
    physicalIp: 2,
    astralBase: force * 2,
    astralIp: 3,
  }
}

export function calculateSpiritConditionMonitor(force: number, type: SpiritType): { physical: number, stun: number } {
  const attrs = calculateSpiritAttributes(force, type)
  return {
    physical: 8 + Math.ceil(attrs[AttrKey.body] / 2),
    stun: 8 + Math.ceil(attrs[AttrKey.willpower] / 2),
  }
}

export type SpiritAttrKey =
  | AttrKey.body
  | AttrKey.agility
  | AttrKey.reaction
  | AttrKey.strength
  | AttrKey.charisma
  | AttrKey.intuition
  | AttrKey.logic
  | AttrKey.willpower
  | AttrKey.edge
  | AttrKey.magic
  | AttrKey.essence

export type SpiritAttributeCatalog =
  AttributeCatalog
  & Pick<
    Required<AttributeCatalog>,
    SpiritAttrKey
  >

const spiritAttributeOffsets: Record<SpiritType, AttributeCatalog> = {
  [SpiritType.wind]: {
    body: -2,
    agility: +3,
    reaction: +4,
    strength: -3,
  },
  [SpiritType.beast]: {
    body: +2,
    agility: +1,
    reaction: +2,
    strength: +2,
  },
  [SpiritType.earth]: {
    body: +4,
    agility: -2,
    reaction: -2,
    strength: +4,
    intuition: -1,
  },
  [SpiritType.fire]: {
    body: +1,
    agility: +2,
    reaction: +3,
    strength: -2,
  },
  [SpiritType.guidance]: {
    body: +3,
    agility: -1,
    reaction: +2,
    strength: +1,
  },
  [SpiritType.guardian]: {
    body: +1,
    agility: +2,
    reaction: +3,
    strength: +2,
  },
  [SpiritType.man]: {
    agility: 2,
    intuition: 1,
  },
  [SpiritType.plant]: {
    body: 3,
    agility: -1,
    reaction: 2,
    strength: 4,
  },
  [SpiritType.task]: {
    reaction: 2,
    strength: 2,
  },
  [SpiritType.water]: {
    agility: 1,
    reaction: 2,
    strength: -1,
  },
  [SpiritType.watcher]: {},
}

export function calculateSpiritAttributes(force: number, type: SpiritType): SpiritAttributeCatalog {
  const baseAttrs: SpiritAttributeCatalog = {
    [AttrKey.body]: 1,
    [AttrKey.agility]: 1,
    [AttrKey.reaction]: 1,
    [AttrKey.strength]: 1,
    [AttrKey.charisma]: 1,
    [AttrKey.intuition]: 1,
    [AttrKey.logic]: 1,
    [AttrKey.willpower]: 1,
    [AttrKey.edge]: 0,
    [AttrKey.magic]: 1,
    [AttrKey.essence]: 1,
  }

  if (type === SpiritType.watcher) {
    // Watcher always has the base minimum attributes
    return baseAttrs
  }

  const attrs = { ...baseAttrs }

  const offsets = spiritAttributeOffsets[type]
  for (const attrKey of Object.keys(baseAttrs) as SpiritAttrKey[]) {
    const offset = offsets[attrKey] ?? 0
    attrs[attrKey] = Math.max(baseAttrs[attrKey] ?? 0, force + offset)
  }

  return attrs
}
