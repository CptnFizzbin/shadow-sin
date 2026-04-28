import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Divider from "@mui/material/Divider"
import FormControl from "@mui/material/FormControl"
import Grid from "@mui/material/Grid"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { alpha } from "@mui/material/styles"
import { useSelector } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useAttr } from "#/components/character/characterUtils.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { DrainResistanceDicePool } from "#/components/character/spells/drainResistanceDicePool.tsx"
import { computeDrainValue } from "#/components/character/spells/spellDrainFormula.ts"
import { SpellcastingDicePool } from "#/components/character/spells/spellcastingDicePool.tsx"
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
import type { SpellData } from "#/system/magic/spellData.ts"

interface SpellCastSectionProps {
  spell: SpellData
  onClose: () => void
  onRoll: (count: number) => void
}

export const SpellCastSection: FC<SpellCastSectionProps> = ({ spell, onClose, onRoll }) => {
  const magicAttr = useAttr(AttributeKey.magic)
  const tradition = useCharacterSheet((sheet) => sheet.tradition)
  const drainAttribute = tradition?.drainAttribute ?? AttributeKey.willpower

  const [force, setForce] = useState<number>(Math.max(1, magicAttr))

  const maxForce = Math.max(1, magicAttr * 2)
  const isOvercasting = force > magicAttr
  const drainDv = computeDrainValue(force, spell)
  const drainIsPhysical = isOvercasting

  const damageStore = useDamageStore()
  const physicalMax = useSelector(damageStore, selectPhysicalMax)
  const physicalCurrent = useSelector(damageStore, selectPhysicalCurrent)
  const stunMax = useSelector(damageStore, selectStunMax)
  const stunCurrent = useSelector(damageStore, selectStunCurrent)

  const handleApplyDrain = (amount: number) => {
    if (amount > 0) {
      if (drainIsPhysical) {
        damageStore.setDamage(DamageTrackKey.physical, Math.min(physicalMax, physicalCurrent + amount))
      } else {
        damageStore.setDamage(DamageTrackKey.stun, Math.min(stunMax, stunCurrent + amount))
      }
    }
    onClose()
  }

  const drainAmountOptions = Array.from({ length: drainDv + 1 }, (_, i) => i)

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: isOvercasting ? "error.main" : "divider",
        borderRadius: 1,
        padding: 1,
        bgcolor: isOvercasting
          ? (theme) => alpha(theme.palette.error.main, 0.12)
          : undefined,
      }}
    >
      <Stack sx={{ gap: 1 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Label label="Cast" variant="text" />
          {isOvercasting && (
            <Typography color="error.main">
              Force exceeds Magic — drain is Physical
            </Typography>
          )}
        </Stack>

        <FormControl size="small" fullWidth>
          <InputLabel id="spell-force-label">Force</InputLabel>
          <Select
            labelId="spell-force-label"
            id="spell-force-select"
            value={force}
            label="Force"
            onChange={(e) => setForce(Number(e.target.value))}
          >
            {Array.from({ length: maxForce }, (_, i) => i + 1).map((forceValue) => (
              <MenuItem key={forceValue} value={forceValue}>
                {forceValue}
                {forceValue === magicAttr ? " (MAG)" : ""}
                {forceValue > magicAttr ? " ⚠️" : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={1} columns={2}>
          <Grid size={1}>
            <SpellcastingDicePool onRoll={onRoll} />
          </Grid>
          <Grid size={1}>
            <DrainResistanceDicePool drainAttribute={drainAttribute} onRoll={onRoll} />
          </Grid>
        </Grid>

        <Divider />

        <Stack sx={{ gap: 0.5 }}>
          <Label
            label={`Apply Drain — DV ${drainDv} ${drainIsPhysical ? "Physical" : "Stun"}`}
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
