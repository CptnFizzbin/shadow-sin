import type { SkillKey } from "#/lib/system/types/SkillKey.ts"
import { Skills } from "#/lib/system/types/SkillKey.ts"

export const SkillGroupNames = [
  "athletics",
  "biotech",
  "close combat",
  "conjuring",
  "cracking",
  "electronics",
  "firearms",
  "influence",
  "mechanic",
  "outdoors",
  "sorcery",
  "stealth",
  "tasking",
] as const

export type SkillGroupName = (typeof SkillGroupNames)[number]

export const SkillGroupDisplayNames: Record<SkillGroupName, string> = {
  athletics: "Athletics",
  biotech: "Biotech",
  "close combat": "Close Combat",
  conjuring: "Conjuring",
  cracking: "Cracking",
  electronics: "Electronics",
  firearms: "Firearms",
  influence: "Influence",
  mechanic: "Mechanic",
  outdoors: "Outdoors",
  sorcery: "Sorcery",
  stealth: "Stealth",
  tasking: "Tasking",
}

export const getSkillsInGroup = (groupName: string): SkillKey[] => {
  return Object.entries(Skills)
    .filter(([, skillData]) => skillData.group === groupName)
    .map(([key]) => key as SkillKey)
}
