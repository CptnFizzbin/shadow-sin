import { useStore } from "@tanstack/react-store"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { useActiveSkill } from "#/components/character/characterUtils.ts"
import type { BpLineItem } from "#/components/characterBuilder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"
import { isMagician, SpellsBpPerSpell } from "#/components/spells/spellsUtils.ts"
import { useSpellsStore } from "#/components/spells/useSpellsStore.ts"
import { SkillKey } from "#/lib/system/skills/skillKey.ts"

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
