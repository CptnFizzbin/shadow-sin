import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiArrowDownSLine, RiErrorWarningLine } from "@remixicon/react"
import type { FC, SyntheticEvent } from "react"
import { useState } from "react"

import { BuildPoints } from "#app/components/builder/buildPoints.tsx"
import { useAddItemDialogContext } from "#app/components/entities/items/addItemDialogContext.ts"
import { ItemBulkActionSlot } from "#app/components/entities/items/selection/itemBulkActionSlot.tsx"
import { ItemSelectToggleButton } from "#app/components/entities/items/selection/itemSelectToggleButton.tsx"
import { SinsAndLicensesSection } from "#app/components/entities/items/types/licenses/sinsAndLicensesSection.tsx"
import { ArmorSectionContent } from "#app/components/entities/items/viewer/armorSectionContent.tsx"
import { ConsumablesSectionContent } from "#app/components/entities/items/viewer/consumablesSectionContent.tsx"
import { DevicesSectionContent } from "#app/components/entities/items/viewer/devicesSectionContent.tsx"
import { GearSection as GearItemSection, sectionGearTypes } from "#app/components/entities/items/viewer/gearSectionTypes.ts"
import { MagicalSectionContent } from "#app/components/entities/items/viewer/magicalSectionContent.tsx"
import { MiscSectionContent } from "#app/components/entities/items/viewer/miscSectionContent.tsx"
import { VehiclesSectionContent } from "#app/components/entities/items/viewer/vehiclesSectionContent.tsx"
import { WeaponsSectionContent } from "#app/components/entities/items/viewer/weaponsSectionContent.tsx"
import { getProgress } from "#common/number/progressUtils.ts"
import { isImplant } from "#data/items/implantData.ts"
import { ItemType } from "#data/items/itemType.ts"
import { isLicenseData } from "#data/items/licenseData.ts"
import { isSinData } from "#data/items/sinData.ts"
import { Nuyen } from "#forms/nuyen/nuyen.tsx"
import { BuilderConfig } from "#rules/buildPoints/builderConfig.ts"
import { getImplantEffectiveNuyenCost } from "#rules/items/implantUtils.ts"
import { useGearBuildPoints, useGearTotalCost } from "#state/builder/buildPoints/useGearBuildPoints.ts"
import { EditorMode } from "#state/editor/editorMode.tsx"
import { ItemSelectors } from "#state/runner/items/items.selector.ts"
import { LifestyleSelectors } from "#state/runner/lifestyle/lifestyle.selector.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"

import { useGearAvailabilityIssues } from "./gearUtils.ts"
import { ImplantsPanel } from "./implants/implantsPanel.tsx"
import { LifestylePanel } from "./lifestyle/lifestylePanel.tsx"
import { SectionHeader } from "./sectionHeader.tsx"
import { StartingNuyenSection } from "./startingNuyenSection.tsx"

const itemSectionTypes: Record<Exclude<SectionHeader, SectionHeader.Lifestyle>, ItemType[]> = {
  [SectionHeader.Cyberware]: sectionGearTypes[GearItemSection.Cyberware],
  [SectionHeader.Weapons]: sectionGearTypes[GearItemSection.Weapons],
  [SectionHeader.Armor]: sectionGearTypes[GearItemSection.Armor],
  [SectionHeader.Vehicles]: sectionGearTypes[GearItemSection.Vehicles],
  [SectionHeader.Devices]: sectionGearTypes[GearItemSection.Devices],
  [SectionHeader.Licenses]: sectionGearTypes[GearItemSection.Licenses],
  [SectionHeader.Consumables]: sectionGearTypes[GearItemSection.Consumables],
  [SectionHeader.Magical]: sectionGearTypes[GearItemSection.Magical],
  [SectionHeader.Misc]: sectionGearTypes[GearItemSection.Misc],
}

export const GearSection: FC = () => {
  const totalNuyen = useGearTotalCost()
  const buildPoints = useGearBuildPoints()
  const { invalidSections } = useGearAvailabilityIssues()
  const addItemDialog = useAddItemDialogContext()

  const allGearItems = useRunnerSelector(ItemSelectors.selectAll)
  const [collapsedSections, setCollapsedSections] = useState<ReadonlySet<SectionHeader>>(new Set())

  const onSectionChange = (section: SectionHeader) => {
    return (_: SyntheticEvent, isExpanded: boolean) => {
      setCollapsedSections((previous) => {
        const next = new Set(previous)
        if (isExpanded) next.delete(section)
        else next.add(section)
        return next
      })
    }
  }

  const visibleSections = Object.values(SectionHeader).filter((section) => {
    // Lifestyle holds the runner's lifestyle settings rather than gear items, so it is always shown.
    if (section === SectionHeader.Lifestyle) return true
    const allowedTypes = itemSectionTypes[section]
    return Object.values(allGearItems).some((item) => allowedTypes.includes(item.itemType as ItemType))
  })

  return (
    <Stack>
      <EditorMode.IsBuilder>
        <Stack sx={{ gap: 0.5 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography>
              <Nuyen amount={totalNuyen} />
              {" / "}
              <Nuyen amount={BuilderConfig.gear.nuyenPerBp * BuilderConfig.gear.bpAllowance} />
            </Typography>
            <BuildPoints value={buildPoints.spent} total={buildPoints.allowance} />
          </Stack>

          <LinearProgress
            variant="determinate"
            value={getProgress(buildPoints.spent, BuilderConfig.gear.bpAllowance)}
            color={buildPoints.isOverBudget ? "error" : "primary"}
          />
        </Stack>
      </EditorMode.IsBuilder>

      <ButtonGroup size="small" color="secondary" fullWidth>
        <Button startIcon={<RiAddLine size={14} />} onClick={() => addItemDialog.open()}>
          Add Item
        </Button>
        <ItemSelectToggleButton />
      </ButtonGroup>

      {visibleSections.map((sectionName) => (
        <Accordion
          key={sectionName}
          expanded={!collapsedSections.has(sectionName)}
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
                justifyContent: "space-between",
                flexGrow: 1,
                paddingRight: 1,
                marginRight: 1,
                borderRight: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" sx={{ alignItems: "center" }}>
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

      <EditorMode.IsBuilder>
        <StartingNuyenSection />
      </EditorMode.IsBuilder>

      <Box sx={{ position: "sticky", bottom: 12, zIndex: "appBar" }}>
        <ItemBulkActionSlot />
      </Box>
    </Stack>
  )
}

const GearSectionContent: FC<{
  section: SectionHeader
}> = ({ section }) => {
  if (section === SectionHeader.Licenses) return <SinsAndLicensesSection />
  if (section === SectionHeader.Cyberware) return <ImplantsPanel />
  if (section === SectionHeader.Weapons) return <WeaponsSectionContent />
  if (section === SectionHeader.Armor) return <ArmorSectionContent />
  if (section === SectionHeader.Vehicles) return <VehiclesSectionContent />
  if (section === SectionHeader.Devices) return <DevicesSectionContent />
  if (section === SectionHeader.Consumables) return <ConsumablesSectionContent />
  if (section === SectionHeader.Magical) return <MagicalSectionContent />
  if (section === SectionHeader.Misc) return <MiscSectionContent />
  if (section === SectionHeader.Lifestyle) return <LifestylePanel />
  return null
}

const GearSectionNuyen: FC<{
  section: SectionHeader
}> = ({ section }) => {
  const allGearItems = useRunnerSelector(ItemSelectors.selectAll)

  const lifestyleCost = useRunnerSelector(LifestyleSelectors.selectPrepaidCost)

  if (section === SectionHeader.Lifestyle) {
    return (
      <Typography color="text.secondary">
        <Nuyen amount={lifestyleCost} />
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
    [SectionHeader.Consumables]: ItemType.consumable,
    [SectionHeader.Magical]: ItemType.magical,
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
