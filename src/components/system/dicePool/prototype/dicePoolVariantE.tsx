import Box from "@mui/material/Box"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDice6Line } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useDiceRoller } from "#/components/system/dice/useDiceRoller.ts"
import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { isDiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { getPoolSize } from "#/components/system/dicePool/dicePoolData.tsx"
import {
  selectAllDice,
  selectHits,
  selectIsGlitch,
  selectWasRolled,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"

interface DicePoolVariantProps {
  name: string
  groups: DiceGroupList
}

/**
 * Variant E — Minimal HUD Pill.
 *
 * As small as a dice pool can get: a single pill with a name, a roll icon,
 * and a result. Before rolling the pill just shows the pool size; after
 * rolling, that badge becomes a cluster of colored dots (one per die) so
 * you can read hits/glitches at a glance without counting pips. The
 * breakdown ledger is hidden entirely unless you tap the name to audit it —
 * this variant bets that most of the time you just want the number.
 */
export const DicePoolVariantE: FC<DicePoolVariantProps> = ({ name, groups }) => {
  const [expanded, setExpanded] = useState(false)
  const diceGroups = groups.flat().filter(isDiceGroup)
  const total = getPoolSize(diceGroups)

  const diceRoller = useDiceRoller(total)
  const hasRolled = useDiceRollerSelector(diceRoller, selectWasRolled)
  const hits = useDiceRollerSelector(diceRoller, selectHits)
  const isGlitch = useDiceRollerSelector(diceRoller, selectIsGlitch)
  const dice = useDiceRollerSelector(diceRoller, selectAllDice)

  return (
    <Box sx={{ display: "inline-block" }}>
      <Stack
        direction="row"
        sx={{
          gap: 0.75,
          alignItems: "center",
          borderRadius: "999px",
          border: "1px solid",
          borderColor: isGlitch ? "error.main" : "divider",
          paddingY: 0.25,
          paddingX: 0.75,
        }}
      >
        <IconButton
          size="small"
          aria-label={`Roll ${name}`}
          onClick={() => {
            diceRoller.reset()
            diceRoller.rollAll()
          }}
          sx={{ padding: 0.25 }}
        >
          <RiDice6Line size={16} />
        </IconButton>

        <Typography
          variant="body2"
          noWrap
          onClick={() => setExpanded((prev) => !prev)}
          sx={{ cursor: "pointer", textDecoration: "underline dotted", textUnderlineOffset: 3 }}
        >
          {name}
        </Typography>

        {hasRolled
          ? (
              <Stack direction="row" sx={{ gap: 0.25, alignItems: "center" }}>
                {dice.map((die, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: die.value === null
                        ? "action.disabled"
                        : die.value >= 5
                          ? "success.main"
                          : die.value === 1
                            ? "error.main"
                            : "action.disabled",
                    }}
                  />
                ))}
                <Typography variant="caption" sx={{ fontWeight: "bold", marginLeft: 0.25 }}>
                  {hits}
                </Typography>
              </Stack>
            )
          : (
              <Typography variant="caption" sx={{ fontWeight: "bold" }}>{total}</Typography>
            )}
      </Stack>

      <Collapse in={expanded}>
        <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap", paddingTop: 0.5, paddingX: 1 }}>
          {diceGroups.map((group) => (
            <Typography
              key={`${name}-${group.id ?? group.name}`}
              variant="caption"
              sx={{ color: group.color ?? "text.secondary" }}
            >
              {group.name}: {group.size >= 0 ? "+" : ""}{group.size}
            </Typography>
          ))}
        </Stack>
      </Collapse>
    </Box>
  )
}
