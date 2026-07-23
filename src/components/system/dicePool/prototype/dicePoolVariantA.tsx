import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { DiceResult } from "#/components/system/dice/diceResult.tsx"
import { useDiceRoller } from "#/components/system/dice/useDiceRoller.ts"
import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { isDiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { DiceGroupDisplay } from "#/components/system/dicePool/diceGroupDisplay.tsx"
import { getPoolSize } from "#/components/system/dicePool/dicePoolData.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import {
  selectHits,
  selectIsCriticalGlitch,
  selectIsGlitch,
  selectWasRolled,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"

interface DicePoolVariantProps {
  name: string
  groups: DiceGroupList
}

/**
 * Variant A — Ledger + Roll Footer.
 *
 * Keeps today's stacked breakdown ledger untouched (the thing people already
 * know how to read) and appends a footer that owns rolling: a full-width
 * button, the dice results, and a glitch/critical callout. Nothing about the
 * breakdown changes shape when you roll — the footer is the only part that's new.
 */
export const DicePoolVariantA: FC<DicePoolVariantProps> = ({ name, groups }) => {
  const diceGroups = groups.flat().filter(isDiceGroup)
  const total = getPoolSize(diceGroups)

  const diceRoller = useDiceRoller(total)
  const hasRolled = useDiceRollerSelector(diceRoller, selectWasRolled)
  const hits = useDiceRollerSelector(diceRoller, selectHits)
  const isGlitch = useDiceRollerSelector(diceRoller, selectIsGlitch)
  const isCriticalGlitch = useDiceRollerSelector(diceRoller, selectIsCriticalGlitch)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", border: "1px solid", borderColor: "divider" }}>
      <DiceGroupDisplay name={name} size={total} total />

      {diceGroups.map((group) => (
        <DiceGroupDisplay
          key={`${name}-${group.id ?? group.name}`}
          name={group.name}
          size={group.size}
          color={group.color}
        />
      ))}

      <Divider />

      <Stack sx={{ gap: 0.5, padding: 1, alignItems: "center" }}>
        {hasRolled && <DiceResult roller={diceRoller} iconSize={22} />}

        {isCriticalGlitch && <Label label="CRITICAL GLITCH!" color="error.main" variant="contained" />}
        {!isCriticalGlitch && isGlitch && <Label label="Glitch!" color="error.main" variant="text" />}
        {hasRolled && !isGlitch && <Label label={`${hits} hits`} color="secondary.dark" variant="text" />}

        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            diceRoller.reset()
            diceRoller.rollAll()
          }}
        >
          {hasRolled ? "Reroll" : "Roll"}
        </Button>
      </Stack>
    </Box>
  )
}
