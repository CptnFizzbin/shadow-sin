import { SkillKey } from "#/lib/system/SkillKey.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

export interface DicePoolItem {
  attr?: AttributeKey
  skill?: SkillKey
  flat?: { value: number, label: string }
}

export interface DicePoolData {
  key: string
  label: string
  items: DicePoolItem[]
}

export const DicePools = {
  "ranged-attack": {
    key: "ranged-attack",
    label: "Ranged Attack",
    items: [{ attr: AttributeKey.agility }, { skill: SkillKey.pistols }],
  },
  "melee-attack": {
    key: "melee-attack",
    label: "Melee Attack",
    items: [{ attr: AttributeKey.agility }, { skill: SkillKey.blades }],
  },
  "ranged-defense": {
    key: "ranged-defense",
    label: "Ranged Defense",
    items: [{ attr: AttributeKey.reaction }],
  },
  "melee-dodge": {
    key: "melee-dodge",
    label: "Melee Dodge",
    items: [{ attr: AttributeKey.reaction }, { skill: SkillKey.dodge }],
  },
  "resist-physical": {
    key: "resist-physical",
    label: "Resist Physical Damage",
    items: [{ attr: AttributeKey.body }],
  },
  "resist-stun": {
    key: "resist-stun",
    label: "Resist Stun Damage",
    items: [{ attr: AttributeKey.willpower }],
  },
  "perception": {
    key: "perception",
    label: "Perception",
    items: [{ attr: AttributeKey.intuition }, { skill: SkillKey.perception }],
  },
  "stealth": {
    key: "stealth",
    label: "Stealth",
    items: [{ attr: AttributeKey.agility }, { skill: SkillKey.infiltration }],
  },
  "initiative": {
    key: "initiative",
    label: "Initiative",
    items: [{ attr: AttributeKey.reaction }, { attr: AttributeKey.intuition }],
  },
  "composure": {
    key: "composure",
    label: "Composure",
    items: [{ attr: AttributeKey.willpower }, { attr: AttributeKey.charisma }],
  },
  "judge-intentions": {
    key: "judge-intentions",
    label: "Judge Intentions",
    items: [{ attr: AttributeKey.intuition }, { attr: AttributeKey.charisma }],
  },
  "memory": {
    key: "memory",
    label: "Memory",
    items: [{ attr: AttributeKey.logic }, { attr: AttributeKey.willpower }],
  },
  "lift-carry": {
    key: "lift-carry",
    label: "Lift / Carry",
    items: [{ attr: AttributeKey.body }, { attr: AttributeKey.strength }],
  },
} satisfies Record<string, DicePoolData>

export type DicePoolKey = keyof typeof DicePools
