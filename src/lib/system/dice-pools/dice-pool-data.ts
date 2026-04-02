import { AttributeKey } from "#/lib/system/attribute-key.ts"
import type { SkillKey } from "#/lib/system/skill-key.ts"

export interface DicePoolItem {
  attr?: AttributeKey
  skill?: SkillKey
  flat?: { value: number, label: string }
}

export interface DicePoolData {
  label: string
  items: DicePoolItem[]
}

export const dicePoolKeys = {
  ResistDamage: {
    Body: "ResistDamage.Body",
    Willpower: "ResistDamage.Willpower",
  },
} as const

export const dicePools = {
  [dicePoolKeys.ResistDamage.Body]: {
    label: "Resist Damage",
    items: [
      { attr: AttributeKey.body },
    ],
  },
  [dicePoolKeys.ResistDamage.Willpower]: {
    label: "Resist Damage",
    items: [
      { attr: AttributeKey.willpower },
    ],
  },
} as const satisfies Record<string, DicePoolData>

export type DicePoolKey = keyof typeof dicePools
