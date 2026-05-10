import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"

import { useAttr } from "#/components/character/attributes/useAttr.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { DrainResistanceDicePool } from "#/components/character/spells/drainResistanceDicePool.tsx"
import {
  selectPhysicalCurrent,
  selectPhysicalMax,
  selectStunCurrent,
  selectStunMax,
} from "#/components/system/damage/damageSelectors.ts"
import { useDamageStore } from "#/components/system/damage/useDamageStore.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { SpiritType } from "#/system/magic/spiritData.ts"

import { SummoningDicePool } from "./summoningDicePool.tsx"

interface SummoningSectionProps {
  spiritType: SpiritType
  force: number
  isBound: boolean
}

export const SummoningSection: FC<SummoningSectionProps> = ({ spiritType, force, isBound }) => {
  const magicAttr = useAttr(AttributeKey.magic)
  const tradition = useCharacterSheet((sheet) => sheet.tradition)
  const drainAttribute = tradition?.drainAttribute ?? AttributeKey.willpower

  const isOverforce = force > magicAttr
  const drainIsPhysical = isOverforce

  const damageStore = useDamageStore()
  const physicalMax = useSelector(damageStore, selectPhysicalMax)
  const physicalCurrent = useSelector(damageStore, selectPhysicalCurrent)
  const stunMax = useSelector(damageStore, selectStunMax)
  const stunCurrent = useSelector(damageStore, selectStunCurrent)

  const handleApplyDrain = (amount: number) => {
    if (amount <= 0) return
    if (drainIsPhysical) {
      damageStore.setDamage(DamageTrackKey.physical, Math.min(physicalMax, physicalCurrent + amount))
    } else {
      damageStore.setDamage(DamageTrackKey.stun, Math.min(stunMax, stunCurrent + amount))
    }
  }

  const drainAmountOptions = Array.from({ length: force + 1 }, (_, i) => i)

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: isOverforce ? "error.main" : "divider",
        borderRadius: 1,
        padding: 1,
        bgcolor: isOverforce
          ? "rgba(var(--mui-palette-error-mainChannel) / 0.15)"
          : undefined,
      }}
    >
      <Stack sx={{ gap: 1 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Label label={isBound ? "Bind" : "Summon"} variant="text" />
          {isOverforce && (
            <Typography color="error.main">
              Force exceeds Magic — drain is Physical
            </Typography>
          )}
        </Stack>

        <Grid container spacing={1} columns={2}>
          <Grid size={1}>
            <SummoningDicePool spiritType={spiritType} isBound={isBound} />
          </Grid>
          <Grid size={1}>
            <DrainResistanceDicePool drainAttribute={drainAttribute} />
          </Grid>
        </Grid>

        <Divider />

        <Stack sx={{ gap: 0.5 }}>
          <Label
            label={`Apply Drain — ${drainIsPhysical ? "Physical" : "Stun"}`}
            variant="text"
            color={drainIsPhysical ? "error.main" : "text.secondary"}
          />
          <ButtonGroup size="small" variant="outlined" fullWidth>
            {drainAmountOptions.map((amount) => (
              <Button
                key={amount}
                color={drainIsPhysical ? "error" : "primary"}
                onClick={() => handleApplyDrain(amount)}
              >
                {amount}
              </Button>
            ))}
          </ButtonGroup>
        </Stack>
      </Stack>
    </Box>
  )
}
