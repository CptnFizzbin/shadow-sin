import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDice6Line } from "@remixicon/react"
import type { FC } from "react"

import { DiceResult } from "#/components/system/dice/diceResult.tsx"
import { useDiceRoller } from "#/components/system/dice/useDiceRoller.ts"
import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { isDiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { DiceGroupDisplay } from "#/components/system/dicePool/diceGroupDisplay.tsx"
import { getPoolSize } from "#/components/system/dicePool/dicePoolData.tsx"
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
 * Variant G — Corner Roll Badge.
 *
 * The ledger is completely untouched — same header, same breakdown rows.
 * Rolling doesn't claim a row of its own at all: a small circular die-icon
 * badge floats over the card's top-right corner, overlapping the border
 * like a notification badge. Tapping it opens a thin result strip under
 * the header, then the card goes back to being a plain ledger.
 */
export const DicePoolVariantG: FC<DicePoolVariantProps> = ({ name, groups }) => {
  const diceGroups = groups.flat().filter(isDiceGroup)
  const total = getPoolSize(diceGroups)

  const diceRoller = useDiceRoller(total)
  const hasRolled = useDiceRollerSelector(diceRoller, selectWasRolled)
  const hits = useDiceRollerSelector(diceRoller, selectHits)
  const isGlitch = useDiceRollerSelector(diceRoller, selectIsGlitch)
  const isCriticalGlitch = useDiceRollerSelector(diceRoller, selectIsCriticalGlitch)

  return (
    <Box sx={{ position: "relative", display: "flex", flexDirection: "column", border: "1px solid", borderColor: "divider", marginTop: "12px", marginRight: "12px" }}>
      <IconButton
        size="small"
        aria-label={`Roll ${name}`}
        onClick={() => {
          diceRoller.reset()
          diceRoller.rollAll()
        }}
        sx={{
          "position": "absolute",
          "top": -14,
          "right": -14,
          "backgroundColor": isCriticalGlitch || isGlitch ? "error.main" : "secondary.main",
          "color": "common.white",
          "border": "2px solid",
          "borderColor": "background.paper",
          "boxShadow": 2,
          "&:hover": { backgroundColor: isCriticalGlitch || isGlitch ? "error.dark" : "secondary.dark" },
        }}
      >
        <RiDice6Line size={16} />
      </IconButton>

      <DiceGroupDisplay name={name} size={total} total />

      {hasRolled && (
        <Stack
          direction="row"
          sx={{ alignItems: "center", gap: 1, paddingX: 1, paddingY: 0.5, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <DiceResult roller={diceRoller} iconSize={16} />
          <Typography variant="caption" color={isCriticalGlitch || isGlitch ? "error.main" : "text.secondary"} sx={{ marginLeft: "auto" }}>
            {isCriticalGlitch ? "Critical glitch!" : isGlitch ? "Glitch!" : `${hits} hits`}
          </Typography>
        </Stack>
      )}

      {diceGroups.map((group) => (
        <DiceGroupDisplay
          key={`${name}-${group.id ?? group.name}`}
          name={group.name}
          size={group.size}
          color={group.color}
        />
      ))}
    </Box>
  )
}
