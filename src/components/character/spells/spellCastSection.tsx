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
import { darken, lighten } from "@mui/material/styles"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { useAttr } from "#/components/character/characterUtils.ts"
import { DrainResistanceDicePool } from "#/components/character/spells/drainResistanceDicePool.tsx"
import { computeDrainValue } from "#/components/character/spells/spellDrainFormula.ts"
import { SpellcastingDicePool } from "#/components/character/spells/spellcastingDicePool.tsx"
import { useDamageStore } from "#/components/damage/useDamageStore.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import type { SpellData } from "#/lib/system/magic/spellData.ts"

interface SpellCastSectionProps {
  spell: SpellData
  onClose: () => void
}

export const SpellCastSection: FC<SpellCastSectionProps> = ({ spell, onClose }) => {
  const magicAttr = useAttr(AttributeKey.magic)
  const tradition = useCharacterSheet((sheet) => sheet.tradition)
  const drainAttribute = tradition?.drainAttribute ?? AttributeKey.willpower

  const [force, setForce] = useState<number>(Math.max(1, magicAttr))

  const maxForce = Math.max(1, magicAttr * 2)
  const isOvercasting = force > magicAttr
  const drainDv = computeDrainValue(force, spell)
  const drainIsPhysical = isOvercasting

  const damageStore = useDamageStore()

  const handleApplyDrain = (amount: number) => {
    if (amount <= 0) return
    if (drainIsPhysical) {
      damageStore.physical.setValue(Math.min(damageStore.physical.max, damageStore.physical.current + amount))
    } else {
      damageStore.stun.setValue(Math.min(damageStore.stun.max, damageStore.stun.current + amount))
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
          ? (theme) => {
              const fn = theme.palette.mode === "light" ? lighten : darken
              return fn(theme.palette.error.light, 0.9)
            }
          : undefined,
      }}
    >
      <Stack gap={1}>
        <Stack gap={0.5}>
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
            <SpellcastingDicePool />
          </Grid>
          <Grid size={1}>
            <DrainResistanceDicePool drainAttribute={drainAttribute} />
          </Grid>
        </Grid>

        <Divider />

        <Stack gap={0.5}>
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
