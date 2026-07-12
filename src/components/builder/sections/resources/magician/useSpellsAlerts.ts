import { useActiveSkill, useAttr } from "#/components/runner/runnerUtils.ts"
import { isMagician, SpellsBpPerSpell } from "#/components/runner/spells/spellsUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const useSpellsAlerts = (): AlertInfo[] => {
  const awakeningType = useRunnerStoreSelector(Selectors.biology.selectAwakening)
  const magicAttribute = useAttr(AttributeKey.magic)
  const spellcasting = useActiveSkill(SkillKey.spellcasting)
  const ritualSpellcasting = useActiveSkill(SkillKey.ritualSpellcasting)
  const spells = useRunnerStoreSelector(Selectors.spells.selectSpells)

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
