import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { useAttrValue } from "#/components/runner/attributes/attributesProvider.tsx"
import { isMagician } from "#/components/runner/magician/magicianUtils.ts"
import { useActiveSkill } from "#/components/runner/runnerUtils.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useIsEditMode } from "#/stores/builder/editMode.context.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const useSpellsAlerts = (): AlertInfo[] => {
  const awakeningType = useRunnerStoreSelector(Selectors.biology.selectAwakening)
  const magicAttribute = useAttrValue(AttributeKey.magic)
  const spellcasting = useActiveSkill(SkillKey.spellcasting)
  const ritualSpellcasting = useActiveSkill(SkillKey.ritualSpellcasting)
  const spells = useRunnerStoreSelector(Selectors.spells.selectSpells)
  const isEditMode = useIsEditMode()

  const statuses: AlertInfo[] = []

  if (!isMagician(awakeningType)) return statuses

  const allowance = Math.max(spellcasting, ritualSpellcasting) * 2 * BuilderConfig.magic.spells.bpCost
  const spent = spells.length * BuilderConfig.magic.spells.bpCost

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

  if (spent > allowance && !isEditMode) {
    statuses.push({
      section: "Spells",
      severity: "error",
      title: "BP Exceeded",
      message: `You have used ${spent} BP on spells, but you only have ${allowance} BP available. Either reduce the number of spells or increase your Spellcasting/Ritual Spellcasting skill ratings.`,
    })
  }

  return statuses
}
