# Gear Structure Refactor

Refactoring the gear system to use a unified `ItemData`-backed flat map (`Record<string, ItemData>`) on
`CharacterSheet`, accessed through a shared `GearApi` in both the character viewer and the character builder.

---

## Key Files

### Core Type Layer — `src/lib/system/`

| File                     | Purpose                                                                                                                                                 |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ItemData.ts`            | Base interface for all gear items: `id`, `name`, `itemType`, `cost`, `quantity`, `availability`, `source`, `parentId`, `childIds`, `notes`, `description`, `equipped`, `fixed`, `rating`, `wireless`, `effects`; `createItem<T>()` factory; `createItemMap()` utility |
| `gearType.ts`            | `GearType` enum — discriminant values used as `itemType` on `ItemData`                                                                                  |
| `gear/armorData.ts`      | `ArmorData` with `ballistic` and `impact` ratings                                                                                                       |
| `gear/weaponData.ts`     | Firearm / melee / thrown / projectile weapon interfaces                                                                                                 |
| `gear/implantData.ts`    | `ImplantData` with `implantType`, `grade`, `location`, `essenceCost`, `capacityCost`                                                                    |
| `gear/deviceData.ts`     | `DeviceData` with matrix specs (response, signal, OS, etc.)                                                                                             |
| `gear/vehicleData.ts`    | `VehicleData` with handling, acceleration, pilot, body, armor, sensor                                                                                   |
| `gear/licenseData.ts`    | `LicenseData` with `verification` and `rating`                                                                                                          |
| `gear/SinData.ts`        | `SinData` with `licenses` and `verification`                                                                                                            |
| `gear/programData.ts`    | `ProgramData` with `rating` and `skill`                                                                                                                 |
| `characterSheet.ts`      | `CharacterSheet` — gear field is `gear: Record<string, ItemData>`                                                                                       |

> **Note:** There is no separate `GearData` type. All gear-specific fields (`notes`, `equipped`, `fixed`, `wireless`,
> `effects`) were consolidated into `ItemData`. Use `createItem<T>()` (not the old `createGear<T>()`) to create gear
> items with auto-assigned UUIDs.

### GearApi Layer — `src/components/Gear/`

| File                   | Purpose                                                                                                                                                                                                  |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GearApi.ts`           | `GearApi` interface + `createGearApi()` factory — `set`, `add`, `remove`, `setParent`, `addChild`                                                                                                        |
| `GearProvider.tsx`     | Generic provider component — wraps children with `GearContext`; accepts any `Store<{ gear: Record<UUID, ItemData> }>`; used by both `CharacterSheetProvider` and `CharacterBuilderStoreProvider`          |
| `UseGearApi.ts`        | `useGearApi()` hook — reads `GearApi` from `GearContext`                                                                                                                                                 |
| `GearUtils.ts`         | Shared gear utility helpers                                                                                                                                                                              |
| `AvailabilityChip.tsx` | Shared chip component for availability display                                                                                                                                                           |

### Viewer Integration

| File                                                  | Purpose                                                                                         |
|-------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `src/components/Character/CharacterSheetProvider.tsx` | Wraps children with `<GearProvider store={store}>` so viewer components can call `useGearApi()` |
| `src/routes/$characterId/gear.tsx`                    | Gear viewer route — **placeholder stub**                                                        |

### Builder Integration

| File                                                                | Purpose                                                                                                    |
|---------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| `src/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx` | Wraps `CharacterSheetProvider` (which wraps `GearProvider`) so builder gear components can call `useGearApi()` |
| `src/components/CharacterBuilder/Sections/Gear/GearSection.tsx`     | Top-level accordion UI for all gear categories, BP/nuyen totals, availability warnings                     |
| `src/components/CharacterBuilder/Sections/Gear/GearUtils.ts`        | `GearBuildPointAllowance` (50 BP), `GearNuyenAllowance` (250,000¥), `GearMaxAvailability` (12), cost hooks |
| `src/components/CharacterBuilder/Sections/Gear/SectionHeader.tsx`   | `SectionHeader` enum (Cyberware, Weapons, Armor, Vehicles, Devices, SINs & Licenses, Misc, Lifestyle)      |

### Builder Gear Panels

| File                                                                    | Purpose                                                                     |
|-------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `Armor/ArmorPanel.tsx`                                                  | Armor management; `itemType: GearType.armor`                                |
| `Cyberware/CyberwarePanel.tsx`                                          | Cyberware/bioware; `itemType: GearType.implant`; shows essence tracker      |
| `Cyberware/CyberwareList.tsx` + `CyberwareListItem.tsx`                 | List and item display for cyberware                                         |
| `Cyberware/ImplantUtils.ts`                                             | Essence cost math per grade; `ImplantEssenceSummary` type                   |
| `Cyberware/Forms/ImplantFormState.ts` + `ImplantFormFields.tsx` + `UseImplantForm.tsx` | Cyberware-specific form shape and fields                   |
| `Devices/DevicesPanel.tsx`                                              | Devices; `itemType: GearType.device`                                        |
| `Lifestyle/LifestylePanel.tsx` + `UseLifestyleStore.ts`                 | Lifestyle selection; stored on `profile.lifestyle`, not as a gear item      |
| `Misc/MiscPanel.tsx`                                                    | Miscellaneous; `itemType: GearType.other`                                   |
| `Vehicles/VehiclesPanel.tsx`                                            | Vehicles; `itemType: GearType.vehicle`                                      |
| `Weapons/WeaponsPanel.tsx`                                              | Weapons; `itemType: GearType.weapon`                                        |
| `Licenses/SinsAndLicensesSection.tsx`                                   | SINs + licenses; `itemType: GearType.sin` / `GearType.license`              |
| `Licenses/SinsList.tsx` + `LicensesList.tsx`                            | SIN/license list views                                                      |
| `Licenses/SinUtils.ts`                                                  | SIN cost/availability helpers                                               |
| `Licenses/Forms/LicenseUtils.ts`                                        | License cost/availability helpers                                           |
| `Licenses/Forms/UseSinForm.tsx` + `UseLicenseForm.tsx`                  | TanStack Form hooks for SIN/license CRUD via `useGearApi()`                 |
| `Licenses/Dialogs/SinFormDialog.tsx` + `LicenseFormDialog.tsx` + `SinRemoveDialog.tsx` | Dialogs for SIN/license add/edit/remove                    |
| `StartingNuyenSection.tsx`                                              | Dice roller for starting nuyen; derived from lifestyle + unspent gear budget |

### Shared Builder Gear Components

| File                                          | Purpose                                                                                                |
|-----------------------------------------------|--------------------------------------------------------------------------------------------------------|
| `Generic/GearItemCard.tsx`                    | Display card with availability chip, cost, edit/delete actions                                         |
| `Generic/GearItemsList.tsx`                   | List container with add/edit/delete orchestration                                                      |
| `Generic/Dialogs/GearItemFormDialog.tsx`      | Modal dialog for generic gear add/edit                                                                 |
| `Generic/Forms/GearItemFormState.ts`          | Generic gear form interface: `id`, `parentId`, `name`, `cost`, `quantity`, `description`, `availability`, `source` |
| `Generic/Forms/GearItemFormFields.tsx`        | Form fields component for the generic shape                                                            |
| `Generic/Forms/UseItemForm.tsx`               | TanStack Form hook for generic gear items                                                              |

---

## Todo List

### ✅ Done

- [x] Define `ItemData` base interface (`src/lib/system/ItemData.ts`) — includes all gear-specific fields
- [x] `GearType` enum in `gearType.ts` — discriminant values for `ItemData.itemType`
- [x] Define all typed gear sub-interfaces (armor, weapon, implant, device, vehicle, license, sin, program)
- [x] `createItem<T>()` factory in `ItemData.ts` — auto-assigns `crypto.randomUUID()` as `id`, handles parent/child linking
- [x] `createItemMap()` utility in `ItemData.ts` — builds a `Record<string, ItemData>` from items/arrays
- [x] `CharacterSheet.gear` typed as `Record<string, ItemData>` (flat map, UUID-keyed)
- [x] `GearApi` interface with `set`, `add`, `remove`, `setParent`, `addChild`
- [x] `createGearApi()` factory — reads `store.state.gear` live so reads never go stale
- [x] `GearProvider` generic component — accepts any store with a `gear` field; used by both viewer and builder
  providers
- [x] `useGearApi()` hook reading from `GearContext`
- [x] `CharacterSheetProvider` wraps children with `GearProvider` (viewer)
- [x] `CharacterBuilderStoreProvider` delegates to `CharacterSheetProvider` (builder)
- [x] `GearSection.tsx` — accordion UI with all 8 category panels in the builder
- [x] `GearUtils.ts` — budget constants and reactive `useGearBuildPoints` / `useGearTotalCost` hooks
- [x] All builder gear panels: Armor, Cyberware, Devices, Lifestyle, Misc, Vehicles, Weapons, SINs & Licenses
- [x] Generic builder forms: `GearItemFormState`, `GearItemFormFields`, `UseItemForm`, `GearItemCard`,
  `GearItemsList`, `GearItemFormDialog`
- [x] Cyberware-specific forms: `ImplantFormState`, `ImplantFormFields`, `UseImplantForm`
- [x] SINs & Licenses forms: `UseSinForm`, `UseLicenseForm`, `SinFormFields`, `LicenseFormFields`, `SinUtils`,
  `LicenseUtils`
- [x] Availability warnings and BP/nuyen budget progress in `GearSection.tsx`
- [x] `AvailabilityChip` shared component
- [x] Essence tracking in `CyberwarePanel` — grade-adjusted cost, error alert on depletion, cyber/bio split display
- [x] `StartingNuyenSection` — dice roller for starting nuyen derived from lifestyle + unspent budget remainder

### ❌ Not Yet Done

- [ ] **Viewer gear route** — `src/routes/$characterId/gear.tsx` is a stub; implement a read-only gear sheet view (
  mirrors the builder sections but display-only)
- [ ] **Viewer gear display components** — no display-only components exist for the character sheet gear tab (e.g. a
  read-only `ImplantCard`, `WeaponCard`, etc.)
- [ ] **Align `GearItemFormState` with `ItemData`** — `GearItemFormState` duplicates `ItemData` fields (`id`, `name`,
  `cost`, `availability`, `source`) instead of extending it; aligning would let a single spread bridge form state ↔
  stored item
- [ ] **Reconcile `description` vs `notes`** — `ItemData` has both fields; `GearItemFormState` / `ImplantFormState`
  use `description` for user-visible text while `GearData` originally used `notes`; pick one and align all layers
- [ ] **`SectionHeader` enum coverage** — `GearType.software` and `GearType.firearmAccessory` have no corresponding
  `SectionHeader` panel; decide if they belong under Misc or get dedicated panels
- [ ] **Character schema migration** — if any field renames land (e.g. `description` → `notes`, or `itemType` string
  normalisation), a `CharacterMigration` entry must be added to `src/lib/storage/characters/migrations/index.ts`
- [ ] **Barrel / index export** for `src/components/Gear/` — add an `index.ts` so consumers import from
  `#/components/Gear` rather than individual file paths
