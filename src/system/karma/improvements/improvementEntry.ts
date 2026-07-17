import type { UUID } from "node:crypto"

import type { AttributeKey } from "#/system/attributeKey.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"
import type { SpellData } from "#/system/magic/spellData.ts"
import type { QualityData } from "#/system/qualityData.ts"
import type { ActiveSkillData } from "#/system/skills/activeSkillData.ts"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/system/skills/languageSkillData.ts"
import type { SkillGroupData } from "#/system/skills/skillGroupData.ts"
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
  /**
   * When raising an Active Skill above 6 via the Aptitude quality, each step
   * past rating 6 costs double Karma. Set by the queueing UI when applicable.
   */
  boostedByAptitude?: boolean
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

export interface ComplexFormIncreaseEntry extends BaseImprovementEntry {
  type: ImprovementType.complexFormIncrease
  complexFormId: string
  baseRating: number
  newRating: number
}

export function isComplexFormIncreaseEntry(entry: ImprovementEntry): entry is ComplexFormIncreaseEntry {
  return entry.type === ImprovementType.complexFormIncrease
}

export interface LearnActiveSkillEntry extends BaseImprovementEntry {
  type: ImprovementType.learnActiveSkill
  skill: ActiveSkillData
}

export function isLearnActiveSkillEntry(entry: ImprovementEntry): entry is LearnActiveSkillEntry {
  return entry.type === ImprovementType.learnActiveSkill
}

export interface LearnSkillGroupEntry extends BaseImprovementEntry {
  type: ImprovementType.learnSkillGroup
  group: SkillGroupData
}

export function isLearnSkillGroupEntry(entry: ImprovementEntry): entry is LearnSkillGroupEntry {
  return entry.type === ImprovementType.learnSkillGroup
}

export interface LearnKnowledgeSkillEntry extends BaseImprovementEntry {
  type: ImprovementType.learnKnowledgeSkill
  skill: KnowledgeSkillData
}

export function isLearnKnowledgeSkillEntry(
  entry: ImprovementEntry,
): entry is LearnKnowledgeSkillEntry {
  return entry.type === ImprovementType.learnKnowledgeSkill
}

// Native languages cannot be learned with karma (SR4A); the entry's rating is
// always numeric. This narrows `LanguageSkillData["rating"]` from `number | "native"`.
export type LearnableLanguageSkillData = Omit<LanguageSkillData, "rating"> & { rating: number }

export interface LearnLanguageSkillEntry extends BaseImprovementEntry {
  type: ImprovementType.learnLanguageSkill
  skill: LearnableLanguageSkillData
}

export function isLearnLanguageSkillEntry(
  entry: ImprovementEntry,
): entry is LearnLanguageSkillEntry {
  return entry.type === ImprovementType.learnLanguageSkill
}

export interface LearnQualityEntry extends BaseImprovementEntry {
  type: ImprovementType.learnQuality
  quality: QualityData
}

export function isLearnQualityEntry(entry: ImprovementEntry): entry is LearnQualityEntry {
  return entry.type === ImprovementType.learnQuality
}

/**
 * Buys off (removes) an existing negative Quality. `qualityName`/`bpValue`
 * snapshot the quality at queue time so cost and ledger description don't
 * need to re-read the sheet after the quality has been removed.
 */
export interface QualityBuyOffEntry extends BaseImprovementEntry {
  type: ImprovementType.qualityBuyOff
  qualityId: UUID
  qualityName: string
  bpValue: number
}

export function isQualityBuyOffEntry(entry: ImprovementEntry): entry is QualityBuyOffEntry {
  return entry.type === ImprovementType.qualityBuyOff
}

export interface InitiationIncreaseEntry extends BaseImprovementEntry {
  type: ImprovementType.initiationIncrease
  baseGrade: number
  newGrade: number
}

export function isInitiationIncreaseEntry(entry: ImprovementEntry): entry is InitiationIncreaseEntry {
  return entry.type === ImprovementType.initiationIncrease
}

export interface SubmersionIncreaseEntry extends BaseImprovementEntry {
  type: ImprovementType.submersionIncrease
  baseGrade: number
  newGrade: number
}

export function isSubmersionIncreaseEntry(entry: ImprovementEntry): entry is SubmersionIncreaseEntry {
  return entry.type === ImprovementType.submersionIncrease
}

export type ImprovementEntry =
  | AttrIncreaseEntry
  | SkillIncreaseEntry
  | SkillSpecializationEntry
  | SkillGroupIncreaseEntry
  | LearnActiveSkillEntry
  | LearnSkillGroupEntry
  | LearnKnowledgeSkillEntry
  | LearnLanguageSkillEntry
  | LearnSpellEntry
  | LearnComplexFormEntry
  | ComplexFormIncreaseEntry
  | LearnQualityEntry
  | QualityBuyOffEntry
  | InitiationIncreaseEntry
  | SubmersionIncreaseEntry
