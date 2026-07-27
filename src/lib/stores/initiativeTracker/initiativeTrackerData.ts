import type { UUID } from "node:crypto"

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
  id: UUID
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

export interface InitiativeTrackerState {
  combatants: Combatant[]
  round: number
  currentTurnId: UUID | null
}

/** Turn order: highest score first. Shared by the reducer and the selectors so both agree. */
export function sortCombatants(combatants: Combatant[]): Combatant[] {
  return [...combatants].sort((a, b) => b.score - a.score)
}
