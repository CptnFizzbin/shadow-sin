import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Alert from "@mui/material/Alert"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import { useTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine, RiErrorWarningLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC, SyntheticEvent } from "react"
import { useState } from "react"
import {
  GearBpAllowance,
  GearMaxAvailability,
  GearNuyenBudget,
} from "#/components/Character/Form/Gear/GearSectionRequirements.ts"
import type { GearItemFormState } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { PlaceholderGearSection } from "#/components/Character/Form/Gear/Generic/PlaceholderGearSection.tsx"
import { getLicenseAvailability } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import { getSinAvailability } from "#/components/Character/Form/Gear/Licenses/Forms/SinFormState.ts"
import { SinsAndLicensesSection } from "#/components/Character/Form/Gear/Licenses/SinsAndLicensesSection.tsx"
import { SectionHeader } from "#/components/Character/Form/Gear/SectionHeader.tsx"
import { useGearFormGroup } from "#/components/Character/Form/Gear/UseGearFormGroup.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"
import type { CharacterFormState } from "#/components/Character/Form/CharacterFormState.ts"
import { Nuyen } from "#/components/UI/Nuyen.tsx"
import { getProgress } from "#/lib/ProgressUtils.ts"

interface GearFormGroupProps {
  form: PlayerCharacterForm
}

const sectionConfig: Partial<
  Record<
    SectionHeader,
    {
      field:
        | "gear.weapons"
        | "gear.armor"
        | "gear.vehicles"
        | "gear.cyberware"
        | "gear.misc"
      label: string
    }
  >
> = {
  [SectionHeader.Weapons]: { field: "gear.weapons", label: "Weapon" },
  [SectionHeader.Armor]: { field: "gear.armor", label: "Armor" },
  [SectionHeader.Vehicles]: { field: "gear.vehicles", label: "Vehicle" },
  [SectionHeader.Cyberware]: { field: "gear.cyberware", label: "Cyberware" },
  [SectionHeader.Misc]: { field: "gear.misc", label: "Item" },
}

export const GearFormGroup: FC<GearFormGroupProps> = ({ form }) => {
  const theme = useTheme()
  const { totalNuyen, totalBp, isOverBudget, gear } = useGearFormGroup(form)
  const [activeSection, setActiveSection] = useState<SectionHeader | null>(null)

  const onSectionChange = (section: SectionHeader) => {
    return (_: SyntheticEvent, isExpanded: boolean) => {
      setActiveSection(isExpanded ? section : null)
    }
  }

  // determine availability issues per section
  const sectionInvalid = new Set<SectionHeader>()
  let totalInvalidCount = 0

  Object.values(SectionHeader).forEach((sectionName) => {
    if (sectionName === SectionHeader.Licenses) {
      const sins = gear.sins || []
      const licenses = gear.licenses || []
      const sinInvalid = sins.some(
        (s) => getSinAvailability(s.rating).rating > GearMaxAvailability,
      )
      const licInvalid = licenses.some(
        (l) => getLicenseAvailability(l.rating).rating > GearMaxAvailability,
      )
      if (sinInvalid || licInvalid) {
        sectionInvalid.add(sectionName)
        totalInvalidCount +=
          sins.filter(
            (s) => getSinAvailability(s.rating).rating > GearMaxAvailability,
          ).length +
          licenses.filter(
            (l) =>
              getLicenseAvailability(l.rating).rating > GearMaxAvailability,
          ).length
      }
    } else {
      const config = sectionConfig[sectionName]
      if (config) {
        const sectionKey = config.field.split(".")[1] as
          | "weapons"
          | "armor"
          | "vehicles"
          | "cyberware"
          | "misc"
        const items = (gear as CharacterFormState["gear"])[sectionKey] || []
        const invalidItems = (items as GearItemFormState[]).filter(
          (it) => (it.availability?.rating ?? Number.NEGATIVE_INFINITY) > GearMaxAvailability,
        )
        if (invalidItems.length > 0) {
          sectionInvalid.add(sectionName)
          totalInvalidCount += invalidItems.length
        }
      }
    }
  })

  const hasAvailabilityWarnings = totalInvalidCount > 0

  return (
    <Stack gap={1}>
      <Stack gap={0.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="caption">
            <Nuyen amount={totalNuyen} /> / <Nuyen amount={GearNuyenBudget} />
          </Typography>
          <Typography variant="caption">
            {totalBp} / {GearBpAllowance} BP
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={getProgress(totalNuyen, GearNuyenBudget)}
          color={isOverBudget ? "error" : "primary"}
        />
      </Stack>

      {isOverBudget && (
        <Alert severity="error">
          Gear budget exceeded! Maximum is <Nuyen amount={GearNuyenBudget} /> (
          {GearBpAllowance} BP).
        </Alert>
      )}

      {hasAvailabilityWarnings && (
        <Alert severity="warning">
          {totalInvalidCount} gear item{totalInvalidCount > 1 ? "s" : ""} exceed
          the maximum availability ({GearMaxAvailability}). Check highlighted
          items.
        </Alert>
      )}

      {Object.values(SectionHeader).map((sectionName) => (
        <Accordion
          key={sectionName}
          expanded={activeSection === sectionName}
          onChange={onSectionChange(sectionName)}
          disableGutters
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            padding: 0,
            margin: 0,
            "& .MuiAccordionSummary-content": {
              margin: 0,
            },
          }}
        >
          <AccordionSummary
            expandIcon={<RiArrowDownSLine />}
            sx={{ padding: 1, margin: 0, minHeight: "unset" }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                flexGrow: 1,
                paddingRight: 1,
                marginRight: 1,
                borderRight: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography>{sectionName}</Typography>
                {sectionInvalid.has(sectionName) && (
                  <RiErrorWarningLine
                    size={16}
                    style={{ color: theme.palette.warning.main }}
                  />
                )}
              </Stack>

              <GearSectionNuyen form={form} section={sectionName} />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 1 }}>
            <GearSectionContent form={form} section={sectionName} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  )
}

const GearSectionContent: FC<{
  form: PlayerCharacterForm
  section: SectionHeader
}> = ({ form, section }) => {
  if (section === SectionHeader.Licenses) {
    return <SinsAndLicensesSection form={form} />
  }
  const config = sectionConfig[section]
  if (config) {
    return (
      <PlaceholderGearSection
        form={form}
        field={config.field}
        label={config.label}
      />
    )
  }
  return null
}

const GearSectionNuyen: FC<{
  form: PlayerCharacterForm
  section: SectionHeader
}> = ({ form, section }) => {
  const gear = useStore(form.store, ({ values }) => values.gear)
  let nuyen = 0

  if (section === SectionHeader.Licenses) {
    nuyen =
      gear.sins.reduce((sum, sin) => sum + sin.cost, 0) +
      gear.licenses.reduce((sum, license) => sum + license.cost, 0)
  } else {
    const config = sectionConfig[section]
    if (config) {
      const sectionKey = config.field.split(".")[1] as
        | "weapons"
        | "armor"
        | "vehicles"
        | "cyberware"
        | "misc"
      nuyen = gear[sectionKey].reduce((sum, item) => sum + item.cost, 0)
    }
  }

  return (
    <Typography variant="body2" color="text.secondary">
      <Nuyen amount={nuyen} />
    </Typography>
  )
}
