import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Alert from "@mui/material/Alert"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC, SyntheticEvent } from "react"
import { useState } from "react"
import { ArmorSection } from "#/components/Character/Form/Gear/Armor/ArmorSection.tsx"
import { CyberwareSection } from "#/components/Character/Form/Gear/Cyberware/CyberwareSection.tsx"
import {
  GearBpAllowance,
  GearNuyenBudget,
} from "#/components/Character/Form/Gear/GearSectionRequirements.ts"
import { getGearItemTotalCost } from "#/components/Character/Form/Gear/Generic/Forms/GearItemFormState.ts"
import { SinsAndLicensesSection } from "#/components/Character/Form/Gear/Licenses/SinsAndLicensesSection.tsx"
import { MiscSection } from "#/components/Character/Form/Gear/Misc/MiscSection.tsx"
import { SectionHeader } from "#/components/Character/Form/Gear/SectionHeader.tsx"
import { useGearFormGroup } from "#/components/Character/Form/Gear/UseGearFormGroup.ts"
import { VehiclesSection } from "#/components/Character/Form/Gear/Vehicles/VehiclesSection.tsx"
import { WeaponsSection } from "#/components/Character/Form/Gear/Weapons/WeaponsSection.tsx"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"
import { Nuyen } from "#/components/UI/Nuyen.tsx"

interface GearFormGroupProps {
  form: PlayerCharacterForm
}

export const GearFormGroup: FC<GearFormGroupProps> = ({ form }) => {
  const { totalNuyen, totalBp, isOverBudget } = useGearFormGroup(form)
  const [activeSection, setActiveSection] = useState<SectionHeader | null>(
    SectionHeader.Licenses,
  )

  const progressPercent = Math.min(
    100,
    Math.round((totalNuyen / GearNuyenBudget) * 100),
  )

  const onSectionChange = (section: SectionHeader) => {
    return (_: SyntheticEvent, isExpanded: boolean) => {
      setActiveSection(isExpanded ? section : null)
    }
  }

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
          value={progressPercent}
          color={isOverBudget ? "error" : "primary"}
        />
      </Stack>

      {isOverBudget && (
        <Alert severity="error">
          Gear budget exceeded! Maximum is <Nuyen amount={GearNuyenBudget} /> (
          {GearBpAllowance} BP).
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
              <Typography>{sectionName}</Typography>
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
  switch (section) {
    case SectionHeader.Weapons:
      return <WeaponsSection form={form} />
    case SectionHeader.Armor:
      return <ArmorSection form={form} />
    case SectionHeader.Licenses:
      return <SinsAndLicensesSection form={form} />
    case SectionHeader.Vehicles:
      return <VehiclesSection form={form} />
    case SectionHeader.Cyberware:
      return <CyberwareSection form={form} />
    case SectionHeader.Misc:
      return <MiscSection form={form} />
  }
}

const GearSectionNuyen: FC<{
  form: PlayerCharacterForm
  section: SectionHeader
}> = ({ form, section }) => {
  const gear = useStore(form.store, ({ values }) => values.gear)
  let nuyen = 0

  switch (section) {
    case SectionHeader.Licenses:
      nuyen += gear.sins.reduce((sum, sin) => sum + sin.cost, 0)
      nuyen += gear.licenses.reduce((sum, license) => sum + license.cost, 0)
      break
    case SectionHeader.Weapons:
      nuyen += gear.weapons.reduce(
        (sum, item) => sum + getGearItemTotalCost(item),
        0,
      )
      break
    case SectionHeader.Armor:
      nuyen += gear.armor.reduce(
        (sum, item) => sum + getGearItemTotalCost(item),
        0,
      )
      break
    case SectionHeader.Vehicles:
      nuyen += gear.vehicles.reduce(
        (sum, item) => sum + getGearItemTotalCost(item),
        0,
      )
      break
    case SectionHeader.Cyberware:
      nuyen += gear.cyberware.reduce(
        (sum, item) => sum + getGearItemTotalCost(item),
        0,
      )
      break
    case SectionHeader.Misc:
      nuyen += gear.misc.reduce(
        (sum, item) => sum + getGearItemTotalCost(item),
        0,
      )
      break
  }

  return (
    <Typography variant="body2" color="text.secondary">
      <Nuyen amount={nuyen} />
    </Typography>
  )
}
