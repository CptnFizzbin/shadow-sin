import type { AttributeKey } from "#/system/attributeKey.ts"

export interface SkillEntry {
  name: string
  pool: number
}

export interface WeaponEntry {
  name: string
  pool: number
  dv: string
  ap: string
  modes?: string
}

export interface DamageTrack {
  label: string
  boxes: number
  filled: number
  woundMod: number
}

export interface Combatant {
  id: string
  name: string
  isPC: boolean
  score: number
  totalPasses: number
  passesCompleted: number[]
  initiativeDice?: number
  attributes?: Partial<Record<AttributeKey, number>>
  skills?: SkillEntry[]
  armor?: string
  resistBod?: number
  resistWil?: number
  damageTracks?: DamageTrack[]
  weapons?: WeaponEntry[]
}

const gruntAttributes = {
  body: 6, agility: 6, reaction: 6, strength: 6, charisma: 6, intuition: 6, logic: 6, willpower: 6,
}

export const MOCK_COMBATANTS: Combatant[] = [
  {
    id: "grunt",
    name: "ShinSec Grunt",
    isPC: false,
    score: 12,
    initiativeDice: 10,
    totalPasses: 1,
    passesCompleted: [],
    attributes: gruntAttributes,
  },
  {
    id: "mage",
    name: "ShinSec Mage",
    isPC: false,
    score: 12,
    initiativeDice: 10,
    totalPasses: 4,
    passesCompleted: [],
    attributes: { ...gruntAttributes, magic: 6 },
    skills: [
      { name: "Skill 1", pool: 5 },
      { name: "Skill 2", pool: 4 },
      { name: "Skill 3", pool: 4 },
      { name: "Skill 4", pool: 3 },
    ],
    armor: "8/6",
    resistBod: 6,
    resistWil: 6,
    damageTracks: [
      { label: "1", boxes: 8, filled: 0, woundMod: 0 },
      { label: "2", boxes: 8, filled: 0, woundMod: 0 },
      { label: "3", boxes: 8, filled: 0, woundMod: 0 },
    ],
    weapons: [
      { name: "Rifle", pool: 14, dv: "7", ap: "1", modes: "SA/BF/FA" },
      { name: "Sword", pool: 12, dv: "3", ap: "1" },
    ],
  },
  {
    id: "daniel",
    name: "Daniel Jackson",
    isPC: true,
    score: 12,
    totalPasses: 3,
    passesCompleted: [],
    attributes: { ...gruntAttributes, magic: 6 },
  },
  {
    id: "leader",
    name: "ShinSec Leader",
    isPC: false,
    score: 12,
    initiativeDice: 10,
    totalPasses: 3,
    passesCompleted: [],
    attributes: gruntAttributes,
  },
]
