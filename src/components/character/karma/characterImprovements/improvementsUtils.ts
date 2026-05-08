import type { Draft } from "immer"
import { produce } from "immer"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import type { KarmaStore } from "#/components/character/karma/karmaStore.ts"
import type { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"

import type { ImprovementsStore } from "./improvementsStore.ts"
import type { ActiveSkillImprovement } from "./types/activeSkillImprovement.ts"
import type { AttributeImprovement } from "./types/attributeImprovement.ts"
import { ImprovementType } from "./types/improvementType.ts"
import type { KnowledgeSkillImprovement } from "./types/knowledgeSkillImprovement.ts"
import type { LanguageSkillImprovement } from "./types/languageSkillImprovement.ts"
import type { LearnSpellImprovement } from "./types/learnSpellImprovement.ts"
import type { SkillGroupImprovement } from "./types/skillGroupImprovement.ts"

const applyImprovements = (
  improvementsStore: ImprovementsStore,
  characterStore: CharacterSheetStore,
) => {
  return characterStore.setState(produce((sheet) => {
    const { improvements } = improvementsStore.store.get()

    improvements.forEach((improvement) => {
      switch (improvement.type) {
        case ImprovementType.Attribute:
          applyAttributeImprovement(sheet, improvement)
          break
        case ImprovementType.ActiveSkill:
          applyActiveSkillImprovement(sheet, improvement)
          break
        case ImprovementType.SkillGroup:
          applySkillGroupImprovement(sheet, improvement)
          break
        case ImprovementType.KnowledgeSkill:
          applyKnowledgeSkillImprovement(sheet, improvement)
          break
        case ImprovementType.LanguageSkill:
          applyLanguageSkillImprovement(sheet, improvement)
          break
        case ImprovementType.LearnSpell:
          applySpellImprovement(sheet, improvement)
          break
        default:
          break
      }
    })
  }))
}

export const applyImprovementsAndSpendKarma = (
  improvementsStore: ImprovementsStore,
  characterStore: CharacterSheetStore,
  karmaStore: KarmaStore,
  karmaCost: number,
): void => {
  applyImprovements(improvementsStore, characterStore)
  karmaStore.spendKarma(karmaCost)
}

const applyAttributeImprovement = (
  sheet: Draft<CharacterSheet>,
  improvement: AttributeImprovement,
): void => {
  sheet.attributes[improvement.attribute] = improvement.newRating
}

const applyActiveSkillImprovement = (
  sheet: Draft<CharacterSheet>,
  improvement: ActiveSkillImprovement,
): void => {
  // Auto-break any skill group that covers this skill before applying the improvement
  const coveringGroup = sheet.skills.skillGroups.find((group) =>
    getSkillsInGroup(group.name as SkillGroupKey).includes(improvement.skill),
  )

  if (coveringGroup) {
    const groupRating = coveringGroup.rating
    const skillsInGroup = getSkillsInGroup(coveringGroup.name as SkillGroupKey)

    for (const memberSkillKey of skillsInGroup) {
      const existingSkill = sheet.skills.activeSkills.find((s) => s.name === memberSkillKey)
      if (existingSkill) {
        existingSkill.rating = Math.max(existingSkill.rating, groupRating)
      } else {
        sheet.skills.activeSkills.push({ name: memberSkillKey, rating: groupRating })
      }
    }

    sheet.skills.skillGroups = sheet.skills.skillGroups.filter(
      (g) => g.name !== coveringGroup.name,
    )
  }

  const existingSkill = sheet.skills.activeSkills.find((s) => s.name === improvement.skill)
  if (existingSkill) {
    if (improvement.newRating !== undefined) existingSkill.rating = improvement.newRating
    if (improvement.specialization !== undefined) existingSkill.specialization = improvement.specialization
  } else if (improvement.newRating !== undefined) {
    sheet.skills.activeSkills.push({
      name: improvement.skill,
      rating: improvement.newRating,
      specialization: improvement.specialization,
    })
  }
}

const applySkillGroupImprovement = (
  sheet: Draft<CharacterSheet>,
  improvement: SkillGroupImprovement,
): void => {
  if (improvement.newRating === undefined) return

  const existingGroup = sheet.skills.skillGroups.find((g) => g.name === improvement.group)
  if (existingGroup) {
    existingGroup.rating = improvement.newRating
  } else {
    sheet.skills.skillGroups.push({ name: improvement.group, rating: improvement.newRating })
  }
}

const applyKnowledgeSkillImprovement = (
  sheet: Draft<CharacterSheet>,
  improvement: KnowledgeSkillImprovement,
): void => {
  const existingSkill = sheet.skills.knowledgeSkills.find((s) => s.name === improvement.skill)
  if (existingSkill) {
    if (improvement.newRating !== undefined) existingSkill.rating = improvement.newRating
    if (improvement.specialization !== undefined) existingSkill.specialization = improvement.specialization
  } else if (improvement.newRating !== undefined) {
    sheet.skills.knowledgeSkills.push({
      name: improvement.skill,
      rating: improvement.newRating,
      specialization: improvement.specialization,
    })
  }
}

const applyLanguageSkillImprovement = (
  sheet: Draft<CharacterSheet>,
  improvement: LanguageSkillImprovement,
): void => {
  const existingSkill = sheet.skills.languageSkills.find((s) => s.name === improvement.skill)
  if (existingSkill) {
    if (improvement.newRating !== undefined) existingSkill.rating = improvement.newRating
    if (improvement.specialization !== undefined) existingSkill.lingo = improvement.specialization
  } else if (improvement.newRating !== undefined) {
    sheet.skills.languageSkills.push({
      name: improvement.skill,
      rating: improvement.newRating,
      lingo: improvement.specialization,
    })
  }
}

const applySpellImprovement = (
  sheet: Draft<CharacterSheet>,
  improvement: LearnSpellImprovement,
): void => {
  const alreadyKnown = sheet.spells.some((s) => s.id === improvement.spell.id)
  if (!alreadyKnown) {
    sheet.spells.push(improvement.spell)
  }
}
