import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDice6Line } from "@remixicon/react"
import type { FC } from "react"

import { useDiceRoller } from "#/components/system/dice/useDiceRoller.ts"
import type { DiceGroupList } from "#/components/system/dicePool/diceGroup.tsx"
import { isDiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { DiceGroupDisplay } from "#/components/system/dicePool/diceGroupDisplay.tsx"
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
 * Variant H — Icon Fused Into the Total Badge.
 *
 * No new row, no side panel, no floating badge — the die icon is fused
 * directly onto the total number that's already there in today's header,
 * turning the existing badge itself into the roll trigger. Rolling
 * recolors that same badge and swaps its number to hits; nothing else
 * about the ledger changes at all.
 */
export const DicePoolVariantH: FC<DicePoolVariantProps> = ({ name, groups }) => {
  const diceGroups = groups.flat().filter(isDiceGroup)
  const total = getPoolSize(diceGroups)

  const diceRoller = useDiceRoller(total)
  const hasRolled = useDiceRollerSelector(diceRoller, selectWasRolled)
  const isRolling = useDiceRollerSelector(diceRoller, selectIsRolling)
  const hits = useDiceRollerSelector(diceRoller, selectHits)
  const isGlitch = useDiceRollerSelector(diceRoller, selectIsGlitch)
  const isCriticalGlitch = useDiceRollerSelector(diceRoller, selectIsCriticalGlitch)

  const badgeColor = isCriticalGlitch || isGlitch
    ? "error.main"
    : hasRolled
      ? "success.dark"
      : "primary.light"

  return (
    <Box sx={{ display: "flex", flexDirection: "column", border: "1px solid", borderColor: "divider" }}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", gap: 1, paddingX: 1, backgroundColor: "primary.dark", color: "primary.contrastText" }}
      >
        <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>{name}</Typography>

        <Stack
          component="button"
          direction="row"
          onClick={() => {
            diceRoller.reset()
            diceRoller.rollAll()
          }}
          aria-label={`Roll ${name}`}
          sx={{
            alignItems: "center",
            gap: 0.5,
            border: "none",
            borderRadius: 1,
            paddingX: 0.75,
            paddingY: 0.25,
            marginY: 0.5,
            backgroundColor: badgeColor,
            color: "common.white",
            cursor: "pointer",
            fontWeight: "bold",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
        >
          <Box
            sx={{
              "display": "flex",
              "animation": isRolling ? "dicePoolVariantHSpin 0.5s linear infinite" : undefined,
              "@keyframes dicePoolVariantHSpin": {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" },
              },
            }}
          >
            <RiDice6Line size={16} />
          </Box>
          <Typography component="span" sx={{ fontWeight: "bold" }}>{hasRolled ? hits : total}</Typography>
        </Stack>
      </Stack>

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
