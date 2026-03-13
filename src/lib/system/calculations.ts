import type { ArmorPiece, LedgerEntry, RunnerCharacter, RunnerSkill, SkillCategory, WeaponProfile } from "./types"
import type { AttributeKey } from "./types/attributeKey"
import { AttributeOrder } from "./types/attributeKey"
import type { AwakeningType } from "./types/awakeningType"

export const AwakeningLevel: Record<AwakeningType, string> = {
  mundane: "Mundane",
  adept: "Adept",
  magician: "Magician",
  shaman: "Shaman",
  technomancer: "Technomancer"
}

export const SkillCategoryLabels: Record<SkillCategory, string> = {
  active: "Active",
  knowledge: "Knowledge",
  language: "Languages"
}

export function getVisibleAttributes (
  character: RunnerCharacter
): AttributeKey[] {
  return AttributeOrder.filter((attribute) => {
    if (attribute === "magic") {
      return character.attributes.magic !== undefined
    }

    if (attribute === "resonance") {
      return character.attributes.resonance !== undefined
    }

    return true
  })
}

export function getDamageTrackMax (attributeValue: number): number {
  return 8 + Math.ceil(attributeValue / 2)
}

export function getPhysicalTrackMax (character: RunnerCharacter): number {
  return getDamageTrackMax(character.attributes.body)
}

export function getStunTrackMax (character: RunnerCharacter): number {
  return getDamageTrackMax(character.attributes.willpower)
}

export function getCurrentEdge (character: RunnerCharacter): number {
  return character.currentEdge ?? character.attributes.edge
}

export function getWoundModifier (character: RunnerCharacter): number {
  const pressure = Math.max(character.damage.physical, character.damage.stun)
  return -Math.floor(pressure / 3)
}

export function getInitiativeScore (character: RunnerCharacter): number {
  return character.attributes.reaction + character.attributes.intuition
}

export function getAstralInitiative (character: RunnerCharacter): number | null {
  if (
    character.awakening === "adept" ||
    character.awakening === "magician" ||
    character.awakening === "shaman"
  ) {
    return character.attributes.intuition * 2
  }

  return null
}

export function getArmorTotals (armor: ArmorPiece[]): {
  ballistic: number;
  impact: number;
} {
  return armor
    .filter((entry) => entry.equipped ?? true)
    .reduce(
      (totals, entry) => ({
        ballistic: totals.ballistic + entry.ballistic,
        impact: totals.impact + entry.impact
      }),
      { ballistic: 0, impact: 0 }
    )
}

export function formatCurrency (amount: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(amount)
}

export function sumLedger (entries: LedgerEntry[]): number {
  return entries.reduce((total, entry) => total + entry.amount, 0)
}

export function getSkillRating (
  character: RunnerCharacter,
  skillName: string
): number {
  return (
    character.skills.find((skill) => skill.name === skillName)?.rating ?? 0
  )
}

export function getWeaponDicePool (
  character: RunnerCharacter,
  weapon: WeaponProfile
): number {
  const linkedAttribute = character.attributes[weapon.linkedAttribute] ?? 0
  return (
    linkedAttribute +
    getSkillRating(character, weapon.skill) +
    getWoundModifier(character)
  )
}

export function groupSkills (
  skills: RunnerSkill[]
): Record<SkillCategory, RunnerSkill[]> {
  return {
    active: skills
      .filter((skill) => skill.category === "active")
      .sort((left, right) => left.name.localeCompare(right.name)),
    knowledge: skills
      .filter((skill) => skill.category === "knowledge")
      .sort((left, right) => left.name.localeCompare(right.name)),
    language: skills
      .filter((skill) => skill.category === "language")
      .sort((left, right) => left.name.localeCompare(right.name))
  }
}

export function formatLedgerDate (value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}
