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

import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { ArmorPanel } from "#/components/CharacterBuilder/Sections/Gear/Armor/ArmorPanel.tsx"
import { CyberwarePanel } from "#/components/CharacterBuilder/Sections/Gear/Cyberware/CyberwarePanel.tsx"
import type { ImplantFormState } from "#/components/CharacterBuilder/Sections/Gear/Cyberware/Forms/ImplantFormState.ts"
import { getImplantEffectiveNuyenCost } from "#/components/CharacterBuilder/Sections/Gear/Cyberware/ImplantUtils.ts"
import { DevicesPanel } from "#/components/CharacterBuilder/Sections/Gear/Devices/DevicesPanel.tsx"
import {
  GearBuildPointAllowance,
  GearNuyenAllowance,
  useGearAvailabilityIssues,
  useGearBuildPoints,
  useGearTotalCost,
} from "#/components/CharacterBuilder/Sections/Gear/GearUtils.ts"
import type { GearItemFormState } from "#/components/CharacterBuilder/Sections/Gear/Generic/Forms/GearItemFormState.ts"
import type { LicenseFormState } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Forms/SinFormState.ts"
import { SinsAndLicensesSection } from "#/components/CharacterBuilder/Sections/Gear/Licenses/SinsAndLicensesSection.tsx"
import { LifestylePanel } from "#/components/CharacterBuilder/Sections/Gear/Lifestyle/LifestylePanel.tsx"
import { MiscPanel } from "#/components/CharacterBuilder/Sections/Gear/Misc/MiscPanel.tsx"
import { SectionHeader } from "#/components/CharacterBuilder/Sections/Gear/SectionHeader.tsx"
import { StartingNuyenSection } from "#/components/CharacterBuilder/Sections/Gear/StartingNuyenSection.tsx"
import { VehiclesPanel } from "#/components/CharacterBuilder/Sections/Gear/Vehicles/VehiclesPanel.tsx"
import { WeaponsPanel } from "#/components/CharacterBuilder/Sections/Gear/Weapons/WeaponsPanel.tsx"
import { useGearApi } from "#/components/Gear/UseGearApi.ts"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"
import { getProgress } from "#/lib/ProgressUtils.ts"
import { Lifestyles } from "#/lib/system/LifestyleType.ts"

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
