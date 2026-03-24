import { useTheme } from "@mui/material"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Alert from "@mui/material/Alert"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine, RiErrorWarningLine } from "@remixicon/react"
import type { FC, SyntheticEvent } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { ArmorPanel } from "#/components/Character/Form/Gear/Armor/ArmorPanel.tsx"
import { CyberwarePanel } from "#/components/Character/Form/Gear/Cyberware/CyberwarePanel.tsx"
import { getImplantEffectiveNuyenCost } from "#/components/Character/Form/Gear/Cyberware/ImplantUtils.ts"
import { DevicesPanel } from "#/components/Character/Form/Gear/Devices/DevicesPanel.tsx"
import {
  GearBpAllowance,
  GearMaxAvailability,
  GearNuyenBudget,
} from "#/components/Character/Form/Gear/GearSectionRequirements.ts"
import { SinsAndLicensesSection } from "#/components/Character/Form/Gear/Licenses/SinsAndLicensesSection.tsx"
import { LifestylePanel } from "#/components/Character/Form/Gear/Lifestyle/LifestylePanel.tsx"
import { MiscPanel } from "#/components/Character/Form/Gear/Misc/MiscPanel.tsx"
import { SectionHeader } from "#/components/Character/Form/Gear/SectionHeader.tsx"
import { useGearFormGroup } from "#/components/Character/Form/Gear/UseGearFormGroup.ts"
import { VehiclesPanel } from "#/components/Character/Form/Gear/Vehicles/VehiclesPanel.tsx"
import { WeaponsPanel } from "#/components/Character/Form/Gear/Weapons/WeaponsPanel.tsx"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"
import { getProgress } from "#/lib/ProgressUtils.ts"
import { Lifestyles } from "#/lib/system/types/LifestyleType.ts"
import {
  getLicenseAvailability,
  getSinAvailability,
} from "#/lib/system/types/gear/SinUtils.ts"

export const GearSection: FC = () => {
  const theme = useTheme()

  const { totalNuyen, totalBp, isOverBudget, gear } = useGearFormGroup()
  const [activeSection, setActiveSection] = useState<SectionHeader | null>(null)

  const onSectionChange = (section: SectionHeader) => {
    return (_: SyntheticEvent, isExpanded: boolean) => {
      setActiveSection(isExpanded ? section : null)
    }
  }

  const sectionInvalid = new Set<SectionHeader>()
  let totalInvalidCount = 0

  const genericSectionKeys: Partial<
    Record<SectionHeader, "weapons" | "armor" | "vehicles" | "devices" | "misc">
  > = {
    [SectionHeader.Weapons]: "weapons",
    [SectionHeader.Armor]: "armor",
    [SectionHeader.Vehicles]: "vehicles",
    [SectionHeader.Devices]: "devices",
    [SectionHeader.Misc]: "misc",
  }

  Object.values(SectionHeader).forEach((sectionName) => {
    if (sectionName === SectionHeader.Licenses) {
      const sins = gear.sins || []
      const sinInvalid = sins.some(
        (sin) =>
          getSinAvailability(sin.verification).rating > GearMaxAvailability,
      )
      const licInvalid = sins.some((sin) =>
        (sin.licenses ?? []).some(
          (lic) =>
            getLicenseAvailability(lic.verification).rating >
            GearMaxAvailability,
        ),
      )
      if (sinInvalid || licInvalid) {
        sectionInvalid.add(sectionName)
        totalInvalidCount +=
          sins.filter(
            (sin) =>
              getSinAvailability(sin.verification).rating > GearMaxAvailability,
          ).length +
          sins.reduce(
            (count, sin) =>
              count +
              (sin.licenses ?? []).filter(
                (lic) =>
                  getLicenseAvailability(lic.verification).rating >
                  GearMaxAvailability,
              ).length,
            0,
          )
      }
    } else if (sectionName === SectionHeader.Cyberware) {
      const invalidImplants = gear.cyberware.filter(
        (implant) =>
          (implant.availability?.rating ?? Number.NEGATIVE_INFINITY) >
          GearMaxAvailability,
      )
      if (invalidImplants.length > 0) {
        sectionInvalid.add(sectionName)
        totalInvalidCount += invalidImplants.length
      }
    } else if (sectionName === SectionHeader.Lifestyle) {
      // Lifestyle has no availability rating to check
    } else {
      const sectionKey = genericSectionKeys[sectionName]
      if (sectionKey) {
        const items = gear[sectionKey] || []
        const invalidItems = items.filter(
          (it) =>
            (it.availability?.rating ?? Number.NEGATIVE_INFINITY) >
            GearMaxAvailability,
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
          <BuildPoints value={totalBp} total={GearBpAllowance} />
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

              <GearSectionNuyen section={sectionName} />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 1 }}>
            <GearSectionContent section={sectionName} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  )
}

const GearSectionContent: FC<{
  section: SectionHeader
}> = ({ section }) => {
  if (section === SectionHeader.Licenses) return <SinsAndLicensesSection />
  if (section === SectionHeader.Cyberware) return <CyberwarePanel />
  if (section === SectionHeader.Weapons) return <WeaponsPanel />
  if (section === SectionHeader.Armor) return <ArmorPanel />
  if (section === SectionHeader.Vehicles) return <VehiclesPanel />
  if (section === SectionHeader.Devices) return <DevicesPanel />
  if (section === SectionHeader.Misc) return <MiscPanel />
  if (section === SectionHeader.Lifestyle) return <LifestylePanel />
  return null
}

const GearSectionNuyen: FC<{
  section: SectionHeader
}> = ({ section }) => {
  const gear = useCharacterSheet((state) => state.gear)
  const lifestyle = useCharacterSheet((state) => state.lifestyle)
  const lifestyleMonths = useCharacterSheet((state) => state.lifestyleMonths)

  if (section === SectionHeader.Lifestyle) {
    return (
      <Typography variant="body2" color="text.secondary">
        <Nuyen amount={Lifestyles[lifestyle].upkeep * lifestyleMonths} />
      </Typography>
    )
  }

  if (section === SectionHeader.Licenses) {
    const sinAndLicenseNuyen = gear.sins.reduce((sum, sin) => {
      const licenseCost = (sin.licenses ?? []).reduce(
        (licSum, lic) => licSum + (lic.cost ?? 0),
        0,
      )
      return sum + (sin.cost ?? 0) + licenseCost
    }, 0)
    return (
      <Typography variant="body2" color="text.secondary">
        <Nuyen amount={sinAndLicenseNuyen} />
      </Typography>
    )
  }

  if (section === SectionHeader.Cyberware) {
    const cyberwareNuyen = gear.cyberware.reduce((sum, implant) => {
      const modCost = (implant.attachments ?? []).reduce(
        (modSum, mod) => modSum + (mod.cost ?? 0),
        0,
      )
      return sum + getImplantEffectiveNuyenCost(implant) + modCost
    }, 0)
    return (
      <Typography variant="body2" color="text.secondary">
        <Nuyen amount={cyberwareNuyen} />
      </Typography>
    )
  }

  const genericSectionKeys: Partial<
    Record<SectionHeader, "weapons" | "armor" | "vehicles" | "devices" | "misc">
  > = {
    [SectionHeader.Weapons]: "weapons",
    [SectionHeader.Armor]: "armor",
    [SectionHeader.Vehicles]: "vehicles",
    [SectionHeader.Devices]: "devices",
    [SectionHeader.Misc]: "misc",
  }
  const sectionKey = genericSectionKeys[section]
  const nuyen = sectionKey
    ? gear[sectionKey].reduce((sum, item) => sum + (item.cost ?? 0), 0)
    : 0

  return (
    <Typography variant="body2" color="text.secondary">
      <Nuyen amount={nuyen} />
    </Typography>
  )
}
