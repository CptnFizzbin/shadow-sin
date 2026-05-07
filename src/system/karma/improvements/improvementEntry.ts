import type { UUID } from "node:crypto"

import type { AttributeKey } from "#/system/attributeKey.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"
import type { SpellData } from "#/system/magic/spellData.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { ImprovementType } from "./improvementType.ts"

export interface BaseImprovementEntry {
  id: UUID
  type: ImprovementType
}

export interface AttrIncreaseEntry extends BaseImprovementEntry {
  type: ImprovementType.attrIncrease
  attr: AttributeKey
  baseRating: number
  newRating: number
}

export function isAttrIncreaseEntry(entry: ImprovementEntry): entry is AttrIncreaseEntry {
  return entry.type === ImprovementType.attrIncrease
}

export interface SkillIncreaseEntry extends BaseImprovementEntry {
  type: ImprovementType.skillIncrease
  skillType: "ActiveSkill" | "KnowledgeSkill" | "LanguageSkill"
  skill: SkillKey
  baseRating: number
  newRating: number
}

export function isSkillIncreaseEntry(entry: ImprovementEntry): entry is SkillIncreaseEntry {
  return entry.type === ImprovementType.skillIncrease
}

export interface SkillSpecializationEntry extends BaseImprovementEntry {
  type: ImprovementType.skillSpecialization
  skillType: "ActiveSkill" | "KnowledgeSkill" | "LanguageSkill"
  skill: SkillKey
  specialization: string
}

export function isSkillSpecializationEntry(entry: ImprovementEntry): entry is SkillSpecializationEntry {
  return entry.type === ImprovementType.skillSpecialization
}

export interface SkillGroupIncreaseEntry extends BaseImprovementEntry {
  type: ImprovementType.skillGroupIncrease
  group: SkillGroupKey
  baseRating: number
  newRating: number
}

export function isSkillGroupIncreaseEntry(entry: ImprovementEntry): entry is SkillGroupIncreaseEntry {
  return entry.type === ImprovementType.skillGroupIncrease
}

export interface LearnSpellEntry extends BaseImprovementEntry {
  type: ImprovementType.learnSpell
  spell: SpellData
}

export function isLearnSpellEntry(entry: ImprovementEntry): entry is LearnSpellEntry {
  return entry.type === ImprovementType.learnSpell
}

export interface LearnComplexFormEntry extends BaseImprovementEntry {
  type: ImprovementType.learnComplexForm
  complexForm: ComplexFormData
}

export function isLearnComplexFormEntry(entry: ImprovementEntry): entry is LearnComplexFormEntry {
  return entry.type === ImprovementType.learnComplexForm
}

export type ImprovementEntry =
  | AttrIncreaseEntry
  | SkillIncreaseEntry
  | SkillSpecializationEntry
  | SkillGroupIncreaseEntry
  | LearnSpellEntry
  | LearnComplexFormEntry
