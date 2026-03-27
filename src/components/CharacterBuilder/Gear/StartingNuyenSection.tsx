import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { GearNuyenPerBuildPoint, useGearTotalCost } from "#/components/CharacterBuilder/Gear/GearUtils.ts"
import { formatNuyen } from "#/components/UI/Nuyen.tsx"
import { Label } from "#/components/UI/Text/Label.tsx"
import { Lifestyles } from "#/lib/system/LifestyleType.ts"

function rollDice(numDice: number): number {
  let total = 0
  for (let i = 0; i < numDice; i++) {
    total += Math.ceil(Math.random() * 6)
  }
  return total
}

export const StartingNuyenSection: FC = () => {
  const lifestyle = useCharacterBuilderStore((state) => state.lifestyle)
  const { numDice, mult } = Lifestyles[lifestyle].starting

  const totalNuyen = useGearTotalCost()
  // Unspent nuyen is the leftover from the last BP purchased.
  // e.g. spent 24,700¥ → buys 5 BP (25,000¥) → 300¥ unspent → +3 bonus
  const bpsPurchased = Math.ceil(totalNuyen / GearNuyenPerBuildPoint)
  const nuyenAllocated = bpsPurchased * GearNuyenPerBuildPoint
  const unspentNuyen = totalNuyen === 0 ? 0 : nuyenAllocated - totalNuyen
  const maxBonus = numDice * 3
  const bonus = Math.min(Math.floor(unspentNuyen / 100), maxBonus)

  const [diceResult, setDiceResult] = useState<number | null>(null)

  const handleRoll = () => setDiceResult(rollDice(numDice))

  const minResult = (numDice + bonus) * mult
  const maxResult = numDice * 6 * mult + bonus * mult
  const rolledTotal = diceResult !== null ? (diceResult + bonus) * mult : null

  const diceLabel = bonus > 0 ? `${numDice}D6 + ${bonus}` : `${numDice}D6`

  return (
    <Stack gap={1.5}>
      <Divider />

      <Stack gap={1}>
        <Label label="Starting Nuyen" variant="outlined" />

        <Label label={`Lifestyle: ${lifestyle}`} variant="text" color="text.default" />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            (
            {diceLabel}
            )
            {" "}
            ×
            {" "}
            {mult.toLocaleString("en")}
            ¥
          </Typography>

          <Typography variant="body2" color="secondary.light">
            {formatNuyen(minResult)}
            {" – "}
            {formatNuyen(maxResult)}
          </Typography>
        </Stack>

        {bonus > 0 && (
          <Typography variant="caption" color="text.secondary">
            +
            {bonus}
            {" "}
            bonus from
            {" "}
            {formatNuyen(unspentNuyen)}
            {" "}
            unspent
            {" "}
            (max +
            {maxBonus}
            )
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
