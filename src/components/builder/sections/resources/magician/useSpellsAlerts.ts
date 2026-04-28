import { useSelector } from "@tanstack/react-store"

import { useActiveSkill, useAttr } from "#/components/character/characterUtils.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { selectAllSpells } from "#/components/character/spells/spellsSelectors.ts"
import { isMagician, SpellsBpPerSpell } from "#/components/character/spells/spellsUtils.ts"
import { useSpellsStore } from "#/components/character/spells/useSpellsStore.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const useSpellsAlerts = (): AlertInfo[] => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const magicAttribute = useAttr(AttributeKey.magic)
  const spellcasting = useActiveSkill(SkillKey.spellcasting)
  const ritualSpellcasting = useActiveSkill(SkillKey.ritualSpellcasting)
  const spellsStore = useSpellsStore()
  const spells = useSelector(spellsStore, selectAllSpells)

  const statuses: AlertInfo[] = []

  if (!isMagician(awakeningType)) return statuses

  const allowance = Math.max(spellcasting, ritualSpellcasting) * 2 * SpellsBpPerSpell
  const spent = spells.length * SpellsBpPerSpell

  if (spellcasting === 0 && ritualSpellcasting === 0) {
    statuses.push({
      section: "Spells",
      severity: "error",
      title: "Missing Skill",
      message:
        "Spells require either Spellcasting or Ritual Spellcasting skill ratings. Purchase one of these skills to use spells.",
    })
    return statuses
  }

  if (magicAttribute === undefined) {
    statuses.push({
      section: "Spells",
      severity: "error",
      title: "Magic Attribute",
      message: "Magic attribute is not set.",
    })
  }

  if (spent > allowance) {
    statuses.push({
      section: "Spells",
      severity: "error",
      title: "BP Exceeded",
      message: `You have used ${spent} BP on spells, but you only have ${allowance} BP available. Either reduce the number of spells or increase your Spellcasting/Ritual Spellcasting skill ratings.`,
    })
  }

  return statuses
}
