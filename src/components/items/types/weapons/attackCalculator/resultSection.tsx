import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { DiceResult } from "#/components/system/dice/diceResult.tsx"
import { useDiceRoller } from "#/components/system/dice/useDiceRoller.ts"
import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import {
  selectIsCriticalGlitch,
  selectIsGlitch,
  selectHits as selectRolledHits,
  selectWasRolled,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"
import { applyNetHitsToDamage } from "#/system/gear/weaponDamage.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"

interface ResultSectionProps {
  weapon: WeaponData
  groups: DiceGroupList
  poolTotal: number
}

export const ResultSection: FC<ResultSectionProps> = ({ weapon, groups, poolTotal }) => {
  const diceRoller = useDiceRoller(poolTotal)
  const hasRolled = useDiceRollerSelector(diceRoller, selectWasRolled)
  const rolledHits = useDiceRollerSelector(diceRoller, selectRolledHits)
  const isGlitch = useDiceRollerSelector(diceRoller, selectIsGlitch)
  const isCriticalGlitch = useDiceRollerSelector(diceRoller, selectIsCriticalGlitch)

  const [defenseHits, setDefenseHits] = useState(0)

  const netHits = hasRolled ? rolledHits - defenseHits : null
  const totalDV = netHits === null
    ? null
    : (netHits > 0 ? applyNetHitsToDamage(weapon.dmg, netHits) : "Miss")

  const handleRoll = () => {
    diceRoller.reset()
    diceRoller.rollAll()
  }

  return (
    <Stack sx={{ gap: 1.5 }}>
      <DicePool name="Attack" groups={groups} />

      <Stack sx={{ alignItems: "center", gap: 1 }}>
        <DiceResult roller={diceRoller} iconSize={32} />

        {isCriticalGlitch && <Label label="CRITICAL GLITCH!" color="error.main" variant="contained" />}
        {!isCriticalGlitch && isGlitch && <Label label="Glitch!" color="error.main" variant="text" />}

        <Button variant="contained" onClick={handleRoll} fullWidth>
          {hasRolled ? "Reroll Attack Test" : "Roll Attack Test"}
        </Button>
      </Stack>

      <Divider />

      <Stack direction="row" sx={{ gap: 1, alignItems: "center", justifyContent: "space-between" }}>
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
