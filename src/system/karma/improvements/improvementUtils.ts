import type { Draft } from "immer"
import { produce } from "immer"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import type { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { skillList } from "#/system/skills/skillList.ts"

import type {
  ImprovementEntry,
  SkillGroupIncreaseEntry,
  SkillIncreaseEntry,
  SkillSpecializationEntry,
} from "./improvementEntry.ts"
import type { ImprovementStore } from "./improvementStore.ts"
import { ImprovementType } from "./improvementType.ts"

export const applyImprovements = (
  improvementsStore: ImprovementStore,
  characterStore: CharacterSheetStore,
): void => {
  const improvementsState = improvementsStore.store.state

  characterStore.setState(produce((sheet) => {
    for (const entry of Object.values(improvementsState)) {
      applyImprovement(sheet, entry)
    }
  }))
}

export const getImprovementCost = (entry: ImprovementEntry) => {
  switch (entry.type) {
    case ImprovementType.attrIncrease:
      return getRatingIncreaseCost(entry.baseRating, entry.newRating, 5)
    case ImprovementType.skillIncrease:
      return getRatingIncreaseCost(entry.baseRating, entry.newRating, 2)
    case ImprovementType.skillGroupIncrease:
      return getRatingIncreaseCost(entry.baseRating, entry.newRating, 2)
    case ImprovementType.skillSpecialization:
      return 2
    case ImprovementType.learnSpell:
      return 5
    case ImprovementType.learnComplexForm:
      return 5
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
export const applyImprovement = (sheet: Draft<CharacterSheet>, entry: ImprovementEntry) => {
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
    case ImprovementType.learnSpell:
      sheet.spells.push(entry.spell)
      break
    case ImprovementType.learnComplexForm:
      sheet.complexForms.push(entry.complexForm)
      break
  }

  sheet.karma.current -= getImprovementCost(entry)
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
  if (!groupData) throw new Error(`Skill group ${group} not found on character sheet`)

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
