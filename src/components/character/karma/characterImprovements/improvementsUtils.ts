import type { Draft } from "immer"
import { produce } from "immer"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import type { KarmaStore } from "#/components/character/karma/karmaStore.ts"
import type { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import type { SpellData } from "#/system/magic/spellData.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import { calcImprovementsKarmaCost } from "./improvementsKarmaCost.ts"
import type { ImprovementsStore } from "./improvementsStore.ts"

const applyImprovements = (
  improvementsStore: ImprovementsStore,
  characterStore: CharacterSheetStore,
  karmaStore: KarmaStore,
) => {
  const state = improvementsStore.store.state
  const karmaCost = calcImprovementsKarmaCost(state)

  characterStore.setState(produce((sheet) => {
    for (const [attr, value] of Object.entries(state.attrImprovement)) {
      if (value) applyAttributeImprovement(sheet, attr as AttributeKey, value.newRating)
    }

    for (const [skill, value] of Object.entries(state.activeSkillImprovement)) {
      if (value) applyActiveSkillImprovement(sheet, skill as SkillKey, value.newRating, value.newSpecialization)
    }

    for (const [group, value] of Object.entries(state.skillGroupImprovement)) {
      if (value?.newRating !== undefined) applySkillGroupImprovement(sheet, group as SkillGroupKey, value.newRating)
    }

    for (const [skill, value] of Object.entries(state.knowledgeImprovement)) {
      if (value) applyKnowledgeSkillImprovement(sheet, skill, value.newRating, value.newSpecialization)
    }

    for (const [skill, value] of Object.entries(state.languageImprovement)) {
      if (value) applyLanguageSkillImprovement(sheet, skill, value.newRating, value.newSpecialization)
    }

    for (const spell of Object.values(state.learnSpell)) {
      applySpellImprovement(sheet, spell)
    }
  }))

  if (karmaCost > 0) karmaStore.spendKarma(karmaCost)
}

export const applyImprovementsAndSpendKarma = (
  improvementsStore: ImprovementsStore,
  characterStore: CharacterSheetStore,
  karmaStore: KarmaStore,
): void => {
  applyImprovements(improvementsStore, characterStore, karmaStore)
}

const applyAttributeImprovement = (
  sheet: Draft<CharacterSheet>,
  attr: AttributeKey,
  newRating: number,
): void => {
  sheet.attributes[attr] = newRating
}

const applyActiveSkillImprovement = (
  sheet: Draft<CharacterSheet>,
  skill: SkillKey,
  newRating: number | undefined,
  specialization: string | undefined,
): void => {
  // Auto-break any skill group that covers this skill before applying the improvement
  const coveringGroup = sheet.skills.skillGroups.find((group) =>
    getSkillsInGroup(group.name as SkillGroupKey).includes(skill),
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

  const existingSkill = sheet.skills.activeSkills.find((s) => s.name === skill)
  if (existingSkill) {
    if (newRating !== undefined) existingSkill.rating = newRating
    if (specialization !== undefined) existingSkill.specialization = specialization
  } else if (newRating !== undefined) {
    sheet.skills.activeSkills.push({
      name: skill,
      rating: newRating,
      specialization,
    })
  }
}

const applySkillGroupImprovement = (
  sheet: Draft<CharacterSheet>,
  group: SkillGroupKey,
  newRating: number,
): void => {
  const existingGroup = sheet.skills.skillGroups.find((g) => g.name === group)
  if (existingGroup) {
    existingGroup.rating = newRating
  } else {
    sheet.skills.skillGroups.push({ name: group, rating: newRating })
  }
}

const applyKnowledgeSkillImprovement = (
  sheet: Draft<CharacterSheet>,
  skill: string,
  newRating: number | undefined,
  specialization: string | undefined,
): void => {
  const existingSkill = sheet.skills.knowledgeSkills.find((s) => s.name === skill)
  if (existingSkill) {
    if (newRating !== undefined) existingSkill.rating = newRating
    if (specialization !== undefined) existingSkill.specialization = specialization
  } else if (newRating !== undefined) {
    sheet.skills.knowledgeSkills.push({
      name: skill,
      rating: newRating,
      specialization,
    })
  }
}

const applyLanguageSkillImprovement = (
  sheet: Draft<CharacterSheet>,
  skill: string,
  newRating: number | undefined,
  specialization: string | undefined,
): void => {
  const existingSkill = sheet.skills.languageSkills.find((s) => s.name === skill)
  if (existingSkill) {
    if (newRating !== undefined) existingSkill.rating = newRating
    if (specialization !== undefined) existingSkill.lingo = specialization
  } else if (newRating !== undefined) {
    sheet.skills.languageSkills.push({
      name: skill,
      rating: newRating,
      lingo: specialization,
    })
  }
}

const applySpellImprovement = (
  sheet: Draft<CharacterSheet>,
  spell: SpellData,
): void => {
  const alreadyKnown = sheet.spells.some((s) => s.id === spell.id)
  if (!alreadyKnown) {
    sheet.spells.push(spell)
  }
}
