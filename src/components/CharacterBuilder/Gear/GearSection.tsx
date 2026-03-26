import { useTheme } from "@mui/material"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Alert from "@mui/material/Alert"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine, RiErrorWarningLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC, SyntheticEvent } from "react"
import { useState } from "react"

import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { ArmorPanel } from "#/components/CharacterBuilder/Gear/Armor/ArmorPanel.tsx"
import { CyberwarePanel } from "#/components/CharacterBuilder/Gear/Cyberware/CyberwarePanel.tsx"
import type { ImplantFormState } from "#/components/CharacterBuilder/Gear/Cyberware/Forms/ImplantFormState.ts"
import { getImplantEffectiveNuyenCost } from "#/components/CharacterBuilder/Gear/Cyberware/ImplantUtils.ts"
import { DevicesPanel } from "#/components/CharacterBuilder/Gear/Devices/DevicesPanel.tsx"
import {
  GearBuildPointAllowance,
  GearMaxAvailability,
  GearNuyenAllowance,
  useGearBuildPoints,
  useGearTotalCost,
} from "#/components/CharacterBuilder/Gear/GearUtils.ts"
import type { GearItemFormState } from "#/components/CharacterBuilder/Gear/Generic/Forms/GearItemFormState.ts"
import type { LicenseFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/LicenseFormState.ts"
import { getLicenseAvailability } from "#/components/CharacterBuilder/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/CharacterBuilder/Gear/Licenses/Forms/SinFormState.ts"
import { getSinAvailability } from "#/components/CharacterBuilder/Gear/Licenses/Forms/SinFormState.ts"
import { SinsAndLicensesSection } from "#/components/CharacterBuilder/Gear/Licenses/SinsAndLicensesSection.tsx"
import { LifestylePanel } from "#/components/CharacterBuilder/Gear/Lifestyle/LifestylePanel.tsx"
import { MiscPanel } from "#/components/CharacterBuilder/Gear/Misc/MiscPanel.tsx"
import { SectionHeader } from "#/components/CharacterBuilder/Gear/SectionHeader.tsx"
import { VehiclesPanel } from "#/components/CharacterBuilder/Gear/Vehicles/VehiclesPanel.tsx"
import { WeaponsPanel } from "#/components/CharacterBuilder/Gear/Weapons/WeaponsPanel.tsx"
import { useGearApi } from "#/components/Gear/UseGearApi.ts"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"
import { getProgress } from "#/lib/ProgressUtils.ts"
import { Lifestyles } from "#/lib/system/LifestyleType.ts"

export const GearSection: FC = () => {
  const theme = useTheme()
  const gear = useGearApi()

  // Subscribe to the gear Record; re-renders only when gear changes.
  const allGearItems = useStore(gear.store, (g) => g)

  const totalNuyen = useGearTotalCost()
  const { spent: totalBp, isOverBudget } = useGearBuildPoints()

  const [activeSection, setActiveSection] = useState<SectionHeader | null>(null)

  const onSectionChange = (section: SectionHeader) => {
    return (_: SyntheticEvent, isExpanded: boolean) => {
      setActiveSection(isExpanded ? section : null)
    }
  }

  // determine availability issues per section
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
      const sins = Object.values(allGearItems).filter((i) => i.itemType === "sins") as unknown as SinFormState[]
      const licenses = Object.values(allGearItems).filter((i) => i.itemType === "licenses") as unknown as LicenseFormState[]
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
          ).length
          + licenses.filter(
            (l) =>
              getLicenseAvailability(l.rating).rating > GearMaxAvailability,
          ).length
      }
    } else if (sectionName === SectionHeader.Cyberware) {
      const invalidImplants = (Object.values(allGearItems).filter((i) => i.itemType === "cyberware") as unknown as ImplantFormState[])
        .filter((implant) =>
          (implant.availability?.rating ?? Number.NEGATIVE_INFINITY)
          > GearMaxAvailability,
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
        const items = Object.values(allGearItems).filter((i) => i.itemType === sectionKey) as unknown as GearItemFormState[]
        const invalidItems = items.filter(
          (it) =>
            (it.availability?.rating ?? Number.NEGATIVE_INFINITY)
            > GearMaxAvailability,
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
            <Nuyen amount={totalNuyen} /> /{" "}
            <Nuyen amount={GearNuyenAllowance} />
          </Typography>
          <BuildPoints value={totalBp} total={GearBuildPointAllowance} />
        </Stack>

        <LinearProgress
          variant="determinate"
          value={getProgress(totalBp, GearBuildPointAllowance)}
          color={isOverBudget ? "error" : "primary"}
        />
      </Stack>

      {isOverBudget && (
        <Alert severity="error">
          Gear budget exceeded! Maximum is <Nuyen amount={GearNuyenAllowance} />{" "}
          ({GearBuildPointAllowance} BP).
        </Alert>
      )}

      {hasAvailabilityWarnings && (
        <Alert severity="warning">
          {totalInvalidCount}
          {" "}
          gear item
          {totalInvalidCount > 1 ? "s" : ""}
          {" "}
          exceed
          the maximum availability (
          {GearMaxAvailability}
          ). Check highlighted
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
            "border": "1px solid",
            "borderColor": "divider",
            "padding": 0,
            "margin": 0,
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
  const gearApi = useGearApi()
  // Subscribe to the gear Record reactively; re-renders when any gear item changes.
  const allGearItems = useStore(gearApi.store, (g) => g)
  const lifestyle = useCharacterBuilderStore((state) => state.lifestyle)
  const lifestyleMonths = useCharacterBuilderStore(
    (state) => state.lifestyleMonths,
  )

  if (section === SectionHeader.Lifestyle) {
    return (
      <Typography variant="body2" color="text.secondary">
        <Nuyen amount={Lifestyles[lifestyle].upkeep * lifestyleMonths} />
      </Typography>
    )
  }

  if (section === SectionHeader.Licenses) {
    const sins = Object.values(allGearItems).filter((i) => i.itemType === "sins") as unknown as SinFormState[]
    const licenses = Object.values(allGearItems).filter((i) => i.itemType === "licenses") as unknown as LicenseFormState[]
    return (
      <Typography variant="body2" color="text.secondary">
        <Nuyen
          amount={
            sins.reduce((sum, sin) => sum + (sin.cost ?? 0), 0)
            + licenses.reduce((sum, license) => sum + (license.cost ?? 0), 0)
          }
        />
      </Typography>
    )
  }
  if (section === SectionHeader.Cyberware) {
    const implants = Object.values(allGearItems).filter((i) => i.itemType === "cyberware") as unknown as ImplantFormState[]
    const implantMods = Object.values(allGearItems).filter((i) => i.itemType === "implantMods") as unknown as GearItemFormState[]
    return (
      <Typography variant="body2" color="text.secondary">
        <Nuyen
          amount={
            implants.reduce(
              (sum, implant) => sum + getImplantEffectiveNuyenCost(implant),
              0,
            ) + implantMods.reduce((sum, mod) => sum + (mod.cost ?? 0), 0)
          }
        />
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
    ? (Object.values(allGearItems).filter((i) => i.itemType === sectionKey) as unknown as GearItemFormState[]).reduce((sum, item) => sum + (item.cost ?? 0), 0)
    : 0

  return (
    <Typography variant="body2" color="text.secondary">
      <Nuyen amount={nuyen} />
    </Typography>
  )
}
