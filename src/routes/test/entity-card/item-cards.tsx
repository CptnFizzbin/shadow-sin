import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import type { Dispatch, FC, ReactNode, SetStateAction } from "react"
import { useMemo, useState } from "react"

import { CredstickDataCard } from "#/components/items/types/credsticks/credstickDataCard.tsx"
import { LicenseDataCard } from "#/components/items/types/licenses/licenseDataCard.tsx"
import { SinDataCard } from "#/components/items/types/licenses/sinDataCard.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import { CredstickType } from "#/system/gear/credstickData.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

export const Route = createFileRoute("/test/entity-card/item-cards")({
  component: MigratedItemCardsTestPage,
})

interface SectionProps {
  title: string
  description: string
  children: ReactNode
}

const Section: FC<SectionProps> = ({ title, description, children }) => (
  <Stack sx={{ gap: 1 }}>
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

const SIN_TOGGLE_CONFIG: FieldToggleConfigEntry<SinFieldToggles>[] = [
  { key: "coveredLicense", label: "Covered License (Subitem)" },
  ...COMMON_TOGGLE_CONFIG,
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

const BASE_CREDSTICK: CredstickData = {
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
  id: LICENSE_ID,
  name: "License: Ares Predator",
  itemType: ItemType.license,
  rating: 4,
  source: { book: "SR4A", page: 297 },
  effects: [{ type: GameEffectType.dicePoolMod, target: "Negotiation", value: -1 }],
  cost: 150,
  quantity: 1,
  availability: { rating: 4, restricted: true },
  equipped: false,
  stashed: true,
  fixed: false,
  wireless: { enabled: false },
}

const BASE_SIN: SinData = {
  id: SIN_ID,
  name: "Fake SIN (Chicago)",
  itemType: ItemType.sin,
  rating: 4,
  source: { book: "SR4A", page: 297 },
  effects: [{ type: GameEffectType.dicePoolMod, target: "Con", value: 1 }],
  cost: 3_000,
  quantity: 1,
  availability: { rating: 6, restricted: true },
  equipped: true,
  stashed: false,
  fixed: false,
  wireless: { enabled: false },
}

const COVERED_LICENSE: LicenseData = {
  id: COVERED_LICENSE_ID,
  name: "License: Ares Predator",
  itemType: ItemType.license,
  rating: 4,
  parentId: SIN_ID,
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
  return {
    ...withCommonFields(BASE_SIN, toggles),
    childIds: toggles.coveredLicense ? [COVERED_LICENSE_ID] : undefined,
  }
}

/**
 * Every `ItemData` type card currently rebuilt on `ItemCard`/`EntityCard` (ADR-0010) instead of
 * the legacy `DataCard`/`ItemDataCardRoot` — `CredstickDataCard`, `LicenseDataCard`,
 * `SinDataCard`. Each section has its own toggle row for every optional `EntityData`/`ItemData`
 * field that visibly affects the card, so a reviewer can check the migrated rendering with a
 * field present vs. absent without hunting through real runner data for an item in that state.
 *
 * `LicenseDataCard`/`SinDataCard` dispatch through the runner store for their built-in Remove
 * action and (for `SinDataCard`) read their covered licenses back out of it, so this page wraps
 * everything in a real `RunnerStoreProvider`/`RunnerDataStore` seeded from the same three items,
 * rebuilt from the toggle state on every change.
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
    const runnerData = runnerDataFactory((runner) => ({
      ...runner,
      gear: {
        [credstickItem.id]: credstickItem,
        [licenseItem.id]: licenseItem,
        [sinItem.id]: sinItem,
        ...(sinToggles.coveredLicense ? { [COVERED_LICENSE_ID]: COVERED_LICENSE } : {}),
      },
    }))
    return new RunnerDataStore(runnerData)
  }, [credstickItem, licenseItem, sinItem, sinToggles.coveredLicense])

  return (
    <RunnerStoreProvider store={runnerStore}>
      <Stack sx={{ gap: 3, padding: 2 }}>
        <Typography variant="h2">Migrated Item Cards</Typography>
        <Typography color="text.secondary">
          The `ItemData` type cards currently rebuilt on `ItemCard`/`EntityCard` (ADR-0010) rather than the legacy
          `DataCard`/`ItemDataCardRoot` — Credstick, License, and SIN. Toggle a field off to check the card still
          renders sensibly without it.
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
              description="Rating is required by LicenseData, so it isn't toggleable here."
            >
              <FieldToggleGroup
                toggles={licenseToggles}
                config={COMMON_TOGGLE_CONFIG}
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
              description="'Covered License' seeds a child License into the runner store so the Subitem row has something to show."
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
      </Stack>
    </RunnerStoreProvider>
  )
}
