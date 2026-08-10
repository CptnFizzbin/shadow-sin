import { AttributeKey, AttributeLabels } from "#/system/attributeKey.ts"
import { awakenings, MagicAwakeningTypes, TechAwakeningTypes } from "#/system/awakeningType.ts"
import { metatypes } from "#/system/metatypeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

// SR4A defaults (p. 87). The "optional rules" registry overrides can relax
// these in a future slice; for now the defaults are hard-coded.
export const BASE_ACTIVE_SKILL_CAP = 6
export const APTITUDE_ACTIVE_SKILL_CAP = 7
export const BASE_SKILL_GROUP_CAP = 6
export const BASE_KNOWLEDGE_SKILL_CAP = 6
export const BASE_LANGUAGE_SKILL_CAP = 6

/**
 * Match qualities whose name carries a parenthetical target, e.g.
 * `"Aptitude (Pistols)"` or `"Exceptional Attribute (Logic)"`. The convention
 * is brittle but matches the data shape currently used by hand-authored
 * runners (no structured cap-boost effect exists yet).
 */
const parenthesizedTargetRegex = /^([^(]+?)\s*\(\s*([^)]+?)\s*\)\s*$/

function parseQualityTarget(qualityName: string): { base: string, target: string } | null {
  const match = parenthesizedTargetRegex.exec(qualityName)
  if (!match) return null
  return { base: match[1].toLowerCase(), target: match[2].toLowerCase() }
}

/**
 * Returns true if the runner has the Aptitude quality targeting the given
 * skill. Uses name-pattern detection until a structured quality schema lands.
 */
export function hasAptitudeFor(sheet: RunnerData, skill: SkillKey | string): boolean {
  const skillName = String(skill).toLowerCase()
  return sheet.qualities.some((quality) => {
    const parsed = parseQualityTarget(quality.name)
    return parsed?.base === "aptitude" && parsed.target === skillName
  })
}

/**
 * Returns true if the runner has the Exceptional Attribute quality
 * targeting the given attribute. Matches either the attribute key
 * (`"logic"`) or its abbreviated label (`"LOG"`), case-insensitive.
 */
export function hasExceptionalAttributeFor(
  sheet: RunnerData,
  attr: AttributeKey,
): boolean {
  const attrName = attr.toLowerCase()
  const attrLabel = AttributeLabels[attr].toLowerCase()
  return sheet.qualities.some((quality) => {
    const parsed = parseQualityTarget(quality.name)
    if (parsed?.base !== "exceptional" && parsed?.base !== "exceptional attribute") return false
    return parsed.target === attrName || parsed.target === attrLabel
  })
}

export function getActiveSkillCap(sheet: RunnerData, skill: SkillKey): number {
  return hasAptitudeFor(sheet, skill) ? APTITUDE_ACTIVE_SKILL_CAP : BASE_ACTIVE_SKILL_CAP
}

export interface ActiveSkillCapFacets {
  cap: number
  hasAptitude: boolean
}

/**
 * Returns a lookup for the karma-spend rating cap and Aptitude status of any given Active Skill,
 * for call sites that need the answer for many skills in one render (e.g. a skill list) without
 * subscribing to the whole `RunnerData` sheet.
 */
export function selectActiveSkillCapLookup(sheet: RunnerData): (skill: SkillKey) => ActiveSkillCapFacets {
  return (skill) => ({
    cap: getActiveSkillCap(sheet, skill),
    hasAptitude: hasAptitudeFor(sheet, skill),
  })
}

export function getSkillGroupCap(): number {
  return BASE_SKILL_GROUP_CAP
}

export function getKnowledgeSkillCap(): number {
  return BASE_KNOWLEDGE_SKILL_CAP
}

export function getLanguageSkillCap(): number {
  return BASE_LANGUAGE_SKILL_CAP
}

/**
 * Returns the maximum rating an attribute can reach. Metatype maximum for
 * regular attributes (+1 if the runner has Exceptional Attribute targeting
 * it); awakening maximum for Magic and Resonance. Essence is treated as
 * uncapped here because it isn't a karma-spend target.
 */
export function getAttributeCap(sheet: RunnerData, attr: AttributeKey): number {
  if (attr === AttributeKey.essence) return 6

  const awakening = awakenings[sheet.biology.awakening]
  if (attr === AttributeKey.magic) {
    return MagicAwakeningTypes.includes(awakening.name) ? awakening.attributes.magic.max : 0
  }
  if (attr === AttributeKey.resonance) {
    return TechAwakeningTypes.includes(awakening.name) ? awakening.attributes.resonance.max : 0
  }

  const metatype = metatypes[sheet.biology.metatype]
  const baseCap = metatype.attributes[attr].max
  return hasExceptionalAttributeFor(sheet, attr) ? baseCap + 1 : baseCap
}

/**
 * Returns a lookup for the karma-spend rating cap of any given attribute, for call sites that
 * need the answer for many attributes in one render (e.g. an attribute list) without subscribing
 * to the whole `RunnerData` sheet.
 */
export function selectAttributeCapLookup(sheet: RunnerData): (attr: AttributeKey) => number {
  return (attr) => getAttributeCap(sheet, attr)
}
