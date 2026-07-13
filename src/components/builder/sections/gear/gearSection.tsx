import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine, RiErrorWarningLine } from "@remixicon/react"
import type { FC, SyntheticEvent } from "react"
import { useState } from "react"

import {
  GearBuildPointAllowance,
  GearNuyenAllowance,
  useGearBuildPoints,
  useGearTotalCost,
} from "#/components/builder/buildPoints/hooks/useGearBuildPoints.ts"
import { getImplantEffectiveNuyenCost } from "#/components/items/types/implants/implantUtils.ts"
import { SinsAndLicensesSection } from "#/components/items/types/licenses/sinsAndLicensesSection.tsx"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { getProgress } from "#/lib/progressUtils.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { isImplant } from "#/system/gear/implantData.ts"
import { isLicenseData } from "#/system/gear/licenseData.ts"
import { isSinData } from "#/system/gear/sinData.ts"
import { ItemType } from "#/system/itemType.ts"

import { ArmorPanel } from "./armor/armorPanel.tsx"
import { DevicesPanel } from "./devices/devicesPanel.tsx"
import { useGearAvailabilityIssues } from "./gearUtils.ts"
import { ImplantsPanel } from "./implants/implantsPanel.tsx"
import { LifestylePanel } from "./lifestyle/lifestylePanel.tsx"
import { MiscPanel } from "./misc/miscPanel.tsx"
import { SectionHeader } from "./sectionHeader.tsx"
import { StartingNuyenSection } from "./startingNuyenSection.tsx"
import { VehiclesPanel } from "./vehicles/vehiclesPanel.tsx"
import { WeaponsPanel } from "./weapons/weaponsPanel.tsx"

export const GearSection: FC = () => {
  const totalNuyen = useGearTotalCost()
  const buildPoints = useGearBuildPoints()
  const { invalidSections } = useGearAvailabilityIssues()

  const [activeSection, setActiveSection] = useState<SectionHeader | null>(null)

  const onSectionChange = (section: SectionHeader) => {
    return (_: SyntheticEvent, isExpanded: boolean) => {
      setActiveSection(isExpanded ? section : null)
    }
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack sx={{ gap: 0.5 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography>
            <Nuyen amount={totalNuyen} /> / <Nuyen amount={GearNuyenAllowance} />
          </Typography>
          <BuildPoints value={buildPoints.spent} total={buildPoints.allowance} />
        </Stack>

        <LinearProgress
          variant="determinate"
          value={getProgress(buildPoints.spent, GearBuildPointAllowance)}
          color={buildPoints.isOverBudget ? "error" : "primary"}
        />
      </Stack>

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
              sx={{
                justifyContent: "space-between", flexGrow: 1,
                paddingRight: 1,
                marginRight: 1,
                borderRight: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                <Typography>{sectionName}</Typography>
                {invalidSections.has(sectionName) && (
                  <RiErrorWarningLine
                    size={16}
                    style={{ color: "var(--mui-palette-warning-main)" }}
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

      <StartingNuyenSection />
    </Stack>
  )
}

const GearSectionContent: FC<{
  section: SectionHeader
}> = ({ section }) => {
  if (section === SectionHeader.Licenses) {
    return (
      <SinsAndLicensesSection
        slots={{
          sinTrailingContent: (sin) => (
            <Typography color="text.secondary">
              <Nuyen amount={sin.cost} />
            </Typography>
          ),
          licenseTrailingContent: (license) => (
            <Typography color="text.secondary">
              <Nuyen amount={license.cost} />
            </Typography>
          ),
        }}
      />
    )
  }
  if (section === SectionHeader.Cyberware) return <ImplantsPanel />
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
  const allGearItems = useRunnerStoreSelector(Selectors.gear.selectGear)

  const lifestyleInfo = useRunnerStoreSelector(Selectors.profile.selectLifestyleInfo)
  const lifestyleMonths = useRunnerStoreSelector(Selectors.profile.selectLifestyleMonthsPaid) ?? 1

  if (section === SectionHeader.Lifestyle) {
    return (
      <Typography color="text.secondary">
        <Nuyen amount={(lifestyleInfo?.upkeep ?? 0) * lifestyleMonths} />
      </Typography>
    )
  }

  if (section === SectionHeader.Licenses) {
    const sins = Object.values(allGearItems).filter(isSinData)
    const licenses = Object.values(allGearItems).filter(isLicenseData)
    return (
      <Typography color="text.secondary">
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
    const implants = Object.values(allGearItems).filter(isImplant)

    return (
      <Typography color="text.secondary">
        <Nuyen
          amount={
            implants.reduce(
              (sum, implant) => sum + getImplantEffectiveNuyenCost(implant),
              0,
            )
          }
        />
      </Typography>
    )
  }

  const genericSectionTypes: Partial<
    Record<SectionHeader, ItemType>
  > = {
    [SectionHeader.Weapons]: ItemType.weapon,
    [SectionHeader.Armor]: ItemType.armor,
    [SectionHeader.Vehicles]: ItemType.vehicle,
    [SectionHeader.Devices]: ItemType.device,
    [SectionHeader.Misc]: ItemType.other,
  }

  const nuyen = Object.values(allGearItems)
    .filter((i) => i.itemType === genericSectionTypes[section])
    .reduce((sum, item) => sum + (item.cost ?? 0), 0)

  return (
    <Typography color="text.secondary">
      <Nuyen amount={nuyen} />
    </Typography>
  )
}
