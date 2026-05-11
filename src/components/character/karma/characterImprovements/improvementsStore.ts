import type { Store } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"

import type { AttributeKey } from "#/system/attributeKey.ts"
import type { SpellData } from "#/system/magic/spellData.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import type { ImprovementsState } from "./improvementsState.ts"
import { createImprovementsState } from "./improvementsState.ts"
import type { AnyImprovement } from "./types/anyImprovement.ts"
import { ImprovementType } from "./types/improvementType.ts"

export class ImprovementsStore {
  public readonly store: Store<ImprovementsState>

  constructor(value?: ImprovementsState) {
    this.store = createStore(value ?? createImprovementsState())
  }

  improveAttribute(attr: AttributeKey, newRating: number) {
    this.store.setState(produce((state) => {
      state.attrImprovement[attr] = { newRating }
    }))
  }

  improveActiveSkill(skill: SkillKey, newRating: number) {
    this.store.setState(produce((state) => {
      const existing = state.activeSkillImprovement[skill]
      state.activeSkillImprovement[skill] = { ...existing, newRating }
    }))
  }

  addActiveSkillSpecialization(skill: SkillKey, specialization: string) {
    this.store.setState(produce((state) => {
      const existing = state.activeSkillImprovement[skill]
      state.activeSkillImprovement[skill] = { ...existing, newSpecialization: specialization }
    }))
  }

  improveSkillGroup(group: SkillGroupKey, newRating: number) {
    this.store.setState(produce((state) => {
      state.skillGroupImprovement[group] = { newRating }
    }))
  }

  improveKnowledgeSkill(skill: string, newRating: number) {
    this.store.setState(produce((state) => {
      const existing = state.knowledgeImprovement[skill]
      state.knowledgeImprovement[skill] = { ...existing, newRating }
    }))
  }

  addKnowledgeSkillSpecialization(skill: string, specialization: string) {
    this.store.setState(produce((state) => {
      const existing = state.knowledgeImprovement[skill]
      state.knowledgeImprovement[skill] = { ...existing, newSpecialization: specialization }
    }))
  }

  improveLanguageSkill(skill: string, newRating: number) {
    this.store.setState(produce((state) => {
      const existing = state.languageImprovement[skill]
      state.languageImprovement[skill] = { ...existing, newRating }
    }))
  }

  addLanguageSkillSpecialization(skill: string, specialization: string) {
    this.store.setState(produce((state) => {
      const existing = state.languageImprovement[skill]
      state.languageImprovement[skill] = { ...existing, newSpecialization: specialization }
    }))
  }

  learnSpell(spell: SpellData) {
    this.store.setState(produce((state) => {
      state.learnSpell[spell.id] = spell
    }))
  }

  removeImprovement(improvement: AnyImprovement) {
    this.store.setState(produce((state) => {
      switch (improvement.type) {
        case ImprovementType.Attribute:
          delete state.attrImprovement[improvement.attribute]
          break
        case ImprovementType.ActiveSkill:
          delete state.activeSkillImprovement[improvement.skill]
          break
        case ImprovementType.SkillGroup:
          delete state.skillGroupImprovement[improvement.group]
          break
        case ImprovementType.KnowledgeSkill:
          delete state.knowledgeImprovement[improvement.skill]
          break
        case ImprovementType.LanguageSkill:
          delete state.languageImprovement[improvement.skill]
          break
        case ImprovementType.LearnSpell:
          delete state.learnSpell[improvement.spell.id]
          break
        default:
          throw new Error(`unknown improvement type`)
      }
    }))
  }

  clear() {
    this.store.setState(() => createImprovementsState())
  }
}
