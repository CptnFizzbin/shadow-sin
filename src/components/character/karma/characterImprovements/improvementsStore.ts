import type { Store } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"

import type { AttributeKey } from "#/system/attributeKey.ts"
import type { SpellData } from "#/system/magic/spellData.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"

import type { AnyImprovement } from "./types/anyImprovement.ts"
import { ImprovementType } from "./types/improvementType.ts"

export interface ImprovementsState {
  improvements: AnyImprovement[]
}

export class ImprovementsStore {
  public readonly store: Store<ImprovementsState>

  constructor(value: ImprovementsState) {
    this.store = createStore(value)
  }

  improveAttribute(attr: AttributeKey, newRating: number) {
    this.store.setState(produce((state) => {
      state.improvements.push({ type: ImprovementType.Attribute, attribute: attr, newRating })
    }))
  }

  improveActiveSkill(skill: SkillKey, newRating: number) {
    this.store.setState(produce((state) => {
      state.improvements.push({ type: ImprovementType.ActiveSkill, skill, newRating })
    }))
  }

  addActiveSkillSpecialization(skill: SkillKey, specialization: string) {
    this.store.setState(produce((state) => {
      state.improvements.push({ type: ImprovementType.ActiveSkill, skill, specialization })
    }))
  }

  improveSkillGroup(group: SkillGroupKey, newRating: number) {
    this.store.setState(produce((state) => {
      state.improvements.push({ type: ImprovementType.SkillGroup, group, newRating })
    }))
  }

  improveKnowledgeSkill(skill: string, newRating: number) {
    this.store.setState(produce((state) => {
      state.improvements.push({ type: ImprovementType.KnowledgeSkill, skill, newRating })
    }))
  }

  addKnowledgeSkillSpecialization(skill: string, specialization: string) {
    this.store.setState(produce((state) => {
      state.improvements.push({ type: ImprovementType.KnowledgeSkill, skill, specialization })
    }))
  }

  improveLanguageSkill(skill: string, newRating: number) {
    this.store.setState(produce((state) => {
      state.improvements.push({ type: ImprovementType.LanguageSkill, skill, newRating })
    }))
  }

  addLanguageSkillSpecialization(skill: string, specialization: string) {
    this.store.setState(produce((state) => {
      state.improvements.push({ type: ImprovementType.LanguageSkill, skill, specialization })
    }))
  }

  learnSpell(spell: SpellData) {
    this.store.setState(produce((state) => {
      state.improvements.push({ type: ImprovementType.LearnSpell, spell })
    }))
  }

  removeImprovement(index: number) {
    this.store.setState(produce((state) => {
      state.improvements.splice(index, 1)
    }))
  }

  clear() {
    this.store.setState(() => ({ improvements: [] }))
  }
}
