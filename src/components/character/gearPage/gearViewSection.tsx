import type { UUID } from "node:crypto"

import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiArrowDownSLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useEssenseInfo } from "#/components/character/characterUtils.ts"
import { GearViewItem } from "#/components/character/gearPage/gearViewItem.tsx"
import { ImplantFormDialog } from "#/components/characterBuilder/sections/gear/cyberware/dialogs/implantFormDialog.tsx"
import { GearItemFormDialog } from "#/components/characterBuilder/sections/gear/generic/dialogs/gearItemFormDialog.tsx"
import { WeaponFormDialog } from "#/components/characterBuilder/sections/gear/weapons/dialogs/weaponFormDialog.tsx"
import { useNuyenStore } from "#/components/finances/nuyen/useNuyenStore.ts"
import {
  getImplantEffectiveNuyenCost,
  BASE_ESSENCE,
} from "#/components/gear/implantUtils.ts"
import { useGearStore } from "#/components/gear/useGearApi.ts"
import { LicenseFormDialog } from "#/components/licenses/dialogs/licenseFormDialog.tsx"
import { SinFormDialog } from "#/components/licenses/dialogs/sinFormDialog.tsx"
import type { ImplantData } from "#/lib/system/gear/implantData.ts"
import { isImplant } from "#/lib/system/gear/implantData.ts"
import type { LicenseData } from "#/lib/system/gear/licenseData.ts"
import { isLicenseData } from "#/lib/system/gear/licenseData.ts"
import type { SinData } from "#/lib/system/gear/sinData.ts"
import { isSinData } from "#/lib/system/gear/sinData.ts"
import type { WeaponData } from "#/lib/system/gear/weaponData.ts"
import { GearType } from "#/lib/system/gearType.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

export enum GearSection {
  Cyberware = "Cyberware",
  Weapons = "Weapons",
  Armor = "Armor",
  Vehicles = "Vehicles",
  Devices = "Devices",
  Licenses = "SINs & Licenses",
  Misc = "Misc",
}

export const sectionGearTypes: Record<GearSection, GearType[]> = {
  [GearSection.Cyberware]: [GearType.implant],
  [GearSection.Weapons]: [GearType.weapon, GearType.firearm, GearType.firearmAccessory],
  [GearSection.Armor]: [GearType.armor],
  [GearSection.Vehicles]: [GearType.vehicle],
  [GearSection.Devices]: [GearType.device, GearType.software],
  [GearSection.Licenses]: [GearType.sin, GearType.license],
  [GearSection.Misc]: [GearType.other],
}

interface GearViewSectionProps {
  section: GearSection
  searchTerms: string[]
}

const CyberwareSectionHeader: FC = () => {
  const essenceInfo = useEssenseInfo()
  const isEssenceError = essenceInfo.essenseRemaining <= 0

  return (
    <Typography
      variant="body2"
      color={isEssenceError ? "error" : "text.secondary"}
    >
      {essenceInfo.essenceUsed.toFixed(2).replace(/\.?0+$/, "")} / {BASE_ESSENCE} Ess
    </Typography>
  )
}

// ─── Per-section dialog state types ─────────────────────────────────────────

type CyberwareDialogState =
  | null
  | { open: boolean }

type WeaponDialogState =
  | null
  | { open: boolean }
  | { open: boolean, parentId: UUID }

type GenericDialogState =
  | null
  | { open: boolean }

type LicensesDialogState =
  | null
  | { type: "sin", open: boolean }
  | { type: "license", sin: SinData, open: boolean }

// ─── Section add-item content ────────────────────────────────────────────────

const CyberwareSectionContent: FC<{ items: ItemData[], getChildren: (id: string) => ItemData[] }> = ({
  items,
  getChildren,
}) => {
  const gearStore = useGearStore()
  const nuyenStore = useNuyenStore()
  const [dialogState, setDialogState] = useState<CyberwareDialogState>(null)

  const handleAcquire = (implant: ImplantData) => {
    gearStore.save(implant)
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const handlePurchase = (implant: ImplantData) => {
    nuyenStore.withdraw(getImplantEffectiveNuyenCost(implant))
    gearStore.save(implant)
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  return (
    <Stack gap={1}>
      {items.map((item) => (
        <GearViewItem key={item.id} item={item} subItems={getChildren(item.id)} />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ open: true })}
        color="secondary"
        fullWidth
      >
        Add Implant
      </Button>

      {dialogState && (
        <ImplantFormDialog
          open={dialogState.open}
          onAcquire={handleAcquire}
          onPurchase={handlePurchase}
          onClose={() => setDialogState((prev) => prev && { ...prev, open: false })}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}

const WeaponsSectionContent: FC<{ items: ItemData[], getChildren: (id: string) => ItemData[] }> = ({
  items,
  getChildren,
}) => {
  const gearStore = useGearStore()
  const nuyenStore = useNuyenStore()
  const [dialogState, setDialogState] = useState<WeaponDialogState>(null)

  const handleAcquireWeapon = (weapon: WeaponData) => {
    gearStore.save(weapon)
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const handlePurchaseWeapon = (weapon: WeaponData) => {
    nuyenStore.withdraw(weapon.cost ?? 0)
    gearStore.save(weapon)
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const handleAcquireAccessory = (item: ItemData) => {
    const parentId = dialogState && "parentId" in dialogState ? dialogState.parentId : undefined
    gearStore.save(parentId ? { ...item, parentId } : item)
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const handlePurchaseAccessory = (item: ItemData) => {
    nuyenStore.withdraw(item.cost ?? 0)
    const parentId = dialogState && "parentId" in dialogState ? dialogState.parentId : undefined
    gearStore.save(parentId ? { ...item, parentId } : item)
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const isAccessoryMode = dialogState !== null && "parentId" in dialogState

  return (
    <Stack gap={1}>
      {items.map((item) => (
        <GearViewItem key={item.id} item={item} subItems={getChildren(item.id)} />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ open: true })}
        color="secondary"
        fullWidth
      >
        Add Weapon
      </Button>

      {dialogState && !isAccessoryMode && (
        <WeaponFormDialog
          open={dialogState.open}
          onAcquire={handleAcquireWeapon}
          onPurchase={handlePurchaseWeapon}
          onClose={() => setDialogState((prev) => prev && { ...prev, open: false })}
          onClosed={() => setDialogState(null)}
        />
      )}

      {dialogState && isAccessoryMode && (
        <GearItemFormDialog
          open={dialogState.open}
          label="Weapon Accessory"
          onAcquire={handleAcquireAccessory}
          onPurchase={handlePurchaseAccessory}
          onClose={() => setDialogState((prev) => prev && { ...prev, open: false })}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}

interface GenericSectionContentProps {
  items: ItemData[]
  getChildren: (id: string) => ItemData[]
  itemLabel: string
}

const GenericSectionContent: FC<GenericSectionContentProps> = ({
  items,
  getChildren,
  itemLabel,
}) => {
  const gearStore = useGearStore()
  const nuyenStore = useNuyenStore()
  const [dialogState, setDialogState] = useState<GenericDialogState>(null)

  const handleAcquire = (item: ItemData) => {
    gearStore.save(item)
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const handlePurchase = (item: ItemData) => {
    nuyenStore.withdraw(item.cost ?? 0)
    gearStore.save(item)
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  return (
    <Stack gap={1}>
      {items.map((item) => (
        <GearViewItem key={item.id} item={item} subItems={getChildren(item.id)} />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ open: true })}
        color="secondary"
        fullWidth
      >
        Add {itemLabel}
      </Button>

      {dialogState && (
        <GearItemFormDialog
          open={dialogState.open}
          label={itemLabel}
          onAcquire={handleAcquire}
          onPurchase={handlePurchase}
          onClose={() => setDialogState((prev) => prev && { ...prev, open: false })}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}

const LicensesSectionContent: FC<{ sins: SinData[], getLicenses: (sinId: string) => LicenseData[] }> = ({
  sins,
  getLicenses,
}) => {
  const gearStore = useGearStore()
  const nuyenStore = useNuyenStore()
  const [dialogState, setDialogState] = useState<LicensesDialogState>(null)

  const hasRealSin = sins.some((sin) => sin.rating === "real")

  const handleAcquireSin = (sin: SinData) => {
    gearStore.save(sin)
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const handlePurchaseSin = (sin: SinData) => {
    nuyenStore.withdraw(sin.cost ?? 0)
    gearStore.save(sin)
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const handleAcquireLicense = (license: LicenseData) => {
    gearStore.save(license)
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  const handlePurchaseLicense = (license: LicenseData) => {
    nuyenStore.withdraw(license.cost ?? 0)
    gearStore.save(license)
    setDialogState((prev) => prev && { ...prev, open: false })
  }

  return (
    <Stack gap={1}>
      {sins.map((sin) => (
        <GearViewItem
          key={sin.id}
          item={sin}
          subItems={getLicenses(sin.id)}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ type: "sin", open: true })}
        color="secondary"
        fullWidth
      >
        Add SIN
      </Button>

      {dialogState?.type === "sin" && (
        <SinFormDialog
          open={dialogState.open}
          allowReal={!hasRealSin}
          onAcquire={handleAcquireSin}
          onPurchase={handlePurchaseSin}
          onClose={() => setDialogState((prev) => prev && { ...prev, open: false })}
          onClosed={() => setDialogState(null)}
        />
      )}

      {dialogState?.type === "license" && (
        <LicenseFormDialog
          open={dialogState.open}
          sin={dialogState.sin}
          onAcquire={handleAcquireLicense}
          onPurchase={handlePurchaseLicense}
          onClose={() => setDialogState((prev) => prev && { ...prev, open: false })}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}

// ─── Main section component ──────────────────────────────────────────────────

export const GearViewSection: FC<GearViewSectionProps> = ({ section, searchTerms }) => {
  const [isManuallyOpen, setIsManuallyOpen] = useState(false)
  const gearStore = useGearStore()
  const allGearItems = useStore(gearStore, (gear) => gear)

  const allowedTypes = sectionGearTypes[section]
  const isSearching = searchTerms.length > 0

  const sectionItems = isSearching
    ? gearStore.search(searchTerms).filter((item) => allowedTypes.includes(item.itemType as GearType))
    : Object.values(allGearItems).filter((item) => allowedTypes.includes(item.itemType as GearType))

  if (isSearching && sectionItems.length === 0) return null

  const rootItems = sectionItems.filter((item) => !item.parentId)
  const getChildItems = (parentId: string) =>
    sectionItems.filter((item) => item.parentId === parentId)

  const isExpanded = isSearching ? sectionItems.length > 0 : isManuallyOpen

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={isExpanded}
      onChange={(_, expanded) => {
        if (!isSearching) setIsManuallyOpen(expanded)
      }}
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
          <Typography>{section}</Typography>
          {section === GearSection.Cyberware && <CyberwareSectionHeader />}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 1 }}>
        <GearViewSectionContent
          section={section}
          rootItems={rootItems}
          getChildItems={getChildItems}
        />
      </AccordionDetails>
    </Accordion>
  )
}

interface GearViewSectionContentProps {
  section: GearSection
  rootItems: ItemData[]
  getChildItems: (parentId: string) => ItemData[]
}

const GearViewSectionContent: FC<GearViewSectionContentProps> = ({
  section,
  rootItems,
  getChildItems,
}) => {
  if (section === GearSection.Cyberware) {
    const implants = rootItems.filter(isImplant)
    return (
      <CyberwareSectionContent
        items={implants}
        getChildren={getChildItems}
      />
    )
  }

  if (section === GearSection.Weapons) {
    return (
      <WeaponsSectionContent
        items={rootItems}
        getChildren={getChildItems}
      />
    )
  }

  if (section === GearSection.Licenses) {
    const sins = rootItems.filter(isSinData)
    const getLicenses = (sinId: string) =>
      getChildItems(sinId).filter(isLicenseData)
    return (
      <LicensesSectionContent
        sins={sins}
        getLicenses={getLicenses}
      />
    )
  }

  if (section === GearSection.Armor) {
    return (
      <GenericSectionContent
        items={rootItems}
        getChildren={getChildItems}
        itemLabel="Armor"
      />
    )
  }

  if (section === GearSection.Vehicles) {
    return (
      <GenericSectionContent
        items={rootItems}
        getChildren={getChildItems}
        itemLabel="Vehicle"
      />
    )
  }

  if (section === GearSection.Devices) {
    return (
      <GenericSectionContent
        items={rootItems}
        getChildren={getChildItems}
        itemLabel="Device"
      />
    )
  }

  // GearSection.Misc
  return (
    <GenericSectionContent
      items={rootItems}
      getChildren={getChildItems}
      itemLabel="Item"
    />
  )
}
