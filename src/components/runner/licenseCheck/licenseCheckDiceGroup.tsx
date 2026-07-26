import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { sort } from "fast-sort"
import type { FC } from "react"

import type { DieState } from "#/system/dice/dieState.ts"

interface LicenseCheckDiceGroupProps {
  label: string
  dice: DieState[]
}

export const LicenseCheckDiceGroup: FC<LicenseCheckDiceGroupProps> = ({ label, dice }) => {
  if (dice.length === 0) return null

  // Settled dice sort high → low; while still rolling, keep pool order so dice don't jump around.
  const ordered = dice.some((die) => die.isRolling)
    ? dice
    : sort(dice).by({ desc: (die) => die.value })

  return (
    <Stack direction="row" sx={{ gap: 0.75, alignItems: "center" }}>
      <Typography variant="caption" color="text.secondary" sx={{ width: 56, flexShrink: 0 }}>{label}</Typography>
      <Stack direction="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
        {ordered.map((die, index) => {
          const isHit = die.value !== null && die.value >= 5
          return (
            <Stack
              key={index}
              sx={{
                width: 20,
                height: 20,
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid",
                borderColor: isHit ? "success.main" : "divider",
                borderRadius: 0.5,
                color: isHit ? "success.main" : "text.secondary",
                fontSize: "0.7rem",
                fontWeight: isHit ? "bold" : "normal",
              }}
            >
              {die.value ?? "?"}
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}
