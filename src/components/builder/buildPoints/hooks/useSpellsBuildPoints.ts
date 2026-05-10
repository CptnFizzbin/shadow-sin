import { useSelector } from "@tanstack/react-store"

import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { useActiveSkill } from "#/components/character/skills/useActiveSkillHooks.ts"
import { selectAllSpells } from "#/components/character/spells/spellsSelectors.ts"
import { isMagician, SpellsBpPerSpell } from "#/components/character/spells/spellsUtils.ts"
import { useSpellsStore } from "#/components/character/spells/useSpellsStore.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const useSpellsBuildPoints = (): BpLineItem => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const spellsStore = useSpellsStore()
  const spells = useSelector(spellsStore, selectAllSpells)
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
