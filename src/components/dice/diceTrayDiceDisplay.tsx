import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { DiceResult } from "#/components/system/dice/diceResult.tsx"
import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { selectAllDice, useDiceRollerSelector } from "#/system/dice/diceRoller.selectors.ts"

import { useDiceTray } from "./diceTrayContext.ts"

export const DiceTrayDiceDisplay: FC = () => {
  const diceTrayApi = useDiceTray()
  const poolSize = useSelector(diceTrayApi.store, (state) => state.poolSize)
  const physicalMode = useSelector(diceTrayApi.store, (state) => state.physicalMode)
  const physicalHits = useSelector(diceTrayApi.store, (state) => state.physicalHits)
  const allDice = useDiceRollerSelector(diceTrayApi.roller, selectAllDice)

  const edgeDiceCount = Math.max(0, allDice.length - poolSize)

  if (physicalMode) {
    return (
      <Stack sx={{ alignItems: "center", paddingY: 2 }}>
        <CounterInput
          value={physicalHits}
          onChange={(newValue) => diceTrayApi.setPhysicalHits(newValue ?? 0)}
          min={0}
          max={99}
          label="Hits"
        />
      </Stack>
    )
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Box>
        <Label label="Pool Dice" variant="text" />
        <DiceResult
          roller={diceTrayApi.roller}
          iconSize={48}
          startIndex={0}
          endIndex={poolSize}
        />
      </Box>

      {edgeDiceCount > 0 && (
        <Box>
          <Label label={`Edge Dice (${edgeDiceCount})`} color="warning.main" variant="text" />
          <DiceResult
            roller={diceTrayApi.roller}
            iconSize={48}
            startIndex={poolSize}
          />
        </Box>
      )}
    </Stack>
  )
}
