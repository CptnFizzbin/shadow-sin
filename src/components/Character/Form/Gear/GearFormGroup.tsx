import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"
import Slider from "@mui/material/Slider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"
import { SinsAndLicensesSection } from "#/components/Character/Form/Gear/SinsAndLicensesSection.tsx"
import {
  GEAR_BP_ALLOWANCE,
  GEAR_NUYEN_BUDGET,
  useGearFormGroup,
} from "#/components/Character/Form/Gear/UseGearFormGroup.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"

interface GearFormGroupProps {
  form: PlayerCharacterForm
}

const ACCORDION_SECTIONS = [
  "Weapons",
  "Armor",
  "Vehicles",
  "Cyberware",
  "Misc",
] as const

export const GearFormGroup: FC<GearFormGroupProps> = ({ form }) => {
  const { totalNuyen, gearBP, isOverBudget, maxAvailability } =
    useGearFormGroup(form)

  const [expandedSection, setExpandedSection] = useState<string | false>(
    "SINs & Licenses",
  )

  const progressPercent = Math.min(
    100,
    Math.round((totalNuyen / GEAR_NUYEN_BUDGET) * 100),
  )

  const handleAccordionChange =
    (section: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedSection(isExpanded ? section : false)
    }

  const handleMaxAvailabilityChange = (
    _: Event,
    newValue: number | number[],
  ) => {
    form.setFieldValue(
      "gear.maxAvailability",
      Array.isArray(newValue) ? newValue[0] : newValue,
    )
  }

  return (
    <Stack gap={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption">
          {totalNuyen.toLocaleString()}¥ / {GEAR_NUYEN_BUDGET.toLocaleString()}¥
        </Typography>
        <Typography variant="caption">
          {gearBP} / {GEAR_BP_ALLOWANCE} BP
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progressPercent}
        color={isOverBudget ? "error" : "primary"}
      />

      {isOverBudget && (
        <Alert severity="error" sx={{ py: 0.5 }}>
          Gear budget exceeded! Maximum is {GEAR_NUYEN_BUDGET.toLocaleString()}¥
          ({GEAR_BP_ALLOWANCE} BP).
        </Alert>
      )}

      <Box sx={{ px: 1 }}>
        <Typography
          variant="caption"
          component="label"
          sx={{ display: "block", mb: 0.5 }}
        >
          Max Availability: {maxAvailability}
        </Typography>
        <Slider
          value={maxAvailability}
          onChange={handleMaxAvailabilityChange}
          min={1}
          max={20}
          step={1}
          marks={[
            { value: 6, label: "6" },
            { value: 12, label: "12" },
            { value: 16, label: "16" },
            { value: 20, label: "20" },
          ]}
          size="small"
        />
      </Box>

      {ACCORDION_SECTIONS.map((sectionName) => (
        <Accordion
          key={sectionName}
          expanded={expandedSection === sectionName}
          onChange={handleAccordionChange(sectionName)}
          disableGutters
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <AccordionSummary expandIcon={<RiArrowDownSLine size={20} />}>
            <Typography>{sectionName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              Coming soon.
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Accordion
        expanded={expandedSection === "SINs & Licenses"}
        onChange={handleAccordionChange("SINs & Licenses")}
        disableGutters
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider" }}
      >
        <AccordionSummary expandIcon={<RiArrowDownSLine size={20} />}>
          <Typography>SINs &amp; Licenses</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SinsAndLicensesSection form={form} />
        </AccordionDetails>
      </Accordion>
    </Stack>
  )
}
