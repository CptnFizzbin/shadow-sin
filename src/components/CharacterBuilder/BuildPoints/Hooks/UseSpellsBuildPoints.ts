import { useStore } from "@tanstack/react-store"

import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { useActiveSkill } from "#/components/Character/CharacterUtils.ts"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/BpLineItem.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"
import { isMagician, SpellsBpPerSpell } from "#/components/Spells/SpellsUtils.ts"
import { useSpellsStore } from "#/components/Spells/UseSpellsStore.ts"
import { SkillKey } from "#/lib/system/SkillKey.ts"

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
