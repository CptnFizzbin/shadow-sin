import type { Draft } from "immer"
import { produce } from "immer"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import { ImprovementsConfig } from "#/components/improvements/improvementsConfig.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import type { RunnerStore } from "#/stores/runner/runnerStore.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { RunnerData } from "#/system/runnerData.ts"
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
  QualityBuyOffEntry,
  SkillGroupIncreaseEntry,
  SkillIncreaseEntry,
  SkillSpecializationEntry,
} from "./improvementEntry.ts"
import type { ImprovementStore } from "./improvementStore.ts"
import { ImprovementType } from "./improvementType.ts"

export const applyImprovements = (
  improvementsStore: ImprovementStore,
  runnerStore: RunnerStore,
): void => {
  const improvementsState = improvementsStore.store.getState()

  runnerStore.setState(produce((sheet) => {
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
      return getRatingIncreaseCost(
        entry.baseRating,
        entry.newRating,
        ImprovementsConfig.attibutes.karmaCost.improve,
      )
    case ImprovementType.skillIncrease: {
      const costFn = entry.skillType === "ActiveSkill"
        ? ImprovementsConfig.skills.active.karmaCost.improve
        : ImprovementsConfig.skills.knowledge.karmaCost.improve
      if (entry.boostedByAptitude && entry.skillType === "ActiveSkill") {
        // SR4A p. 87: with Aptitude, raises past rating 6 cost double karma per step.
        return getAptitudeBoostedActiveSkillCost(entry.baseRating, entry.newRating, costFn)
      }
      return getRatingIncreaseCost(entry.baseRating, entry.newRating, costFn)
    }
    case ImprovementType.skillGroupIncrease:
      return getRatingIncreaseCost(
        entry.baseRating,
        entry.newRating,
        ImprovementsConfig.skills.group.karmaCost.improve,
      )
    case ImprovementType.skillSpecialization:
      return ImprovementsConfig.skills.active.karmaCost.specialization
    case ImprovementType.learnActiveSkill:
      return ImprovementsConfig.skills.active.karmaCost.learnNew
        + getRatingIncreaseCost(1, entry.skill.rating, ImprovementsConfig.skills.active.karmaCost.improve)
    case ImprovementType.learnSkillGroup:
      return ImprovementsConfig.skills.group.karmaCost.learnNew
        + getRatingIncreaseCost(1, entry.group.rating, ImprovementsConfig.skills.group.karmaCost.improve)
    case ImprovementType.learnKnowledgeSkill:
      return ImprovementsConfig.skills.knowledge.karmaCost.learnNew
        + getRatingIncreaseCost(1, entry.skill.rating, ImprovementsConfig.skills.knowledge.karmaCost.improve)
    case ImprovementType.learnLanguageSkill:
      return ImprovementsConfig.skills.language.karmaCost.learnNew
        + getRatingIncreaseCost(1, entry.skill.rating, ImprovementsConfig.skills.language.karmaCost.improve)
    case ImprovementType.learnSpell:
      return ImprovementsConfig.magic.spells.karmaCost.learnNew
    case ImprovementType.learnComplexForm:
      return ImprovementsConfig.technomancer.complexForms.karamCost.learnNew
    case ImprovementType.complexFormIncrease:
      return getRatingIncreaseCost(
        entry.baseRating,
        entry.newRating,
        ImprovementsConfig.technomancer.complexForms.karamCost.increase,
      )
    case ImprovementType.learnQuality:
      return ImprovementsConfig.qualities.positive.karmaCost.addQuality(entry.quality)
    case ImprovementType.qualityBuyOff:
      return ImprovementsConfig.qualities.negative.karamaCost.removeQuality({
        kind: EntityKind.quality,
        id: entry.qualityId,
        name: entry.qualityName,
        type: "negative",
        bpValue: entry.bpValue,
      })
    case ImprovementType.initiationIncrease:
      return ImprovementsConfig.magic.initiaition.karamaCost.improve(entry.newGrade)
    case ImprovementType.submersionIncrease:
      return ImprovementsConfig.technomancer.submersion.karamCost.improve(entry.newGrade)
  }
}

const getRatingIncreaseCost = (
  baseRating: number,
  newRating: number,
  costFn: (rating: number) => number,
) => {
  let totalKarma = 0
  let rating = baseRating

  while (rating < newRating) {
    rating++
    totalKarma += costFn(rating)
  }

  return totalKarma
}

const getAptitudeBoostedActiveSkillCost = (
  baseRating: number,
  newRating: number,
  costFn: (rating: number) => number,
) => {
  let totalKarma = 0
  let rating = baseRating

  while (rating < newRating) {
    rating++
    totalKarma += rating > 6 ? costFn(rating) * 2 : costFn(rating)
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
  sheet: Draft<RunnerData>,
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
    case ImprovementType.learnQuality:
      sheet.qualities.push(entry.quality)
      break
    case ImprovementType.qualityBuyOff:
      applyQualityBuyOff(sheet, entry)
      break
    case ImprovementType.initiationIncrease:
      sheet.initiateGrade = entry.newGrade
      break
    case ImprovementType.submersionIncrease:
      sheet.submersionGrade = entry.newGrade
      break
  }

  sheet.karma.current -= precomputedCost ?? getImprovementCost(entry)
}

const applyComplexFormIncrease = (
  sheet: Draft<RunnerData>,
  entry: ComplexFormIncreaseEntry,
) => {
  const complexForm = sheet.complexForms.find((cf) => cf.id === entry.complexFormId)
  if (!complexForm) throw new Error(`Complex form ${entry.complexFormId} not found on runner sheet`)
  complexForm.rating = entry.newRating
}

const applyQualityBuyOff = (sheet: Draft<RunnerData>, entry: QualityBuyOffEntry) => {
  const exists = sheet.qualities.some((quality) => quality.id === entry.qualityId)
  if (!exists) throw new Error(`Quality ${entry.qualityId} not found on runner sheet`)
  sheet.qualities = sheet.qualities.filter((quality) => quality.id !== entry.qualityId)
}

const applySkillIncrease = (sheet: Draft<RunnerData>, entry: SkillIncreaseEntry) => {
  let skillData: undefined | { rating?: number }

  if (entry.skillType === "ActiveSkill") {
    const skillGroup = skillList[entry.skill]
    if (skillGroup.group) breakSkillGroup(sheet, skillGroup.group)
    skillData = sheet.skills.activeSkills.find((skill) => entry.skill === skill.name)
    if (!skillData) throw new Error(`Skill ${entry.skill} not found on runner sheet`)
    skillData.rating = entry.newRating
  } else if (entry.skillType === "KnowledgeSkill") {
    skillData = sheet.skills.knowledgeSkills.find((skill) => entry.skill === skill.name)
    if (!skillData) throw new Error(`Knowledge ${entry.skill} not found on runner sheet`)
    skillData.rating = entry.newRating
  } else if (entry.skillType === "LanguageSkill") {
    skillData = sheet.skills.languageSkills.find((skill) => entry.skill === skill.name)
    if (!skillData) throw new Error(`Language ${entry.skill} not found on runner sheet`)
    skillData.rating = entry.newRating
  }
}

const applySpecialization = (sheet: Draft<RunnerData>, entry: SkillSpecializationEntry) => {
  let skillData: undefined | { specialization?: string } | { lingo?: string }

  if (entry.skillType === "ActiveSkill") {
    const skillGroup = skillList[entry.skill]
    if (skillGroup.group) breakSkillGroup(sheet, skillGroup.group)
    skillData = sheet.skills.activeSkills.find((skill) => entry.skill === skill.name)
    if (!skillData) throw new Error(`Skill ${entry.skill} not found on runner sheet`)
    skillData.specialization = entry.specialization
  } else if (entry.skillType === "KnowledgeSkill") {
    skillData = sheet.skills.knowledgeSkills.find((skill) => entry.skill === skill.name)
    if (!skillData) throw new Error(`Knowledge ${entry.skill} not found on runner sheet`)
    skillData.specialization = entry.specialization
  } else if (entry.skillType === "LanguageSkill") {
    skillData = sheet.skills.languageSkills.find((skill) => entry.skill === skill.name)
    if (!skillData) throw new Error(`Language ${entry.skill} not found on runner sheet`)
    skillData.lingo = entry.specialization
  }
}

const breakSkillGroup = (sheet: Draft<RunnerData>, group: SkillGroupKey): void => {
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

const applySkillGroupIncrease = (sheet: Draft<RunnerData>, entry: SkillGroupIncreaseEntry) => {
  const groupData = sheet.skills.skillGroups.find((g) => g.name === entry.group)
  if (!groupData) throw new Error(`Skill group ${entry.group} not found on runner sheet`)
  groupData.rating = entry.newRating
}

const applyLearnActiveSkill = (sheet: Draft<RunnerData>, entry: LearnActiveSkillEntry) => {
  const exists = sheet.skills.activeSkills.some((skill) => skill.name === entry.skill.name)
  if (exists) throw new Error(`Active skill ${entry.skill.name} already exists on runner sheet`)
  sheet.skills.activeSkills.push({ ...entry.skill })
}

const applyLearnSkillGroup = (sheet: Draft<RunnerData>, entry: LearnSkillGroupEntry) => {
  const exists = sheet.skills.skillGroups.some((group) => group.name === entry.group.name)
  if (exists) throw new Error(`Skill group ${entry.group.name} already exists on runner sheet`)
  sheet.skills.skillGroups.push({ ...entry.group })
}

const applyLearnKnowledgeSkill = (
  sheet: Draft<RunnerData>,
  entry: LearnKnowledgeSkillEntry,
) => {
  const exists = sheet.skills.knowledgeSkills.some((skill) => skill.name === entry.skill.name)
  if (exists) throw new Error(`Knowledge skill ${entry.skill.name} already exists on runner sheet`)
  sheet.skills.knowledgeSkills.push({ ...entry.skill })
}

const applyLearnLanguageSkill = (
  sheet: Draft<RunnerData>,
  entry: LearnLanguageSkillEntry,
) => {
  const exists = sheet.skills.languageSkills.some((skill) => skill.name === entry.skill.name)
  if (exists) throw new Error(`Language skill ${entry.skill.name} already exists on runner sheet`)
  sheet.skills.languageSkills.push({ ...entry.skill })
}
