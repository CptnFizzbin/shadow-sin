import type { UUID } from "node:crypto"

import { z } from "zod"

import { AttributeKey } from "#/system/attributeKey.ts"
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
  [SpiritType.watcher]: ["Tiny Watcher", "Keen Watcher", "Elder Watcher", "Ancient Watcher"],
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
  id: z.uuid() as z.ZodType<UUID>,
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
    physical: 8 + Math.ceil(attrs[AttributeKey.body] / 2),
    stun: 8 + Math.ceil(attrs[AttributeKey.willpower] / 2),
  }
}

// Attribute offsets from force for each spirit type. Resonance and the four Matrix stats are
// always 0 — spirits have no Matrix presence.
const baseAttrOffsets: Record<AttributeKey, number> = {
  body: 0, agility: 0, reaction: 0, strength: 0,
  charisma: 0, intuition: 0, logic: 0, willpower: 0,
  edge: 0, magic: 0, essence: 0, resonance: 0,
  firewall: 0, response: 0, signal: 0, system: 0,
}

// Attribute keys that stay pinned at 0 regardless of Force — Resonance (spirits are never
// Technomancer-aligned) and the four Matrix stats (spirits have no Matrix presence).
const zeroPinnedAttrKeys: AttributeKey[] = [
  AttributeKey.resonance,
  AttributeKey.firewall,
  AttributeKey.response,
  AttributeKey.signal,
  AttributeKey.system,
]

const spiritAttributeOffsets: Record<SpiritType, Record<AttributeKey, number>> = {
  [SpiritType.wind]: { ...baseAttrOffsets, body: -2, agility: 3, reaction: 4, strength: -3 },
  [SpiritType.beast]: { ...baseAttrOffsets, body: 2, agility: 1, reaction: 2, strength: 2 },
  [SpiritType.earth]: { ...baseAttrOffsets, body: 4, agility: -2, reaction: -2, strength: 4, intuition: -1 },
  [SpiritType.fire]: { ...baseAttrOffsets, body: 1, agility: 2, reaction: 3, strength: -2 },
  [SpiritType.guidance]: { ...baseAttrOffsets, body: 3, agility: -1, reaction: 2, strength: 1 },
  [SpiritType.guardian]: { ...baseAttrOffsets, body: 1, agility: 2, reaction: 3, strength: 2 },
  // SR4A: Spirit of Man only raises agility and intuition; all other attrs stay at base force
  [SpiritType.man]: { ...baseAttrOffsets, agility: 2, intuition: 1 },
  [SpiritType.plant]: { ...baseAttrOffsets, body: 3, agility: -1, reaction: 2, strength: 4 },
  [SpiritType.task]: { ...baseAttrOffsets, reaction: 2, strength: 2 },
  [SpiritType.water]: { ...baseAttrOffsets, agility: 1, reaction: 2, strength: -1 },
  [SpiritType.watcher]: baseAttrOffsets,
}

export function calculateSpiritAttributes(force: number, type: SpiritType): Record<AttributeKey, number> {
  if (type === SpiritType.watcher) {
    const half = Math.floor(force / 2)
    return {
      [AttributeKey.body]: Math.max(1, half),
      [AttributeKey.agility]: Math.max(1, half),
      [AttributeKey.reaction]: Math.max(1, half),
      [AttributeKey.strength]: Math.max(1, half),
      [AttributeKey.charisma]: Math.max(1, half),
      [AttributeKey.intuition]: Math.max(1, half),
      [AttributeKey.logic]: Math.max(1, half),
      [AttributeKey.willpower]: Math.max(1, half),
      [AttributeKey.edge]: 0,
      [AttributeKey.magic]: force,
      [AttributeKey.essence]: force,
      [AttributeKey.resonance]: 0,
      [AttributeKey.firewall]: 0,
      [AttributeKey.response]: 0,
      [AttributeKey.signal]: 0,
      [AttributeKey.system]: 0,
    }
  }

  const offsets = spiritAttributeOffsets[type]
  const attrs: Record<AttributeKey, number> = {
    [AttributeKey.body]: force + offsets.body,
    [AttributeKey.agility]: force + offsets.agility,
    [AttributeKey.reaction]: force + offsets.reaction,
    [AttributeKey.strength]: force + offsets.strength,
    [AttributeKey.charisma]: force + offsets.charisma,
    [AttributeKey.intuition]: force + offsets.intuition,
    [AttributeKey.logic]: force + offsets.logic,
    [AttributeKey.willpower]: force + offsets.willpower,
    [AttributeKey.edge]: force + offsets.edge,
    [AttributeKey.magic]: force + offsets.magic,
    [AttributeKey.essence]: force + offsets.essence,
    [AttributeKey.resonance]: 0,
    [AttributeKey.firewall]: 0,
    [AttributeKey.response]: 0,
    [AttributeKey.signal]: 0,
    [AttributeKey.system]: 0,
  }

  for (const key of Object.keys(attrs) as AttributeKey[]) {
    if (!zeroPinnedAttrKeys.includes(key) && attrs[key] < 1) {
      attrs[key] = 1
    }
  }

  return attrs
}
