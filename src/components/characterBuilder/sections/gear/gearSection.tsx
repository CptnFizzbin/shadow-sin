import { useTheme } from "@mui/material"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine, RiErrorWarningLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC, SyntheticEvent } from "react"
import { useState } from "react"

import {
  GearBuildPointAllowance,
  GearNuyenAllowance,
  useGearBuildPoints,
  useGearTotalCost,
} from "#/components/characterBuilder/buildPoints/hooks/useGearBuildPoints.ts"
import { ArmorPanel } from "#/components/characterBuilder/sections/gear/armor/armorPanel.tsx"
import { CyberwarePanel } from "#/components/characterBuilder/sections/gear/cyberware/cyberwarePanel.tsx"
import { DevicesPanel } from "#/components/characterBuilder/sections/gear/devices/devicesPanel.tsx"
import { useGearAvailabilityIssues } from "#/components/characterBuilder/sections/gear/gearUtils.ts"
import { LifestylePanel } from "#/components/characterBuilder/sections/gear/lifestyle/lifestylePanel.tsx"
import { MiscPanel } from "#/components/characterBuilder/sections/gear/misc/miscPanel.tsx"
import { SectionHeader } from "#/components/characterBuilder/sections/gear/sectionHeader.tsx"
import { StartingNuyenSection } from "#/components/characterBuilder/sections/gear/startingNuyenSection.tsx"
import { VehiclesPanel } from "#/components/characterBuilder/sections/gear/vehicles/vehiclesPanel.tsx"
import { WeaponsPanel } from "#/components/characterBuilder/sections/gear/weapons/weaponsPanel.tsx"
import { getImplantEffectiveNuyenCost } from "#/components/gear/implantUtils.ts"
import { useGearStore } from "#/components/gear/useGearApi.ts"
import { SinsAndLicensesSection } from "#/components/licenses/sinsAndLicensesSection.tsx"
import { useLifestyleStore } from "#/components/profile/useLifestyleStore.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { getProgress } from "#/lib/progressUtils.ts"
import { isImplant } from "#/lib/system/gear/implantData.ts"
import { isLicenseData } from "#/lib/system/gear/licenseData.ts"
import { isSinData } from "#/lib/system/gear/sinData.ts"
import { ItemType } from "#/lib/system/itemType.ts"
import { Lifestyles } from "#/lib/system/lifestyleType.ts"

export const GearSection: FC = () => {
  const theme = useTheme()
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
    <Stack gap={1}>
      <Stack gap={0.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="caption">
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
                {invalidSections.has(sectionName) && (
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
            <Typography variant="body2" color="text.secondary">
              <Nuyen amount={sin.cost} />
            </Typography>
          ),
          licenseTrailingContent: (license) => (
            <Typography variant="body2" color="text.secondary">
              <Nuyen amount={license.cost} />
            </Typography>
          ),
        }}
      />
    )
  }
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
  const gearApi = useGearStore()
  const allGearItems = useStore(gearApi, (g) => g)

  const lifestyleStore = useLifestyleStore()
  const lifestyleInfo = useStore(lifestyleStore, (lifestyle) => Lifestyles[lifestyle.quality])
  const lifestyleMonths = useStore(lifestyleStore, (lifestyle) => lifestyle.monthsPaid)

  if (section === SectionHeader.Lifestyle) {
    return (
      <Typography variant="body2" color="text.secondary">
        <Nuyen amount={lifestyleInfo.upkeep * lifestyleMonths} />
      </Typography>
    )
  }

  if (section === SectionHeader.Licenses) {
    const sins = Object.values(allGearItems).filter(isSinData)
    const licenses = Object.values(allGearItems).filter(isLicenseData)
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
    const implants = Object.values(allGearItems).filter(isImplant)

    return (
      <Typography variant="body2" color="text.secondary">
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
    <Typography variant="body2" color="text.secondary">
      <Nuyen amount={nuyen} />
    </Typography>
  )
}
