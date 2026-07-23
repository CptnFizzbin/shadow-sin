import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useDiceRoller } from "#/components/system/dice/useDiceRoller.ts"
import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { isDiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { getPoolSize } from "#/components/system/dicePool/dicePoolData.tsx"
import {
  selectHits,
  selectIsCriticalGlitch,
  selectIsGlitch,
  selectIsRolling,
  selectWasRolled,
  useDiceRollerSelector,
} from "#/system/dice/diceRoller.selectors.ts"

interface DicePoolVariantProps {
  name: string
  groups: DiceGroupList
}

/**
 * Variant B — Hero Dial + Chips.
 *
 * The total pool is the whole point of a dice pool, so it becomes a big
 * tappable dial instead of a line in a ledger. Modifiers move to a wrapped
 * row of small chips underneath — still all visible, just no longer
 * competing with the total for attention. Tapping the dial rolls it in
 * place; the number inside swaps from "pool size" to "hits rolled".
 */
export const DicePoolVariantB: FC<DicePoolVariantProps> = ({ name, groups }) => {
  const diceGroups = groups.flat().filter(isDiceGroup)
  const total = getPoolSize(diceGroups)

  const diceRoller = useDiceRoller(total)
  const hasRolled = useDiceRollerSelector(diceRoller, selectWasRolled)
  const isRolling = useDiceRollerSelector(diceRoller, selectIsRolling)
  const hits = useDiceRollerSelector(diceRoller, selectHits)
  const isGlitch = useDiceRollerSelector(diceRoller, selectIsGlitch)
  const isCriticalGlitch = useDiceRollerSelector(diceRoller, selectIsCriticalGlitch)

  const dialColor = isCriticalGlitch
    ? "error.main"
    : isGlitch
      ? "error.main"
      : hasRolled
        ? "success.main"
        : "primary.main"

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", padding: 1.5 }}>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
        <Box
          component="button"
          onClick={() => {
            diceRoller.reset()
            diceRoller.rollAll()
          }}
          sx={{
            "width": 64,
            "height": 64,
            "borderRadius": "50%",
            "border": "3px solid",
            "borderColor": dialColor,
            "backgroundColor": "transparent",
            "color": dialColor,
            "display": "flex",
            "flexDirection": "column",
            "alignItems": "center",
            "justifyContent": "center",
            "cursor": "pointer",
            "flexShrink": 0,
            "animation": isRolling ? "pulse 0.4s ease-in-out infinite alternate" : undefined,
            "@keyframes pulse": {
              from: { opacity: 0.5 },
              to: { opacity: 1 },
            },
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem", lineHeight: 1 }}>
            {hasRolled ? hits : total}
          </Typography>
          <Typography sx={{ fontSize: "0.6rem", textTransform: "uppercase" }}>
            {hasRolled ? "hits" : "dice"}
          </Typography>
        </Box>

        <Stack sx={{ gap: 0.25, minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ fontWeight: "bold" }} noWrap>{name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {isCriticalGlitch
              ? "Critical glitch!"
              : isGlitch
                ? "Glitch!"
                : hasRolled
                  ? "Tap the dial to reroll"
                  : "Tap the dial to roll"}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap", marginTop: 1 }}>
        {diceGroups.map((group) => (
          <Chip
            key={`${name}-${group.id ?? group.name}`}
            size="small"
            label={`${group.name} ${group.size >= 0 ? "+" : ""}${group.size}`}
            sx={{ color: group.color, borderColor: group.color }}
            variant="outlined"
          />
        ))}
      </Stack>
    </Box>
  )
}
