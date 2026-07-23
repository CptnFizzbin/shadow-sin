import Grid from "@mui/material/Grid"
import type { FC } from "react"

import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import {
  useActiveSkillDiceGroup,
  useAttrDiceGroup,
  useDefaultingDiceGroup,
  useEncumbranceDiceGroup,
  useWoundDiceGroup,
} from "#/components/system/dicePool/useDiceGroup.ts"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

/**
 * THROWAWAY — answers "what should the DicePool component look like, and how
 * should players roll it digitally?" See NOTES.md in this folder.
 *
 * Two real dice pools (built from the same live attribute/skill hooks the
 * rest of the Defense tab uses), sitting right next to the rest of the real
 * page for comparison. `DicePool` itself now switches designs based on the
 * app-root `<Prototype>` (see `__root.tsx`), so these two pools — and every
 * other DicePool in the app — reflect whichever version is selected.
 */
export const DicePoolPrototypeDemo: FC = () => {
  const reaction = useAttrDiceGroup(AttributeKey.reaction)
  const dodgeGroup = useActiveSkillDiceGroup(SkillKey.dodge)
  const dodgeDefaulting = useDefaultingDiceGroup(SkillKey.dodge)
  const unarmedGroup = useActiveSkillDiceGroup(SkillKey.unarmedCombat)
  const unarmedDefaulting = useDefaultingDiceGroup(SkillKey.unarmedCombat)
  const wound = useWoundDiceGroup()
  const encumbrance = useEncumbranceDiceGroup()

  const pools: { name: string, groups: DiceGroupList }[] = [
    {
      name: "Ranged Full Defense",
      groups: [reaction, dodgeGroup, dodgeDefaulting, wound, encumbrance],
    },
    {
      name: "Melee Full Block",
      groups: [reaction, unarmedGroup, unarmedDefaulting, wound, encumbrance],
    },
  ]

  return (
    <>
      <SectionHeader>Dice Pool Redesign (Prototype)</SectionHeader>

      <Grid container columns={{ sm: 1, md: 2 }} spacing={1}>
        {pools.map(({ name, groups }) => (
          <Grid key={name} size={1}>
            <DicePool name={name} groups={groups} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}
