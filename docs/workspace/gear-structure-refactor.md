# Gear Structure Refactor

Refactoring the gear system to use a unified `ItemData`-backed flat map (`Record<string, ItemData>`) on
`PlayerCharacterData`, accessed through a shared `GearApi` in both the character viewer and the character builder.

---

## Key Files

### Core Type Layer — `src/lib/system/`

| File                     | Purpose                                                                                                                                                 |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ItemData.ts`            | Base interface for all gear items: `id`, `name`, `itemType`, `cost`, `quantity`, `availability`, `source`, `parentId`, `childIds`                       |
| `gear/gearType.ts`       | `GearData extends ItemData` — adds `notes`, `equipped`, `fixed`, `rating`, `wireless`, `effects`; defines `GearType` enum and `createGear<T>()` factory |
| `gear/armorData.ts`      | `ArmorData` with `ballistic` and `impact` ratings                                                                                                       |
| `gear/weaponData.ts`     | Firearm / melee / thrown / projectile weapon interfaces                                                                                                 |
| `gear/implantData.ts`    | `ImplantData` with `implantType`, `grade`, `location`, `essenceCost`, `capacityCost`                                                                    |
| `gear/deviceData.ts`     | `DeviceData` with matrix specs (response, signal, OS, etc.)                                                                                             |
| `gear/vehicleData.ts`    | `VehicleData` with handling, acceleration, pilot, body, armor, sensor                                                                                   |
| `gear/licenseData.ts`    | `LicenseData` with `verification` and `rating`                                                                                                          |
| `gear/SinData.ts`        | `SinData` with `licenses` and `verification`                                                                                                            |
| `gear/programData.ts`    | `ProgramData` with `rating` and `skill`                                                                                                                 |
| `playerCharacterData.ts` | `PlayerCharacterData` — gear field is `gear: Record<string, ItemData>`                                                                                  |

### GearApi Layer — `src/components/Gear/`

| File                   | Purpose                                                                                                                                                                                                  |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GearApi.ts`           | `GearApi` interface + `createGearApi<TState>()` generic factory — `get`, `set`, `add`, `getParent`, `getChildren`, `getByType`, `addChild`, `remove`                                                     |
| `GearProvider.tsx`     | Generic provider component — wraps children with `GearContext`; accepts any `Store<TState>` where `TState` has a `gear` field; used by both `CharacterStoreProvider` and `CharacterBuilderStoreProvider` |
| `UseGearApi.ts`        | `useGearApi()` hook — reads `GearApi` from `GearContext`                                                                                                                                                 |
| `AvailabilityChip.tsx` | Shared chip component for availability display                                                                                                                                                           |

### Viewer Integration

| File                                                  | Purpose                                                                                         |
|-------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `src/components/Character/CharacterStoreProvider.tsx` | Wraps children with `<GearProvider store={store}>` so viewer components can call `useGearApi()` |
| `src/routes/$characterId/gear.tsx`                    | Gear viewer route — **placeholder stub**                                                        |

### Builder Integration

| File                                                                | Purpose                                                                                                    |
|---------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| `src/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx` | Wraps children with `<GearProvider store={store}>` so builder gear components can call `useGearApi()`      |
| `src/components/CharacterBuilder/Gear/GearSection.tsx`              | Top-level accordion UI for all gear categories, BP/nuyen totals, availability warnings                     |
| `src/components/CharacterBuilder/Gear/GearUtils.ts`                 | `GearBuildPointAllowance` (50 BP), `GearNuyenAllowance` (250,000¥), `GearMaxAvailability` (12), cost hooks |
| `src/components/CharacterBuilder/Gear/SectionHeader.tsx`            | `SectionHeader` enum (Cyberware, Weapons, Armor, Vehicles, Devices, SINs & Licenses, Misc, Lifestyle)      |

### Builder Gear Panels

| File                                                                                   | Purpose                                                                       |
|----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `Armor/ArmorPanel.tsx` + `UseArmorState.ts`                                            | Armor management; itemType `"armor"`                                          |
| `Cyberware/CyberwarePanel.tsx` + `UseImplantsStore.ts`                                 | Cyberware/bioware; itemType `"cyberware"`, mods itemType `"implantMods"`      |
| `Cyberware/Forms/ImplantFormState.ts` + `ImplantFormFields.tsx` + `UseImplantForm.tsx` | Cyberware-specific form shape and fields                                      |
| `Devices/DevicesPanel.tsx` + `UseDevicesState.ts`                                      | Devices; itemType `"devices"`                                                 |
| `Lifestyle/LifestylePanel.tsx`                                                         | Lifestyle selection; not stored as gear items (separate builder state fields) |
| `Misc/MiscPanel.tsx` + `UseMiscState.ts`                                               | Miscellaneous; itemType `"misc"`                                              |
| `Vehicles/VehiclesPanel.tsx` + `UseVehiclesState.ts`                                   | Vehicles; itemType `"vehicles"`                                               |
| `Weapons/WeaponsPanel.tsx` + `UseWeaponsState.ts`                                      | Weapons; itemType `"weapons"`                                                 |
| `Licenses/SinsAndLicensesSection.tsx`                                                  | SINs + licenses; itemType `"sins"` / `"licenses"`                             |
| `Licenses/UseSinsState.ts` + `UseLicensesState.ts`                                     | SIN/license CRUD via `useGearApi()`                                           |
| `Licenses/Forms/SinUtils.ts` + `LicenseUtils.ts`                                       | SIN/license form shapes with derived availability/cost helpers                |

### Shared Builder Gear Components

| File                                     | Purpose                                                                                                |
|------------------------------------------|--------------------------------------------------------------------------------------------------------|
| `Generic/GearItemCard.tsx`               | Display card with availability chip, cost, edit/delete actions                                         |
| `Generic/GearItemsList.tsx`              | List container with add/edit/delete orchestration                                                      |
| `Generic/Dialogs/GearItemFormDialog.tsx` | Modal dialog for generic gear add/edit                                                                 |
| `Generic/Forms/GearItemFormState.ts`     | Generic gear form interface: `id`, `name`, `cost`, `quantity`, `description`, `availability`, `source` |
| `Generic/Forms/GearItemFormFields.tsx`   | Form fields component for the generic shape (uses `AvailabilityFormFields`, `SourceFormFields`)        |
| `Generic/Forms/UseGearItemForm.tsx`      | TanStack Form hook for generic gear items                                                              |
| `Generic/PlaceholderGearSection.tsx`     | Fallback panel for gear categories without dedicated UI                                                |

---

## Todo List

### ✅ Done

- [x] Define `ItemData` base interface (`src/lib/system/ItemData.ts`)
- [x] Define `GearData extends ItemData` with gear-specific fields and `GearType` enum
- [x] Define all typed gear sub-interfaces (armor, weapon, implant, device, vehicle, license, sin, program)
- [x] `createGear<T>()` factory in `gearType.ts`
- [x] `PlayerCharacterData.gear` typed as `Record<string, ItemData>` (flat map, UUID-keyed)
- [x] `GearApi` interface with `get`, `set`, `add`, `getParent`, `getChildren`, `getByType`, `addChild`, `remove`
- [x] `createGearApi<TState>()` generic factory — reads `store.state.gear` live so reads never go stale
- [x] `GearProvider` generic component — accepts any store with a `gear` field; used by both viewer and builder
  providers
- [x] `useGearApi()` hook reading from `GearContext`
- [x] `CharacterStoreProvider` wraps children with `GearProvider` (viewer)
- [x] `CharacterBuilderStoreProvider` wraps children with `GearProvider` (builder)
- [x] `GearSection.tsx` — accordion UI with all 8 category panels in the builder
- [x] `GearUtils.ts` — budget constants and reactive `useGearBuildPoints` / `useGearTotalCost` hooks
- [x] All builder gear panels: Armor, Cyberware, Devices, Lifestyle, Misc, Vehicles, Weapons, SINs & Licenses
- [x] Generic builder forms: `GearItemFormState`, `GearItemFormFields`, `UseGearItemForm`, `GearItemCard`,
  `GearItemsList`, `GearItemFormDialog`
- [x] Cyberware-specific forms: `ImplantFormState`, `ImplantFormFields`, `UseImplantForm`
- [x] SINs & Licenses forms: `SinFormState`, `LicenseFormState`, `SinFormFields`, `LicenseFormFields`, `UseSinsState`,
  `UseLicensesState`
- [x] Availability warnings and BP/nuyen budget progress in `GearSection.tsx`
- [x] `AvailabilityChip` shared component

### ❌ Not Yet Done

- [ ] **Viewer gear route** — `src/routes/$characterId/gear.tsx` is a stub; implement a read-only gear sheet view (
  mirrors the builder sections but display-only)
- [ ] **Align `itemType` strings with `GearType` enum** — builder `UseXxxState` files use ad-hoc plural strings (
  `"sins"`, `"licenses"`, `"cyberware"`, `"weapons"`, `"devices"`, `"vehicles"`, `"armor"`, `"misc"`, `"implantMods"`)
  instead of the `GearType` enum values; standardise or document the mapping
- [ ] **Align `GearItemFormState` / `ImplantFormState` with `ItemData`** — form state interfaces duplicate `ItemData`
  fields (`id`, `name`, `cost`, `availability`, `source`) instead of extending it; align so a single cast or spread
  bridges form state ↔ stored item
- [ ] **Reconcile `description` vs `notes`** — `GearData` uses `notes` for user-visible text, `ItemData` uses
  `description`, and `GearItemFormState` / `ImplantFormState` use `description`; pick one field name and align all three
  layers
- [ ] **`SectionHeader` enum coverage** — `GearType.software` and `GearType.firearmAccessory` have no corresponding
  `SectionHeader` panel; decide if they belong under Misc or get dedicated panels
- [ ] **Viewer gear display components** — no display-only components exist for the character sheet gear tab (e.g. a
  read-only `ImplantCard`, `WeaponCard`, etc.)
- [ ] **Character schema migration** — if any field renames land (e.g. `description` → `notes`, or `itemType` string
  normalisation), a `CharacterMigration` entry must be added to `src/lib/storage/characters/migrations/index.ts`
- [ ] **Barrel / index export** for `src/components/Gear/` — add an `index.ts` so consumers import from
  `#/components/Gear` rather than individual file paths
