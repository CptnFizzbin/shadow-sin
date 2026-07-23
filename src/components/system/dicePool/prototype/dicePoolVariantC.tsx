import Box from "@mui/material/Box"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine, RiArrowUpSLine, RiDice6Line } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

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
 * Variant C — Compact Row, Expand for Detail.
 *
 * Collapsed to a single dense row by default so a whole page of pools stays
 * scannable: name, total, roll icon. Rolling never requires expanding — the
 * icon button rolls right from the collapsed row and the result appears
 * inline. The breakdown ledger is opt-in, tucked behind a caret.
 */
export const DicePoolVariantC: FC<DicePoolVariantProps> = ({ name, groups }) => {
  const [expanded, setExpanded] = useState(false)
  const diceGroups = groups.flat().filter(isDiceGroup)
  const total = getPoolSize(diceGroups)

  const diceRoller = useDiceRoller(total)
  const hasRolled = useDiceRollerSelector(diceRoller, selectWasRolled)
  const hits = useDiceRollerSelector(diceRoller, selectHits)
  const isGlitch = useDiceRollerSelector(diceRoller, selectIsGlitch)
  const isCriticalGlitch = useDiceRollerSelector(diceRoller, selectIsCriticalGlitch)

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider" }}>
      <Stack direction="row" sx={{ gap: 1, alignItems: "center", padding: 1 }}>
        <IconButton
          size="small"
          color={isCriticalGlitch || isGlitch ? "error" : "primary"}
          aria-label={`Roll ${name}`}
          onClick={() => {
            diceRoller.reset()
            diceRoller.rollAll()
          }}
        >
          <RiDice6Line size={20} />
        </IconButton>

        <Typography noWrap sx={{ flexGrow: 1, fontWeight: "bold" }}>{name}</Typography>

        {hasRolled
          ? <DiceResult roller={diceRoller} iconSize={16} />
          : (
              <Typography sx={{ minWidth: "2em", textAlign: "right" }}>{total}</Typography>
            )}

        {hasRolled && (
          <Typography
            variant="caption"
            color={isCriticalGlitch || isGlitch ? "error.main" : "text.secondary"}
            sx={{ minWidth: "3em", textAlign: "right" }}
          >
            {isCriticalGlitch ? "CRIT!" : isGlitch ? "Glitch" : `${hits} hits`}
          </Typography>
        )}

        <IconButton size="small" onClick={() => setExpanded((prev) => !prev)} aria-label="Toggle breakdown">
          {expanded ? <RiArrowUpSLine size={18} /> : <RiArrowDownSLine size={18} />}
        </IconButton>
      </Stack>

      <Collapse in={expanded}>
        <Box sx={{ paddingBottom: 1 }}>
          {diceGroups.map((group) => (
            <DiceGroupDisplay
              key={`${name}-${group.id ?? group.name}`}
              name={group.name}
              size={group.size}
              color={group.color}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  )
}
