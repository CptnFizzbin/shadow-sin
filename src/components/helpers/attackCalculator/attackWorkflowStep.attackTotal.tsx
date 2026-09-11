import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { WeaponCard } from "#/components/items/types/weapons/weaponCard.tsx"
import { DiceResult } from "#/components/system/dice/diceResult.tsx"
import type { DiceGroup, DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { getPoolSize } from "#/components/system/dicePool/dicePoolData.tsx"
import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { useDiceRoller } from "#/hooks/system/dice/useDiceRoller.ts"
import { useEncumbranceDiceGroup } from "#/hooks/system/dicePool/useDiceGroup.ts"
import { DicePoolSelectors } from "#/stores/runner/dicePool/dicePoolSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import {
  selectAllSettled,
  selectHits,
  selectIsCriticalGlitch,
  selectIsGlitch,
  selectWasRolled,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"
import { applyNetHitsToDamage } from "#/system/gear/weaponDamage.ts"

import { useActiveAttackWeapon, useAttackWorkflow } from "./attackWorkflow.ts"

/** Total step: rolls the Attack Test and resolves Net Hits / Total DV against defenseCalculator hits. */
export const AttackWorkflowStepAttackTotal: FC = () => {
  const workflow = useAttackWorkflow()
  const weapon = useActiveAttackWeapon()
  if (!workflow.data.selectedSkill) throw new Error("Invalid workflow stated. Expected skill to be selected.")

  const skill = useRunnerSelector(SkillsSelectors.selectActiveSkill, { skillName: workflow.data.selectedSkill })

  const attrKey = weapon.attribute ?? skill.attr
  const affectedByEncumbrance = attrKey === AttributeKey.agility || attrKey === AttributeKey.reaction

  const skillPool = useRunnerSelector(DicePoolSelectors.selectStandardTest, {
    skill: skill.name,
    attr: attrKey,
  })

  const encumbranceGroup = useEncumbranceDiceGroup()

  const modifierGroups = Object.entries(workflow.data.modifiers).map(([label, value]): DiceGroup => {
    return { name: label, size: value }
  })

  const groups: DiceGroupList = [
    skillPool.groups,
    affectedByEncumbrance ? encumbranceGroup : null,
    ...modifierGroups,
  ]
  const poolTotal = getPoolSize(groups.flat())

  const [defenseHits, setDefenseHits] = useState(0)

  const diceRoller = useDiceRoller(poolTotal)
  const hasRolled = useDiceRollerSelector(diceRoller, selectWasRolled)
  const rolledHits = useDiceRollerSelector(diceRoller, selectHits)
  const isGlitch = useDiceRollerSelector(diceRoller, selectIsGlitch)
  const isCriticalGlitch = useDiceRollerSelector(diceRoller, selectIsCriticalGlitch)
  const isSettled = useDiceRollerSelector(diceRoller, selectAllSettled)

  const netHits = hasRolled ? rolledHits - defenseHits : null
  const totalDV = netHits === null ? null : (netHits > 0 ? applyNetHitsToDamage(weapon.dmg, netHits) : "Miss")

  return (
    <Stack sx={{ gap: 1.5 }}>
      <WeaponCard.DicePool name="Attack" groups={groups} />

      <Stack sx={{ alignItems: "center" }}>
        <DiceResult roller={diceRoller} iconSize={32} />

        {isSettled && isCriticalGlitch && (
          <Label label="CRITICAL GLITCH!" color="error.main" variant="contained" />
        )}
        {isSettled && !isCriticalGlitch && isGlitch && (
          <Label label="Glitch!" color="error.main" variant="text" />
        )}

        <Button
          variant="contained"
          onClick={() => {
            diceRoller.reset()
            diceRoller.rollAll()
          }}
          fullWidth
        >
          {hasRolled ? "Reroll Attack Test" : "Roll Attack Test"}
        </Button>
      </Stack>

      <Divider />

      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.secondary">
          Hits rolled on the defender's Defense Test
        </Typography>
        <CounterInput
          label="Defense Hits"
          value={defenseHits}
          onChange={(newValue) => setDefenseHits(newValue ?? 0)}
          min={0}
          max={99}
        />
      </Stack>

      <Grid container spacing={1} columns={2}>
        <Grid size={1}>
          <Label label="Net Hits" variant="outlined" />
          <Typography
            sx={{ textAlign: "center" }}
            color={netHits !== null && netHits > 0 ? "success.main" : netHits !== null && netHits < 0 ? "error.main" : undefined}
          >
            {netHits ?? "—"}
          </Typography>
        </Grid>
        <Grid size={1}>
          <Label label="Total DV" variant="outlined" />
          <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
            {totalDV ?? weapon.dmg}
          </Typography>
        </Grid>
      </Grid>
    </Stack>
  )
}
