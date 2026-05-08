import type { SpellData } from "#/system/magic/spellData.ts"

import type { ImprovementType } from "./improvementType.ts"

export interface LearnSpellImprovement {
  type: ImprovementType.LearnSpell
  spell: SpellData
}
