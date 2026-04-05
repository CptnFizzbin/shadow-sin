import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine } from "@remixicon/react"
import { produce } from "immer"
import type { FC } from "react"
import { useState } from "react"

import { AttributesSection } from "#/components/attributes/attributesSection.tsx"
import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { useEdgeApi } from "#/components/character/quickPanel/useEdgeApi.ts"
import { useDamageApi } from "#/components/damage/useDamageApi.ts"
import { Label } from "#/components/ui/text/label.tsx"

export const QUICK_ACCESS_PANEL_HEIGHT = "56px"

const counterButtonSx = {
  "width": 32,
  "height": 32,
  "border": "1px solid",
  "borderColor": "primary.dark",
  "backgroundColor": "background.paper",
  "color": "text.primary",
  "cursor": "pointer",
  "fontSize": "1.25rem",
  "display": "flex",
  "alignItems": "center",
  "justifyContent": "center",
  "&:disabled": {
    borderColor: "action.disabled",
    color: "action.disabled",
    cursor: "not-allowed",
  },
  "&:hover:not(:disabled)": {
    backgroundColor: "primary.light",
    color: "common.black",
  },
} as const

interface DamageCounterProps {
  label: string
  current: number
  max: number
  onIncrement: () => void
  onDecrement: () => void
}

const DamageCounter: FC<DamageCounterProps> = ({
  label,
  current,
  max,
  onIncrement,
  onDecrement,
}) => {
  return (
    <Stack alignItems="center" gap={0.5}>
      <Label label={label} />
      <Stack direction="row" alignItems="center" gap={0.5}>
        <Box
          component="button"
          type="button"
          onClick={onDecrement}
          disabled={current <= 0}
          sx={counterButtonSx}
        >
          −
        </Box>
        <Typography variant="body1" sx={{ minWidth: 48, textAlign: "center" }}>
          {current} / {max}
        </Typography>
        <Box
          component="button"
          type="button"
          onClick={onIncrement}
          disabled={current >= max}
          sx={counterButtonSx}
        >
          +
        </Box>
      </Stack>
    </Stack>
  )
}

export const QuickAccessPanel: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const sheetStore = useCharacterSheetContext()
  const damageApi = useDamageApi()
  const edgeApi = useEdgeApi()

  const incrementPhysical = () => {
    sheetStore.setState(
      produce((sheet) => {
        sheet.damage.physical = Math.min(
          sheet.damage.physical + 1,
          damageApi.physical.max,
        )
      }),
    )
  }

  const decrementPhysical = () => {
    sheetStore.setState(
      produce((sheet) => {
        sheet.damage.physical = Math.max(0, sheet.damage.physical - 1)
      }),
    )
  }

  const incrementStun = () => {
    sheetStore.setState(
      produce((sheet) => {
        sheet.damage.stun = Math.min(
          sheet.damage.stun + 1,
          damageApi.stun.max,
        )
      }),
    )
  }

  const decrementStun = () => {
    sheetStore.setState(
      produce((sheet) => {
        sheet.damage.stun = Math.max(0, sheet.damage.stun - 1)
      }),
    )
  }

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={isExpanded}
      onChange={(_, expanded) => setIsExpanded(expanded)}
      sx={{
        "border": "1px solid",
        "borderColor": "divider",
        "& .MuiAccordionSummary-content": { margin: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={<RiArrowDownSLine />}
        sx={{ padding: 1, margin: 0, minHeight: "unset" }}
      >
        <Typography variant="body2" color="text.secondary">
          Quick Access
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ padding: 1 }}>
        <Stack gap={1.5} divider={<Divider />}>
          <Stack gap={0.5}>
            <Label label="Attributes" variant="text" textAlign="left" />
            <AttributesSection showLabels={false} />
          </Stack>

          <Stack gap={0.5}>
            <Label label="Damage" variant="text" textAlign="left" />
            <Grid container columns={2} spacing={1}>
              <Grid size={1}>
                <DamageCounter
                  label="Physical"
                  current={damageApi.physical.current}
                  max={damageApi.physical.max}
                  onIncrement={incrementPhysical}
                  onDecrement={decrementPhysical}
                />
              </Grid>
              <Grid size={1}>
                <DamageCounter
                  label="Stun"
                  current={damageApi.stun.current}
                  max={damageApi.stun.max}
                  onIncrement={incrementStun}
                  onDecrement={decrementStun}
                />
              </Grid>
            </Grid>
          </Stack>

          <Stack gap={0.5}>
            <Label label="Edge" variant="text" textAlign="left" />
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography variant="h6" sx={{ minWidth: 48, textAlign: "center" }}>
                {edgeApi.current} / {edgeApi.max}
              </Typography>
              <Stack direction="row" gap={0.5} flexWrap="wrap">
                <Button
                  variant="outlined"
                  size="small"
                  disabled={edgeApi.current <= 0}
                  onClick={edgeApi.spend}
                >
                  Spend
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={edgeApi.current >= edgeApi.max}
                  onClick={edgeApi.recharge}
                >
                  Recharge
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  disabled={edgeApi.max <= 1}
                  onClick={edgeApi.burn}
                >
                  Burn
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
