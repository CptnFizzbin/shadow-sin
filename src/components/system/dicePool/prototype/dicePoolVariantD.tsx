import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
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
 * Variant D — Split Panel.
 *
 * The breakdown ledger and the roll module sit side by side as equal
 * partners, rather than one being appended below the other. The roll
 * module is a standing fixture of the pool — always visible, never
 * something you have to scroll past the math to reach.
 */
export const DicePoolVariantD: FC<DicePoolVariantProps> = ({ name, groups }) => {
  const diceGroups = groups.flat().filter(isDiceGroup)
  const total = getPoolSize(diceGroups)

  const diceRoller = useDiceRoller(total)
  const hasRolled = useDiceRollerSelector(diceRoller, selectWasRolled)
  const hits = useDiceRollerSelector(diceRoller, selectHits)
  const isGlitch = useDiceRollerSelector(diceRoller, selectIsGlitch)
  const isCriticalGlitch = useDiceRollerSelector(diceRoller, selectIsCriticalGlitch)

  return (
    <Stack direction="row" sx={{ border: "1px solid", borderColor: "divider" }}>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <DiceGroupDisplay name={name} size={total} total />

        {diceGroups.map((group) => (
          <DiceGroupDisplay
            key={`${name}-${group.id ?? group.name}`}
            name={group.name}
            size={group.size}
            color={group.color}
          />
        ))}
      </Box>

      <Stack
        sx={{
          width: 110,
          flexShrink: 0,
          gap: 0.5,
          alignItems: "center",
          padding: 1,
          borderLeft: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          size="small"
          variant="contained"
          fullWidth
          onClick={() => {
            diceRoller.reset()
            diceRoller.rollAll()
          }}
        >
          {hasRolled ? "Reroll" : "Roll"}
        </Button>

        {hasRolled && <DiceResult roller={diceRoller} iconSize={16} />}

        {isCriticalGlitch && <Label label="CRIT!" color="error.main" variant="contained" />}
        {!isCriticalGlitch && isGlitch && <Label label="Glitch!" color="error.main" variant="text" />}
        {hasRolled && !isGlitch && <Label label={`${hits} hits`} color="secondary.dark" variant="text" />}
      </Stack>
    </Stack>
  )
}
