import { useStore } from "@tanstack/react-store"

import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import { useActiveSkill, useAttr } from "#/components/Character/character-utils.ts"
import { isMagician, SpellsBpPerSpell } from "#/components/Spells/spells-utils.ts"
import { useSpellsStore } from "#/components/Spells/use-spells-store.ts"
import type { AlertInfo } from "#/components/UI/Alerts/alert-info.ts"
import { AttributeKey } from "#/lib/system/attribute-key.ts"
import { SkillKey } from "#/lib/system/skill-key.ts"

export const useSpellsAlerts = (): AlertInfo[] => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)
  const magicAttribute = useAttr(AttributeKey.magic)
  const spellcasting = useActiveSkill(SkillKey.spellcasting)
  const ritualSpellcasting = useActiveSkill(SkillKey.ritualSpellcasting)
  const spellsStore = useSpellsStore()
  const spells = useStore(spellsStore, (state) => state)

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
