import type { ActiveSkillImprovement } from "./activeSkillImprovement.ts"
import type { AttributeImprovement } from "./attributeImprovement.ts"
import type { KnowledgeSkillImprovement } from "./knowledgeSkillImprovement.ts"
import type { LanguageSkillImprovement } from "./languageSkillImprovement.ts"
import type { LearnSpellImprovement } from "./learnSpellImprovement.ts"
import type { SkillGroupImprovement } from "./skillGroupImprovement.ts"

export type AnyImprovement =
  | AttributeImprovement
  | ActiveSkillImprovement
  | SkillGroupImprovement
  | KnowledgeSkillImprovement
  | LanguageSkillImprovement
  | LearnSpellImprovement
