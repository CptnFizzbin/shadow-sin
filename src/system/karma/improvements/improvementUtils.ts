import type { UUID } from "node:crypto"

import type { Draft } from "immer"
import { produce } from "immer"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import type { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import { describeImprovement } from "./improvementDescription.ts"
import type {
  ComplexFormIncreaseEntry,
  ImprovementEntry,
  LearnActiveSkillEntry,
  LearnKnowledgeSkillEntry,
  LearnLanguageSkillEntry,
  LearnSkillGroupEntry,
  SkillGroupIncreaseEntry,
  SkillIncreaseEntry,
  SkillSpecializationEntry,
} from "./improvementEntry.ts"
import type { ImprovementStore } from "./improvementStore.ts"
import { ImprovementType } from "./improvementType.ts"

// SR4A new-skill base karma costs (charged on top of any rating increases above 1).
const NEW_ACTIVE_SKILL_COST = 4
const NEW_SKILL_GROUP_COST = 10
const NEW_KNOWLEDGE_SKILL_COST = 2
const NEW_LANGUAGE_SKILL_COST = 2
const NEW_COMPLEX_FORM_COST = 2

// SR4A per-step karma multipliers (new rating × multiplier).
const ACTIVE_SKILL_KARMA_MULT = 2
const SKILL_GROUP_KARMA_MULT = 5
const KNOWLEDGE_LANGUAGE_KARMA_MULT = 1
const ATTRIBUTE_KARMA_MULT = 5
const COMPLEX_FORM_KARMA_MULT = 1

export const applyImprovements = (
  improvementsStore: ImprovementStore,
  characterStore: CharacterSheetStore,
): void => {
  const improvementsState = improvementsStore.store.state

  characterStore.setState(produce((sheet) => {
    for (const entry of Object.values(improvementsState)) {
      const cost = getImprovementCost(entry)
      applyImprovement(sheet, entry, cost)
      sheet.karma.log.push({
        id: crypto.randomUUID() as UUID,
        timestamp: new Date().toISOString(),
        amount: -cost,
        description: describeImprovement(entry),
        source: "spendKarma",
        improvement: entry,
      })
    }
  }))
}

export const getImprovementCost = (entry: ImprovementEntry) => {
  switch (entry.type) {
    case ImprovementType.attrIncrease:
      return getRatingIncreaseCost(entry.baseRating, entry.newRating, ATTRIBUTE_KARMA_MULT)
    case ImprovementType.skillIncrease: {
      const mult = entry.skillType === "ActiveSkill"
        ? ACTIVE_SKILL_KARMA_MULT
        : KNOWLEDGE_LANGUAGE_KARMA_MULT
      if (entry.boostedByAptitude && entry.skillType === "ActiveSkill") {
        // SR4A p. 87: with Aptitude, raises past rating 6 cost double karma per step.
        return getAptitudeBoostedActiveSkillCost(entry.baseRating, entry.newRating, mult)
      }
      return getRatingIncreaseCost(entry.baseRating, entry.newRating, mult)
    }
    case ImprovementType.skillGroupIncrease:
      return getRatingIncreaseCost(entry.baseRating, entry.newRating, SKILL_GROUP_KARMA_MULT)
    case ImprovementType.skillSpecialization:
      return 2
    case ImprovementType.learnActiveSkill:
      return NEW_ACTIVE_SKILL_COST
        + getRatingIncreaseCost(1, entry.skill.rating, ACTIVE_SKILL_KARMA_MULT)
    case ImprovementType.learnSkillGroup:
      return NEW_SKILL_GROUP_COST
        + getRatingIncreaseCost(1, entry.group.rating, SKILL_GROUP_KARMA_MULT)
    case ImprovementType.learnKnowledgeSkill:
      return NEW_KNOWLEDGE_SKILL_COST
        + getRatingIncreaseCost(1, entry.skill.rating, KNOWLEDGE_LANGUAGE_KARMA_MULT)
    case ImprovementType.learnLanguageSkill:
      return NEW_LANGUAGE_SKILL_COST
        + getRatingIncreaseCost(1, entry.skill.rating, KNOWLEDGE_LANGUAGE_KARMA_MULT)
    case ImprovementType.learnSpell:
      return 5
    case ImprovementType.learnComplexForm:
      return NEW_COMPLEX_FORM_COST
    case ImprovementType.complexFormIncrease:
      return getRatingIncreaseCost(entry.baseRating, entry.newRating, COMPLEX_FORM_KARMA_MULT)
  }
}

export const getRatingIncreaseCost = (baseRating: number, newRating: number, karmaMult: number) => {
  let totalKarma = 0
  let rating = baseRating

  while (rating < newRating) {
    rating++
    totalKarma += rating * karmaMult
  }

  return totalKarma
}

const getAptitudeBoostedActiveSkillCost = (
  baseRating: number,
  newRating: number,
  karmaMult: number,
) => {
  let totalKarma = 0
  let rating = baseRating

  while (rating < newRating) {
    rating++
    const stepMult = rating > 6 ? karmaMult * 2 : karmaMult
    totalKarma += rating * stepMult
  }

  return totalKarma
}
/**
 * Apply a single improvement to the sheet and deduct its karma cost. Pass
 * `precomputedCost` from `applyImprovements` to avoid recomputing the cost
 * (which `applyImprovements` already needs for the ledger entry). When called
 * directly, omit the argument and the cost is computed here.
 */
export const applyImprovement = (
  sheet: Draft<CharacterSheet>,
  entry: ImprovementEntry,
  precomputedCost?: number,
) => {
  switch (entry.type) {
    case ImprovementType.skillIncrease:
      applySkillIncrease(sheet, entry)
      break
    case ImprovementType.skillSpecialization:
      applySpecialization(sheet, entry)
      break
    case ImprovementType.skillGroupIncrease:
      applySkillGroupIncrease(sheet, entry)
      break
    case ImprovementType.attrIncrease:
      sheet.attributes[entry.attr] = entry.newRating
      break
    case ImprovementType.learnActiveSkill:
      applyLearnActiveSkill(sheet, entry)
      break
    case ImprovementType.learnSkillGroup:
      applyLearnSkillGroup(sheet, entry)
      break
    case ImprovementType.learnKnowledgeSkill:
      applyLearnKnowledgeSkill(sheet, entry)
      break
    case ImprovementType.learnLanguageSkill:
      applyLearnLanguageSkill(sheet, entry)
      break
    case ImprovementType.learnSpell:
      sheet.spells.push(entry.spell)
      break
    case ImprovementType.learnComplexForm:
      sheet.complexForms.push(entry.complexForm)
      break
    case ImprovementType.complexFormIncrease:
      applyComplexFormIncrease(sheet, entry)
      break
  }

  sheet.karma.current -= precomputedCost ?? getImprovementCost(entry)
}

const applyComplexFormIncrease = (
  sheet: Draft<CharacterSheet>,
  entry: ComplexFormIncreaseEntry,
) => {
  const complexForm = sheet.complexForms.find((cf) => cf.id === entry.complexFormId)
  if (!complexForm) throw new Error(`Complex form ${entry.complexFormId} not found on character sheet`)
  complexForm.rating = entry.newRating
}

const applySkillIncrease = (sheet: Draft<CharacterSheet>, entry: SkillIncreaseEntry) => {
  let skillData: undefined | { rating: number | "native" }

  if (entry.skillType === "ActiveSkill") {
    const skillGroup = skillList[entry.skill]
    if (skillGroup.group) breakSkillGroup(sheet, skillGroup.group)
    skillData = sheet.skills.activeSkills.find((skill) => entry.skill === skill.name)
    if (!skillData) throw new Error(`Skill ${entry.skill} not found on character sheet`)
    skillData.rating = entry.newRating
  } else if (entry.skillType === "KnowledgeSkill") {
    skillData = sheet.skills.knowledgeSkills.find((skill) => entry.skill === skill.name)
    if (!skillData) throw new Error(`Knowledge ${entry.skill} not found on character sheet`)
    skillData.rating = entry.newRating
  } else if (entry.skillType === "LanguageSkill") {
    skillData = sheet.skills.languageSkills.find((skill) => entry.skill === skill.name)
    if (!skillData) throw new Error(`Language ${entry.skill} not found on character sheet`)
    skillData.rating = entry.newRating
  }
}

const applySpecialization = (sheet: Draft<CharacterSheet>, entry: SkillSpecializationEntry) => {
  let skillData: undefined | { specialization?: string } | { lingo?: string }

  if (entry.skillType === "ActiveSkill") {
    const skillGroup = skillList[entry.skill]
    if (skillGroup.group) breakSkillGroup(sheet, skillGroup.group)
    skillData = sheet.skills.activeSkills.find((skill) => entry.skill === skill.name)
    if (!skillData) throw new Error(`Skill ${entry.skill} not found on character sheet`)
    skillData.specialization = entry.specialization
  } else if (entry.skillType === "KnowledgeSkill") {
    skillData = sheet.skills.knowledgeSkills.find((skill) => entry.skill === skill.name)
    if (!skillData) throw new Error(`Knowledge ${entry.skill} not found on character sheet`)
    skillData.specialization = entry.specialization
  } else if (entry.skillType === "LanguageSkill") {
    skillData = sheet.skills.languageSkills.find((skill) => entry.skill === skill.name)
    if (!skillData) throw new Error(`Language ${entry.skill} not found on character sheet`)
    skillData.lingo = entry.specialization
  }
}

const breakSkillGroup = (sheet: Draft<CharacterSheet>, group: SkillGroupKey): void => {
  const groupData = sheet.skills.skillGroups.find((g) => g.name === group)
  // No-op when the group isn't on the sheet — the skill being raised was
  // either learned standalone or the group was already broken.
  if (!groupData) return

  sheet.skills.skillGroups = sheet.skills.skillGroups.filter((g) => g.name !== group)

  const skillsInGroup = getSkillsInGroup(group)
  for (const skill of skillsInGroup) {
    const existingSkill = sheet.skills.activeSkills.find((s) => s.name === skill)
    if (!existingSkill) {
      sheet.skills.activeSkills.push({
        name: skill,
        rating: groupData.rating,
      })
    }
  }
}

const applySkillGroupIncrease = (sheet: Draft<CharacterSheet>, entry: SkillGroupIncreaseEntry) => {
  const groupData = sheet.skills.skillGroups.find((g) => g.name === entry.group)
  if (!groupData) throw new Error(`Skill group ${entry.group} not found on character sheet`)
  groupData.rating = entry.newRating
}

const applyLearnActiveSkill = (sheet: Draft<CharacterSheet>, entry: LearnActiveSkillEntry) => {
  const exists = sheet.skills.activeSkills.some((skill) => skill.name === entry.skill.name)
  if (exists) throw new Error(`Active skill ${entry.skill.name} already exists on character sheet`)
  sheet.skills.activeSkills.push({ ...entry.skill })
}

const applyLearnSkillGroup = (sheet: Draft<CharacterSheet>, entry: LearnSkillGroupEntry) => {
  const exists = sheet.skills.skillGroups.some((group) => group.name === entry.group.name)
  if (exists) throw new Error(`Skill group ${entry.group.name} already exists on character sheet`)
  sheet.skills.skillGroups.push({ ...entry.group })
}

const applyLearnKnowledgeSkill = (
  sheet: Draft<CharacterSheet>,
  entry: LearnKnowledgeSkillEntry,
) => {
  const exists = sheet.skills.knowledgeSkills.some((skill) => skill.name === entry.skill.name)
  if (exists) throw new Error(`Knowledge skill ${entry.skill.name} already exists on character sheet`)
  sheet.skills.knowledgeSkills.push({ ...entry.skill })
}

const applyLearnLanguageSkill = (
  sheet: Draft<CharacterSheet>,
  entry: LearnLanguageSkillEntry,
) => {
  const exists = sheet.skills.languageSkills.some((skill) => skill.name === entry.skill.name)
  if (exists) throw new Error(`Language skill ${entry.skill.name} already exists on character sheet`)
  sheet.skills.languageSkills.push({ ...entry.skill })
}
