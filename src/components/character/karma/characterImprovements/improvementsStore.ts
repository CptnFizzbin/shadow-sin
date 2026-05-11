import type { Store } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"

import type { AttributeKey } from "#/system/attributeKey.ts"
import type { SpellData } from "#/system/magic/spellData.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import type { ImprovementsState } from "./improvementsState.ts"
import { createImprovementsState } from "./improvementsState.ts"

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

  removeAttributeImprovement(attr: AttributeKey) {
    this.store.setState(produce((state) => {
      delete state.attrImprovement[attr]
    }))
  }

  removeActiveSkillImprovement(skill: SkillKey) {
    this.store.setState(produce((state) => {
      delete state.activeSkillImprovement[skill]
    }))
  }

  removeSkillGroupImprovement(group: SkillGroupKey) {
    this.store.setState(produce((state) => {
      delete state.skillGroupImprovement[group]
    }))
  }

  removeKnowledgeSkillImprovement(skill: string) {
    this.store.setState(produce((state) => {
      delete state.knowledgeImprovement[skill]
    }))
  }

  removeLanguageSkillImprovement(skill: string) {
    this.store.setState(produce((state) => {
      delete state.languageImprovement[skill]
    }))
  }

  removeLearnSpell(spellId: string) {
    this.store.setState(produce((state) => {
      delete state.learnSpell[spellId]
    }))
  }

  clear() {
    this.store.setState(() => createImprovementsState())
  }
}
