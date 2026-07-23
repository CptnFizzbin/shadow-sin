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
 * Variant F — Full Ledger, Icon in Header.
 *
 * The complete breakdown ledger stays visible at all times — nothing
 * collapses, nothing moves to a second panel. The only new thing is a small
 * die-icon button living right in the header row next to the total, in
 * place of a full-width button or a standing side panel. Rolling opens a
 * thin result strip between the header and the breakdown, then closes back
 * up to the plain ledger — the header itself is the trigger.
 */
export const DicePoolVariantF: FC<DicePoolVariantProps> = ({ name, groups }) => {
  const diceGroups = groups.flat().filter(isDiceGroup)
  const total = getPoolSize(diceGroups)

  const diceRoller = useDiceRoller(total)
  const hasRolled = useDiceRollerSelector(diceRoller, selectWasRolled)
  const hits = useDiceRollerSelector(diceRoller, selectHits)
  const isGlitch = useDiceRollerSelector(diceRoller, selectIsGlitch)
  const isCriticalGlitch = useDiceRollerSelector(diceRoller, selectIsCriticalGlitch)

  const headerColor = isCriticalGlitch || isGlitch ? "error.dark" : "primary.dark"

  return (
    <Box sx={{ display: "flex", flexDirection: "column", border: "1px solid", borderColor: "divider" }}>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          gap: 1,
          paddingX: 1,
          backgroundColor: headerColor,
          color: "primary.contrastText",
          fontWeight: "bold",
        }}
      >
        <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>{name}</Typography>

        <IconButton
          size="small"
          aria-label={`Roll ${name}`}
          onClick={() => {
            diceRoller.reset()
            diceRoller.rollAll()
          }}
          sx={{ color: "inherit" }}
        >
          <RiDice6Line size={18} />
        </IconButton>

        <Typography sx={{ minWidth: "2em", textAlign: "right", fontWeight: "bold" }}>
          {hasRolled ? hits : total}
        </Typography>
      </Stack>

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
