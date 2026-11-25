import type { AlertInfo } from "#/common/alerts/alertInfo.ts"
import { AttributeKey } from "#/data/attributes/attributeKey.ts"
import { isMagician } from "#/data/magic/magicianUtils.ts"
import { SkillKey } from "#/data/skills/skillKey.ts"
import { BuilderConfig } from "#/rules/buildPoints/builderConfig.ts"
import { useEditorMode } from "#/state/editor/editorMode.tsx"
import { useEntitySelector } from "#/state/entity/useEntitySelector.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { useActiveSkill } from "#/state/runner/runnerUtils.ts"
import { SpellsSelectors } from "#/state/runner/spells/spells.selector.ts"

export const useSpellsAlerts = (): AlertInfo[] => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const magicAttribute = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.magic })
  const spellcasting = useActiveSkill(SkillKey.spellcasting)
  const ritualSpellcasting = useActiveSkill(SkillKey.ritualSpellcasting)
  const spells = useRunnerSelector(SpellsSelectors.selectAll)
  const editorMode = useEditorMode()

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

  if (spent > allowance && editorMode.isBuilder) {
    statuses.push({
      section: "Spells",
      severity: "error",
      title: "BP Exceeded",
      message: `You have used ${spent} BP on spells, but you only have ${allowance} BP available. Either reduce the number of spells or increase your Spellcasting/Ritual Spellcasting skill ratings.`,
    })
  }

  return statuses
}
