import type { AttributeKey } from "#/system/attributeKey"
import type { ComplexFormData } from "#/system/magic/complexFormData"
import type { SpellData } from "#/system/magic/spellData"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey"
import type { SkillKey } from "#/system/skills/skillKey"

export interface ImprovementsState {
  attrImprovement: Partial<Record<AttributeKey, { newRating: number }>>
  activeSkillImprovement: Partial<Record<SkillKey, { newRating?: number, newSpecialization?: string }>>
  skillGroupImprovement: Partial<Record<SkillGroupKey, { newRating: number }>>
  knowledgeImprovement: Partial<Record<string, { newRating?: number, newSpecialization?: string }>>
  languageImprovement: Partial<Record<string, { newRating?: number, newSpecialization?: string }>>
  learnSpell: Record<string, SpellData>
  learnComplexForm: Record<string, ComplexFormData>
}

export function createImprovementsState(): ImprovementsState {
  return {
    activeSkillImprovement: {},
    attrImprovement: {},
    knowledgeImprovement: {},
    languageImprovement: {},
    learnComplexForm: {},
    learnSpell: {},
    skillGroupImprovement: {},
  }
}
