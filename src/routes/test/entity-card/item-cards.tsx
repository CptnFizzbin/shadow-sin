import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import type { Dispatch, FC, ReactNode, SetStateAction } from "react"
import { useMemo, useState } from "react"

import { ArmorDataCard } from "#/components/items/types/armor/armorDataCard.tsx"
import { CredstickDataCard } from "#/components/items/types/credsticks/credstickDataCard.tsx"
import { DeviceDataCard } from "#/components/items/types/devices/deviceDataCard.tsx"
import { ProgramDataCard } from "#/components/items/types/devices/programDataCard.tsx"
import { ImplantDataCard } from "#/components/items/types/implants/implantDataCard.tsx"
import { LicenseDataCard } from "#/components/items/types/licenses/licenseDataCard.tsx"
import { SinDataCard } from "#/components/items/types/licenses/sinDataCard.tsx"
import { VehicleDataCard } from "#/components/items/types/vehicles/vehicleDataCard.tsx"
import { WeaponDataCard } from "#/components/items/types/weapons/weaponDataCard.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { ArmorData } from "#/system/gear/armorData.ts"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import { CredstickType } from "#/system/gear/credstickData.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantGrade, ImplantLocation, ImplantType } from "#/system/gear/implantData.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import { ProgramType } from "#/system/gear/programData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import { VehicleCategory } from "#/system/gear/vehicleData.ts"
import type { FirearmData } from "#/system/gear/weaponData.ts"
import { WeaponType } from "#/system/gear/weaponData.ts"
import { FirearmTypeKey } from "#/system/gear/weapons/firearms/firearmTypeKey.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const Route = createFileRoute("/test/entity-card/item-cards")({
  component: MigratedItemCardsTestPage,
})

interface SectionProps {
  title: string
  description: string
  children: ReactNode
}

const Section: FC<SectionProps> = ({ title, description, children }) => (
  <Stack>
    <Stack sx={{ gap: 0.25 }}>
      <Typography variant="overline" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Stack>
    <Stack sx={{ alignItems: "flex-start", gap: 1.5 }}>{children}</Stack>
  </Stack>
)

/**
 * Every optional field shared by `EntityData`/`ItemData` that visibly changes an `ItemCard`'s
 * render. Declared as a `type` (not `interface`) so it structurally satisfies
 * `Record<string, boolean>` for `FieldToggleGroup`'s generic — interfaces don't get TypeScript's
 * implicit index signature the way object type literals do.
 */
type CommonFieldToggles = {
  source: boolean
  effects: boolean
  availability: boolean
  quantity: boolean
  cost: boolean
  equipped: boolean
  stashed: boolean
  fixed: boolean
  wireless: boolean
  wirelessEnabled: boolean
  wirelessRemoved: boolean
}

type CredstickFieldToggles = CommonFieldToggles & {
  name: boolean
  rating: boolean
}

type SinFieldToggles = CommonFieldToggles & {
  coveredLicense: boolean
}

const DEFAULT_COMMON_TOGGLES: CommonFieldToggles = {
  source: true,
  effects: true,
  availability: true,
  quantity: true,
  cost: true,
  equipped: true,
  stashed: false,
  fixed: false,
  wireless: true,
  wirelessEnabled: true,
  wirelessRemoved: false,
}

interface FieldToggleConfigEntry<TToggles> {
  key: keyof TToggles
  label: string
  disabled?: (toggles: TToggles) => boolean
}

const COMMON_TOGGLE_CONFIG: FieldToggleConfigEntry<CommonFieldToggles>[] = [
  { key: "source", label: "Source" },
  { key: "effects", label: "Effects" },
  { key: "availability", label: "Availability" },
  { key: "quantity", label: "Quantity" },
  { key: "cost", label: "Cost" },
  { key: "equipped", label: "Equipped" },
  { key: "stashed", label: "Stashed" },
  { key: "fixed", label: "Fixed" },
  { key: "wireless", label: "Wireless" },
  { key: "wirelessEnabled", label: "Wireless enabled", disabled: (toggles) => !toggles.wireless },
  { key: "wirelessRemoved", label: "Wireless removed", disabled: (toggles) => !toggles.wireless },
]

const CREDSTICK_TOGGLE_CONFIG: FieldToggleConfigEntry<CredstickFieldToggles>[] = [
  { key: "name", label: "Name (else falls back to type label)" },
  { key: "rating", label: "Rating" },
  ...COMMON_TOGGLE_CONFIG,
]

/**
 * `LicenseFormDialog`/`SinFormDialog` both force `showCost`/`showAvailability` off — real License
 * and SIN items never have cost or availability, so those toggles are dropped rather than shown
 * next to switches that would do nothing.
 */
const COMMON_TOGGLE_CONFIG_NO_COST_OR_AVAILABILITY = COMMON_TOGGLE_CONFIG.filter(
  ({ key }) => key !== "cost" && key !== "availability",
)

const SIN_TOGGLE_CONFIG: FieldToggleConfigEntry<SinFieldToggles>[] = [
  { key: "coveredLicense", label: "Covered License (Subitem)" },
  ...COMMON_TOGGLE_CONFIG_NO_COST_OR_AVAILABILITY,
]

/**
 * Renders one row of switches from a `FieldToggleConfigEntry[]` against a toggle-state object.
 * Generic (rather than a fixed `FC`) so the same renderer serves `CredstickFieldToggles`,
 * `CommonFieldToggles` (License), and `SinFieldToggles` without three near-identical copies.
 */
function FieldToggleGroup<TToggles extends Record<string, boolean>>({
  toggles,
  config,
  onToggle,
}: {
  toggles: TToggles
  config: FieldToggleConfigEntry<TToggles>[]
  onToggle: (key: keyof TToggles) => void
}) {
  return (
    <FormGroup row>
      {config.map(({ key, label, disabled }) => (
        <FormControlLabel
          key={String(key)}
          control={(
            <Switch
              checked={toggles[key]}
              disabled={disabled?.(toggles)}
              onChange={() => onToggle(key)}
            />
          )}
          label={label}
        />
      ))}
    </FormGroup>
  )
}

/** Toggles a single key on a toggle-state object, for any of the three toggle shapes above. */
function toggleField<TToggles extends Record<string, boolean>>(
  setToggles: Dispatch<SetStateAction<TToggles>>,
  key: keyof TToggles,
) {
  setToggles((prev) => ({ ...prev, [key]: !prev[key] }))
}

/** Applies the fields every `ItemCard`-based card shares, clearing whichever toggles are off. */
function withCommonFields<TItem extends ItemData>(base: TItem, toggles: CommonFieldToggles): TItem {
  return {
    ...base,
    source: toggles.source ? base.source : undefined,
    effects: toggles.effects ? base.effects : undefined,
    availability: toggles.availability ? base.availability : undefined,
    quantity: toggles.quantity ? base.quantity : undefined,
    cost: toggles.cost ? base.cost : undefined,
    equipped: toggles.equipped ? base.equipped : undefined,
    stashed: toggles.stashed ? base.stashed : undefined,
    fixed: toggles.fixed ? base.fixed : undefined,
    wireless: toggles.wireless ? { enabled: toggles.wirelessEnabled, removed: toggles.wirelessRemoved } : undefined,
  }
}

const CREDSTICK_ID = crypto.randomUUID()
const LICENSE_ID = crypto.randomUUID()
const SIN_ID = crypto.randomUUID()
const COVERED_LICENSE_ID = crypto.randomUUID()
const ARMOR_ID = crypto.randomUUID()
const ARMOR_MOD_ID = crypto.randomUUID()
const DEVICE_ID = crypto.randomUUID()
const PROGRAM_ID = crypto.randomUUID()
const IMPLANT_ID = crypto.randomUUID()
const IMPLANT_ACCESSORY_ID = crypto.randomUUID()
const VEHICLE_ID = crypto.randomUUID()
const VEHICLE_MOD_ID = crypto.randomUUID()
const WEAPON_ID = crypto.randomUUID()
const WEAPON_ACCESSORY_ID = crypto.randomUUID()

const BASE_CREDSTICK: CredstickData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: CREDSTICK_ID,
  name: "Personalized Credstick",
  itemType: ItemType.credstick,
  credstickType: CredstickType.gold,
  balance: 45_000,
  rating: 4,
  source: { book: "SR4A", page: 331 },
  effects: [{ type: GameEffectType.dicePoolMod, target: "Negotiation", value: 1 }],
  cost: 100,
  quantity: 2,
  availability: { rating: 4, restricted: true },
  equipped: true,
  stashed: false,
  fixed: false,
  wireless: { enabled: true },
}

const BASE_LICENSE: LicenseData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: LICENSE_ID,
  name: "License: Ares Predator",
  itemType: ItemType.license,
  rating: 4,
  source: { book: "SR4A", page: 297 },
  effects: [{ type: GameEffectType.dicePoolMod, target: "Negotiation", value: -1 }],
  quantity: 1,
  equipped: false,
  stashed: true,
  fixed: false,
  wireless: { enabled: false },
}

const BASE_SIN: SinData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [] },
  id: SIN_ID,
  name: "Fake SIN (Chicago)",
  itemType: ItemType.sin,
  rating: 4,
  source: { book: "SR4A", page: 297 },
  effects: [{ type: GameEffectType.dicePoolMod, target: "Con", value: 1 }],
  quantity: 1,
  equipped: true,
  stashed: false,
  fixed: false,
  wireless: { enabled: false },
}

const COVERED_LICENSE: LicenseData = {
  kind: EntityKind.item, items: { parentId: SIN_ID, childIds: [] },
  id: COVERED_LICENSE_ID,
  name: "License: Ares Predator",
  itemType: ItemType.license,
  rating: 4,
}

function buildCredstick(toggles: CredstickFieldToggles): CredstickData {
  const withCommon = withCommonFields(BASE_CREDSTICK, toggles)
  return {
    ...withCommon,
    name: toggles.name ? BASE_CREDSTICK.name : "",
    rating: toggles.rating ? BASE_CREDSTICK.rating : undefined,
  }
}

function buildLicense(toggles: CommonFieldToggles): LicenseData {
  return withCommonFields(BASE_LICENSE, toggles)
}

function buildSin(toggles: SinFieldToggles): SinData {
  const sin = withCommonFields(BASE_SIN, toggles)
  return {
    ...sin,
    items: { ...sin.items, childIds: toggles.coveredLicense ? [COVERED_LICENSE_ID] : [] },
  }
}

/**
 * Static demo data for the remaining `ItemCard`-based types (armor, device, program, implant,
 * vehicle, weapon). Unlike Credstick/License/SIN above, these don't need per-field toggles —
 * they're here to exercise each type's own stat block, subitems, and inline actions once, not a
 * field-coverage check — so each item is seeded with its subitems/children.
 */
const DEMO_ARMOR: ArmorData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [ARMOR_MOD_ID] },
  id: ARMOR_ID,
  name: "Armor Jacket",
  itemType: ItemType.armor,
  ballistic: 8,
  impact: 6,
  source: { book: "SR4A", page: 315 },
  cost: 1_000,
  quantity: 1,
  availability: { rating: 6 },
  equipped: true,
}

const DEMO_ARMOR_MOD: ArmorData = {
  kind: EntityKind.item, items: { parentId: ARMOR_ID, childIds: [] },
  id: ARMOR_MOD_ID,
  name: "Helmet",
  itemType: ItemType.armor,
  ballistic: 1,
  impact: 1,
  isModifier: true,
}

const DEMO_DEVICE: DeviceData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [PROGRAM_ID] },
  id: DEVICE_ID,
  name: "Erika Elite",
  itemType: ItemType.device,
  deviceType: "commlink",
  deviceModel: "Erika Elite",
  deviceRating: 4,
  response: 4,
  signal: 5,
  system: 4,
  firewall: 4,
  source: { book: "SR4A", page: 333 },
  cost: 3_000,
  quantity: 1,
  availability: { rating: 8, restricted: true },
  equipped: true,
}

const DEMO_PROGRAM: ProgramData = {
  kind: EntityKind.item, items: { parentId: DEVICE_ID, childIds: [] },
  id: PROGRAM_ID,
  name: "Analyze",
  itemType: ItemType.program,
  rating: 4,
  programType: ProgramType.scan,
  source: { book: "SR4A", page: 333 },
  cost: 400,
  quantity: 1,
}

const DEMO_IMPLANT: ImplantData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [IMPLANT_ACCESSORY_ID] },
  id: IMPLANT_ID,
  name: "Wired Reflexes",
  itemType: ItemType.implant,
  implantType: ImplantType.cyberware,
  grade: ImplantGrade.standard,
  essenceCost: 2,
  location: ImplantLocation.torso,
  source: { book: "SR4A", page: 339 },
  cost: 39_000,
  quantity: 1,
  availability: { rating: 8, restricted: true },
  equipped: true,
}

const DEMO_IMPLANT_ACCESSORY: ImplantData = {
  kind: EntityKind.item, items: { parentId: IMPLANT_ID, childIds: [] },
  id: IMPLANT_ACCESSORY_ID,
  name: "Rating 3 Upgrade",
  itemType: ItemType.implant,
  essenceCost: 0.5,
}

const DEMO_VEHICLE: VehicleData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [VEHICLE_MOD_ID] },
  id: VEHICLE_ID,
  name: "Ares Roadmaster",
  itemType: ItemType.vehicle,
  vehicleCategory: VehicleCategory.vehicle,
  vehicleType: "Car",
  handling: 3,
  accel: "1/2",
  pilot: 2,
  speed: 3,
  body: 4,
  armor: 6,
  sensor: 2,
  damage: { physical: 2 },
  source: { book: "SR4A", page: 353 },
  cost: 45_000,
  quantity: 1,
  availability: { rating: 8 },
}

const DEMO_VEHICLE_MOD: ItemData = {
  kind: EntityKind.item, items: { parentId: VEHICLE_ID, childIds: [] },
  id: VEHICLE_MOD_ID,
  name: "Run-Flat Tires",
  itemType: ItemType.other,
}

const DEMO_WEAPON: FirearmData = {
  kind: EntityKind.item, items: { parentId: null, childIds: [WEAPON_ACCESSORY_ID] },
  id: WEAPON_ID,
  name: "Ares Predator V",
  itemType: ItemType.weapon,
  weaponType: WeaponType.firearm,
  firearmType: FirearmTypeKey.heavyPistol,
  firemodes: ["SA"],
  recoil: 1,
  ammo: { size: 15, remaining: 15, type: "clip" },
  skill: SkillKey.pistols,
  dmg: "8P",
  ap: -1,
  source: { book: "SR4A", page: 320 },
  cost: 500,
  quantity: 1,
  availability: { rating: 4, restricted: true },
  equipped: true,
}

const DEMO_WEAPON_ACCESSORY: ItemData = {
  kind: EntityKind.item, items: { parentId: WEAPON_ID, childIds: [] },
  id: WEAPON_ACCESSORY_ID,
  name: "Smartgun System",
  itemType: ItemType.firearmAccessory,
}

/**
 * Every `ItemData` type card rebuilt on `ItemCard`/`EntityCard` (ADR-0010) — Credstick, License,
 * and SIN each have a toggle row for every optional `EntityData`/`ItemData` field that visibly
 * affects the card, so a reviewer can check the rendering with a field present vs. absent without
 * hunting through real runner data for an item in that state; the remaining types (Armor, Device,
 * Program, Implant, Vehicle, Weapon) use static demo data instead, to exercise their own stat
 * block, subitems, and inline actions once rather than a field-coverage check.
 *
 * All of these dispatch through the runner store for their built-in Remove/Equip actions (and
 * `SinDataCard` reads its covered licenses back out of it), so this page wraps everything in a
 * real `RunnerStoreProvider`/`RunnerDataStore` seeded from all of the items, rebuilt from the
 * toggle state on every change.
 */
function MigratedItemCardsTestPage() {
  const [credstickToggles, setCredstickToggles] = useState<CredstickFieldToggles>({
    ...DEFAULT_COMMON_TOGGLES,
    name: true,
    rating: true,
  })
  const [licenseToggles, setLicenseToggles] = useState<CommonFieldToggles>({ ...DEFAULT_COMMON_TOGGLES })
  const [sinToggles, setSinToggles] = useState<SinFieldToggles>({ ...DEFAULT_COMMON_TOGGLES, coveredLicense: true })

  const credstickItem = useMemo(() => buildCredstick(credstickToggles), [credstickToggles])
  const licenseItem = useMemo(() => buildLicense(licenseToggles), [licenseToggles])
  const sinItem = useMemo(() => buildSin(sinToggles), [sinToggles])

  const runnerStore = useMemo(() => {
    const runnerData = runnerDataFactory({ override: (runner) => ({
      ...runner,
      gear: {
        [credstickItem.id]: credstickItem,
        [licenseItem.id]: licenseItem,
        [sinItem.id]: sinItem,
        ...(sinToggles.coveredLicense ? { [COVERED_LICENSE_ID]: COVERED_LICENSE } : {}),
        [ARMOR_ID]: DEMO_ARMOR,
        [ARMOR_MOD_ID]: DEMO_ARMOR_MOD,
        [DEVICE_ID]: DEMO_DEVICE,
        [PROGRAM_ID]: DEMO_PROGRAM,
        [IMPLANT_ID]: DEMO_IMPLANT,
        [IMPLANT_ACCESSORY_ID]: DEMO_IMPLANT_ACCESSORY,
        [VEHICLE_ID]: DEMO_VEHICLE,
        [VEHICLE_MOD_ID]: DEMO_VEHICLE_MOD,
        [WEAPON_ID]: DEMO_WEAPON,
        [WEAPON_ACCESSORY_ID]: DEMO_WEAPON_ACCESSORY,
      },
    }) })
    return new RunnerDataStore(runnerData)
  }, [credstickItem, licenseItem, sinItem, sinToggles.coveredLicense])

  return (
    <RunnerStoreProvider store={runnerStore}>
      <Stack sx={{ gap: 3, padding: 2 }}>
        <Typography variant="h2">Migrated Item Cards</Typography>
        <Typography color="text.secondary">
          Every `ItemData` type card, all rebuilt on `ItemCard`/`EntityCard` (ADR-0010). Credstick, License, and SIN
          below have a toggle row per field — toggle one off to check the card still renders sensibly without it.
        </Typography>

        <Paper>
          <Stack sx={{ gap: 2, padding: 2 }}>
            <Section
              title="CredstickDataCard"
              description="Balance/type are always shown; every other field below is toggleable."
            >
              <FieldToggleGroup
                toggles={credstickToggles}
                config={CREDSTICK_TOGGLE_CONFIG}
                onToggle={(key) => toggleField(setCredstickToggles, key)}
              />
              <CredstickDataCard
                credstick={credstickItem}
                onOpen={() => alert("onOpen")}
                onEdit={() => alert("onEdit")}
              />
            </Section>
          </Stack>
        </Paper>

        <Paper>
          <Stack sx={{ gap: 2, padding: 2 }}>
            <Section
              title="LicenseDataCard"
              description="Rating is required by LicenseData, so it isn't toggleable here. Cost/Availability aren't shown either — LicenseFormDialog forces both off, so real Licenses never have them."
            >
              <FieldToggleGroup
                toggles={licenseToggles}
                config={COMMON_TOGGLE_CONFIG_NO_COST_OR_AVAILABILITY}
                onToggle={(key) => toggleField(setLicenseToggles, key)}
              />
              <LicenseDataCard
                license={licenseItem}
                onOpen={() => alert("onOpen")}
                onEdit={() => alert("onEdit")}
              />
            </Section>
          </Stack>
        </Paper>

        <Paper>
          <Stack sx={{ gap: 2, padding: 2 }}>
            <Section
              title="SinDataCard"
              description="'Covered License' seeds a child License into the runner store so the Subitem row has something to show. Cost/Availability aren't shown either — SinFormDialog forces both off, so real SINs never have them."
            >
              <FieldToggleGroup
                toggles={sinToggles}
                config={SIN_TOGGLE_CONFIG}
                onToggle={(key) => toggleField(setSinToggles, key)}
              />
              <SinDataCard sin={sinItem} onOpen={() => alert("onOpen")} onEdit={() => alert("onEdit")} />
            </Section>
          </Stack>
        </Paper>

        <Typography variant="h2">More Item Cards (static demo data)</Typography>
        <Typography color="text.secondary">
          The remaining `ItemData` type cards, also on `ItemCard`/`EntityCard` — each seeded with static demo data
          rather than toggleable fields, to exercise its own stat block, subitems, and inline actions once.
        </Typography>

        <Paper>
          <Stack sx={{ gap: 2, padding: 2 }}>
            <Section title="ArmorDataCard" description="Includes a Helmet mod as a Subitem.">
              <ArmorDataCard armor={DEMO_ARMOR} onOpen={() => alert("onOpen")} onEdit={() => alert("onEdit")} />
            </Section>
          </Stack>
        </Paper>

        <Paper>
          <Stack sx={{ gap: 2, padding: 2 }}>
            <Section title="DeviceDataCard" description="Includes an Analyze program as a Subitem.">
              <DeviceDataCard device={DEMO_DEVICE} onOpen={() => alert("onOpen")} onEdit={() => alert("onEdit")} />
            </Section>
          </Stack>
        </Paper>

        <Paper>
          <Stack sx={{ gap: 2, padding: 2 }}>
            <Section title="ProgramDataCard" description="Rendered standalone, outside its parent Device.">
              <ProgramDataCard
                program={DEMO_PROGRAM}
                onOpen={() => alert("onOpen")}
                onEdit={() => alert("onEdit")}
              />
            </Section>
          </Stack>
        </Paper>

        <Paper>
          <Stack sx={{ gap: 2, padding: 2 }}>
            <Section title="ImplantDataCard" description="Includes a Rating 3 Upgrade accessory as a Subitem.">
              <ImplantDataCard
                implant={DEMO_IMPLANT}
                onOpen={() => alert("onOpen")}
                onEdit={() => alert("onEdit")}
              />
            </Section>
          </Stack>
        </Paper>

        <Paper>
          <Stack sx={{ gap: 2, padding: 2 }}>
            <Section title="VehicleDataCard" description="Includes a damage track and a Run-Flat Tires Subitem.">
              <VehicleDataCard
                vehicle={DEMO_VEHICLE}
                onOpen={() => alert("onOpen")}
                onEdit={() => alert("onEdit")}
              />
            </Section>
          </Stack>
        </Paper>

        <Paper>
          <Stack sx={{ gap: 2, padding: 2 }}>
            <Section title="WeaponDataCard" description="A firearm, with a Smartgun System accessory as a Subitem.">
              <WeaponDataCard weapon={DEMO_WEAPON} onOpen={() => alert("onOpen")} onEdit={() => alert("onEdit")} />
            </Section>
          </Stack>
        </Paper>
      </Stack>
    </RunnerStoreProvider>
  )
}
