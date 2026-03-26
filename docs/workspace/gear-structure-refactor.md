# Gear Structure Refactor

Refactoring the gear system to use a unified `ItemData`-backed flat map (`Record<string, ItemData>`) on
`PlayerCharacterData`, accessed through a shared `GearApi` in both the character viewer and the character builder.

---

## Key Files

### Core Type Layer — `src/lib/system/types/`

| File                     | Purpose                                                                                                                                                 |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ItemData.ts`            | Base interface for all gear items: `id`, `name`, `itemType`, `cost`, `quantity`, `availability`, `source`, `parentId`, `childIds`                       |
| `gear/gearData.ts`       | `GearData extends ItemData` — adds `notes`, `equipped`, `fixed`, `rating`, `wireless`, `effects`; defines `GearType` enum and `createGear<T>()` factory |
| `gear/armorData.ts`      | `ArmorData` with `ballistic` and `impact` ratings                                                                                                       |
| `gear/weaponData.ts`     | Firearm / melee / thrown / projectile weapon interfaces                                                                                                 |
| `gear/implantData.ts`    | `ImplantData` with `implantType`, `grade`, `location`, `essenceCost`, `capacityCost`                                                                    |
| `gear/deviceData.ts`     | `DeviceData` with matrix specs (response, signal, OS, etc.)                                                                                             |
| `gear/vehicleData.ts`    | `VehicleData` with handling, acceleration, pilot, body, armor, sensor                                                                                   |
| `gear/licenseData.ts`    | `LicenseData` with `verification` and `rating`                                                                                                          |
| `gear/SinData.ts`        | `SinData` with `licenses` and `verification`                                                                                                            |
| `gear/programData.ts`    | `ProgramData` with `rating` and `skill`                                                                                                                 |
| `playerCharacterData.ts` | `PlayerCharacterData` — gear field is `gear: Record<string, ItemData>`                                                                                  |

### GearApi Layer — `src/lib/gear/`

| File                      | Purpose                                                                                                                                                                               |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GearApi.ts`              | `GearApi` interface + `createGearApi()` factory — `all`, `get`, `set`, `getParent`, `getChildren`, `getByType`, `addChild`, `create`, `remove`                                        |
| `GearContext.tsx`         | React context holding a `GearApi` instance (viewer)                                                                                                                                   |
| `GearProvider.tsx`        | Provider component — wraps children with `GearContext`; reads `gear` slice via `useCharacterStoreSlice` (**currently unused** — `CharacterStoreProvider` inlines this logic directly) |
| `BuilderGearProvider.tsx` | Provider component — wraps builder children with `BuilderGearContext`; reads `gear` slice via `useCharacterBuilderStoreSlice`                                                         |
| `UseGearApi.ts`           | `useGearApi()` hook — checks `GearContext` first, then `BuilderGearContext`                                                                                                           |

### Viewer Integration

| File                                                     | Purpose                                                                                                                                 |
|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `src/components/Character/CharacterStoreProvider.tsx`    | Inlines `createGearApi()` and provides `GearContext` alongside the character store — no separate `GearProvider` needed in viewer routes |
| `src/routes/$characterId/gear.tsx`                       | Gear viewer route — **placeholder stub** (`Hello "/$characterId/gear"!`)                                                                |
| `src/components/Character/Form/Gear/UseGearFormGroup.ts` | **Empty placeholder** for future viewer gear form group logic                                                                           |
| `src/components/Gear/AvailabilityChip.tsx`               | Shared chip component for availability display                                                                                          |

### Builder Integration

| File                                                     | Purpose                                                                                                    |
|----------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| `src/components/CharacterBuilder/CharacterForm.tsx`      | Wraps the gear section with `<BuilderGearProvider>`                                                        |
| `src/components/CharacterBuilder/Gear/GearSection.tsx`   | Top-level accordion UI for all gear categories, BP/nuyen totals, availability warnings                     |
| `src/components/CharacterBuilder/Gear/GearUtils.ts`      | `GearBuildPointAllowance` (50 BP), `GearNuyenAllowance` (250,000¥), `GearMaxAvailability` (12), cost hooks |
| `src/components/CharacterBuilder/Gear/SectionHeader.tsx` | `SectionHeader` enum (Cyberware, Weapons, Armor, Vehicles, Devices, SINs & Licenses, Misc, Lifestyle)      |

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
| `Licenses/Forms/SinFormState.ts` + `LicenseFormState.ts`                               | SIN/license form shapes with derived availability/cost helpers                |

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

- [x] Define `ItemData` base interface (`src/lib/system/types/ItemData.ts`)
- [x] Define `GearData extends ItemData` with gear-specific fields and `GearType` enum
- [x] Define all typed gear sub-interfaces (armor, weapon, implant, device, vehicle, license, sin, program)
- [x] `createGear<T>()` factory and `createFirearm()` shorthand in `gearData.ts`
- [x] `PlayerCharacterData.gear` typed as `Record<string, ItemData>` (flat map, UUID-keyed)
- [x] `GearApi` interface with `all`, `get`, `set`, `getParent`, `getChildren`, `getByType`, `addChild`, `create`,
  `remove`
- [x] `createGearApi()` factory backed by an Immer `StoreSlice`
- [x] `GearContext` / `BuilderGearContext` React contexts
- [x] `BuilderGearProvider` wrapping `CharacterForm` in the builder
- [x] `CharacterStoreProvider` inlines `GearContext` for the viewer (no extra wrapper needed in routes)
- [x] `useGearApi()` hook with fallback from viewer → builder context
- [x] `GearSection.tsx` — accordion UI with all 8 category panels in the builder
- [x] `GearUtils.ts` — budget constants and `useGearBuildPoints` / `useGearTotalCost` hooks
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
- [ ] **Wire `GearProvider` or remove it** — `src/lib/gear/GearProvider.tsx` exists but is never used; either use it in
  the character route or delete it (the logic is already inlined in `CharacterStoreProvider`)
- [ ] **Implement `UseGearFormGroup.ts`** — currently an empty placeholder under `src/components/Character/Form/Gear/`;
  define the viewer-side form group abstraction when the viewer gear UI is built
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
- [ ] **Barrel / index export** for `src/lib/gear/` — add an `index.ts` so consumers import from `#/lib/gear` rather
  than individual file paths
