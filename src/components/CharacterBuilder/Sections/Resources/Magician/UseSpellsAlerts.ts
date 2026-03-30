import { useStore } from "@tanstack/react-store"

import { useBuilderActiveSkillRating } from "#/components/CharacterBuilder/Hooks/UseBuilderActiveSkillRating.ts"
import { useBuilderAttrValue } from "#/components/CharacterBuilder/Hooks/UseBuilderAttrValue.ts"
import { useBuilderAwakeningType } from "#/components/CharacterBuilder/Hooks/UseBuilderAwakeningType.ts"
import { isMagician, SpellsBpPerSpell } from "#/components/CharacterBuilder/Sections/Resources/Magician/SpellsUtils.ts"
import { useSpellsStore } from "#/components/CharacterBuilder/Sections/Resources/Magician/UseSpellsStore.ts"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"
import { SkillKey } from "#/lib/system/SkillKey.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

export const useSpellsAlerts = (): AlertInfo[] => {
  const awakeningType = useBuilderAwakeningType()
  const magicAttribute = useBuilderAttrValue(AttributeKey.magic)
  const spellcasting = useBuilderActiveSkillRating(SkillKey.spellcasting)
  const ritualSpellcasting = useBuilderActiveSkillRating(SkillKey.ritualSpellcasting)
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
