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
import type { PrototypeVersion } from "#/components/ui/prototype/prototype.tsx"
import { Prototype } from "#/components/ui/prototype/prototype.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { DicePoolVariantA } from "./dicePoolVariantA.tsx"
import { DicePoolVariantB } from "./dicePoolVariantB.tsx"
import { DicePoolVariantC } from "./dicePoolVariantC.tsx"
import { DicePoolVariantD } from "./dicePoolVariantD.tsx"
import { DicePoolVariantE } from "./dicePoolVariantE.tsx"

export const dicePoolPrototypeVersions: PrototypeVersion[] = [
  { key: "current", name: "Current design" },
  { key: "A", name: "A — Ledger + Roll Footer" },
  { key: "B", name: "B — Hero Dial + Chips" },
  { key: "C", name: "C — Compact Row" },
  { key: "D", name: "D — Split Panel" },
  { key: "E", name: "E — Minimal HUD Pill" },
]

/**
 * THROWAWAY — answers "what should the DicePool component look like, and how
 * should players roll it digitally?" See NOTES.md in this folder.
 *
 * Renders two real dice pools (built from the same live attribute/skill
 * hooks the rest of the Defense tab uses) through every candidate design so
 * they can be judged against real data, side by side with the rest of the
 * page. Delete this file, the variant files, and the `<Prototype>` wrapping
 * in defense.tsx once a design is chosen.
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

      <Prototype versions={dicePoolPrototypeVersions}>
        <Grid container columns={{ sm: 1, md: 2 }} spacing={1} sx={{ paddingBottom: 6 }}>
          {pools.map(({ name, groups }) => (
            <Grid key={name} size={1}>
              <Prototype.Item version="current">
                <DicePool name={name} groups={groups} />
              </Prototype.Item>
              <Prototype.Item version="A">
                <DicePoolVariantA name={name} groups={groups} />
              </Prototype.Item>
              <Prototype.Item version="B">
                <DicePoolVariantB name={name} groups={groups} />
              </Prototype.Item>
              <Prototype.Item version="C">
                <DicePoolVariantC name={name} groups={groups} />
              </Prototype.Item>
              <Prototype.Item version="D">
                <DicePoolVariantD name={name} groups={groups} />
              </Prototype.Item>
              <Prototype.Item version="E">
                <DicePoolVariantE name={name} groups={groups} />
              </Prototype.Item>
            </Grid>
          ))}
        </Grid>
      </Prototype>
    </>
  )
}
