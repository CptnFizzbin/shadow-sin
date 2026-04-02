import { useStore } from "@tanstack/react-store"

import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { useActiveSkill } from "#/components/Character/character-utils.ts"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/bp-line-item.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"
import { isMagician, SpellsBpPerSpell } from "#/components/Spells/spells-utils.ts"
import { useSpellsStore } from "#/components/Spells/use-spells-store.ts"
import { SkillKey } from "#/lib/system/skill-key.ts"

export const useSpellsBuildPoints = (): BpLineItem => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const spellsStore = useSpellsStore()
  const spells = useStore(spellsStore, (state) => state)
  const spellcasting = useActiveSkill(SkillKey.spellcasting)
  const ritualSpellcasting = useActiveSkill(SkillKey.ritualSpellcasting)

  const allowance = (Math.max(spellcasting, ritualSpellcasting) * 2) * SpellsBpPerSpell
  const spent = spells.length * SpellsBpPerSpell

  return {
    sectionId: BuilderSectionId.spells,
    allowance,
    spent,
    enabled: isMagician(awakeningType),
  }
}
