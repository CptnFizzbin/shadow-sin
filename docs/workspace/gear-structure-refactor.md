# Gear Structure Refactor

Refactoring the gear system to use a unified `ItemData`-backed flat map (`Record<string, ItemData>`) on
`CharacterSheet`, accessed through a shared `GearApi` in both the character viewer and the character builder.

---

## Key Files

### Core Type Layer — `src/lib/system/`

- **`ItemData.ts`** — Base interface for all gear items: `id`, `name`, `itemType`, `cost`, `quantity`, `availability`,
  `source`, `parentId`, `childIds`, `notes`, `description`, `equipped`, `fixed`, `rating`, `wireless`, `effects`;
  `createItem<T>()` factory; `createItemMap()` utility
- **`gearType.ts`** — `GearType` enum — discriminant values used as `itemType` on `ItemData`
- **`gear/armorData.ts`** — `ArmorData` with `ballistic` and `impact` ratings
- **`gear/weaponData.ts`** — Firearm / melee / thrown / projectile weapon interfaces
- **`gear/implantData.ts`** — `ImplantData` with `implantType`, `grade`, `location`, `essenceCost`, `capacityCost`
- **`gear/deviceData.ts`** — `DeviceData` with matrix specs (response, signal, OS, etc.)
- **`gear/vehicleData.ts`** — `VehicleData` with handling, acceleration, pilot, body, armor, sensor
- **`gear/licenseData.ts`** — `LicenseData` with `verification` and `rating`
- **`gear/SinData.ts`** — `SinData` with `licenses` and `verification`
- **`gear/programData.ts`** — `ProgramData` with `rating` and `skill`
- **`characterSheet.ts`** — `CharacterSheet` — gear field is `gear: Record<string, ItemData>`

> **Note:** There is no separate `GearData` type. All gear-specific fields (`notes`, `equipped`, `fixed`, `wireless`,
> `effects`) were consolidated into `ItemData`. Use `createItem<T>()` (not the old `createGear<T>()`) to create gear
> items with auto-assigned UUIDs.

### GearApi Layer — `src/components/Gear/`

> **Note:** There are no separate `GearApi.ts` or `GearProvider.tsx` files. The API interface and all hooks live
> together in `UseGearApi.ts`. There is no `GearProvider` component — `useGearApi()` reads from `CharacterSheetContext`
> directly via `useCharacterSheetContext()`.

- **`UseGearApi.ts`** — `GearApi` interface + `useGearApi()` hook (reads/writes `CharacterSheet.gear` via
  `CharacterSheetContext`); plus reactive selector hooks: `useGearById`, `useGearByType`, `useGearParent`,
  `useGearChildren`, `useGearFilter`
- **`GearUtils.ts`** — `NullGearId` constant only
- **`AvailabilityChip.tsx`** — Shared chip component for availability display

### Viewer Integration

- **`src/components/Character/CharacterSheetProvider.tsx`** — Provides `CharacterSheetContext` with the store;
  `useGearApi()` reads from this context directly — no separate `GearProvider` wrapper
- **`src/routes/$characterId/gear.tsx`** — Gear viewer route — **placeholder stub**

### Builder Integration

- **`src/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx`** — Wraps `CharacterSheetProvider` directly (no
  `GearProvider` intermediary); bridges the builder store's `characterSheet` slice to a `CharacterSheetStore` so all
  gear hooks work in builder components
- **`src/components/CharacterBuilder/Sections/Gear/GearSection.tsx`** — Top-level accordion UI for all gear categories,
  BP/nuyen totals, availability warnings
- **`src/components/CharacterBuilder/Sections/Gear/GearUtils.ts`** — `GearBuildPointAllowance` (50 BP),
  `GearNuyenAllowance` (250,000¥), `GearMaxAvailability` (12), `useGearTotalCost`, `useGearBuildPoints`,
  `useGearAvailabilityIssues` hooks
- **`src/components/CharacterBuilder/Sections/Gear/sectionHeader.tsx`** — `SectionHeader` enum (Cyberware, Weapons,
  Armor, Vehicles, Devices, SINs & Licenses, Misc, Lifestyle)

### Builder Gear Panels

- **`Armor/ArmorPanel.tsx`** — Armor management; `itemType: GearType.armor`
- **`Cyberware/CyberwarePanel.tsx`** — Cyberware/bioware; `itemType: GearType.implant`; shows essence tracker
- **`Cyberware/CyberwareList.tsx` + `CyberwareListItem.tsx`** — List and item display for cyberware
- **`Cyberware/ImplantUtils.ts`** — Essence cost math per grade; `ImplantEssenceSummary` type
- **`Cyberware/Forms/UseImplantForm.tsx`** — Implant form state (`defaultFormValues: ImplantData`), `implantFormOpts`,
  `implantFieldMap`, `useImplantForm()` hook — form shape and defaults are defined inline (no separate
  `ImplantFormState.ts`)
- **`Cyberware/Forms/ImplantFormFields.tsx`** — Form fields component for the implant shape
- **`Devices/DevicesPanel.tsx`** — Devices; `itemType: GearType.device`
- **`Lifestyle/LifestylePanel.tsx` + `UseLifestyleStore.ts`** — Lifestyle selection; stored on `profile.lifestyle`, not
  as a gear item
- **`Misc/MiscPanel.tsx`** — Miscellaneous; `itemType: GearType.other`
- **`Vehicles/VehiclesPanel.tsx`** — Vehicles; `itemType: GearType.vehicle`
- **`Weapons/WeaponsPanel.tsx`** — Weapons; `itemType: GearType.weapon`
- **`Licenses/SinsAndLicensesSection.tsx`** — SINs + licenses; `itemType: GearType.sin` / `GearType.license`
- **`Licenses/SinsList.tsx` + `LicensesList.tsx`** — SIN/license list views
- **`Licenses/SinUtils.ts`** — SIN cost/availability helpers
- **`Licenses/Forms/LicenseUtils.ts`** — License cost/availability helpers
- **`Licenses/Forms/UseSinForm.tsx` + `UseLicenseForm.tsx`** — TanStack Form hooks for SIN/license CRUD via
  `useGearApi()`
- **`Licenses/Dialogs/SinFormDialog.tsx` + `LicenseFormDialog.tsx` + `SinRemoveDialog.tsx`** — Dialogs for SIN/license
  add/edit/remove
- **`StartingNuyenSection.tsx`** — Dice roller for starting nuyen; derived from lifestyle + unspent gear budget

### Shared Builder Gear Components

- **`Generic/GearItemCard.tsx`** — Display card with availability chip, cost, edit/delete actions
- **`Generic/GearItemsList.tsx`** — List container with add/edit/delete orchestration
- **`Generic/Dialogs/GearItemFormDialog.tsx`** — Modal dialog for generic gear add/edit
- **`Generic/Forms/UseItemForm.tsx`** — Generic gear form — uses `ItemData` directly as form state (no separate
  `GearItemFormState.ts`); exports `gearItemFormOpts`, `gearItemFieldMap`, `useItemForm()`
- **`Generic/Forms/GearItemFormFields.tsx`** — Form fields component for the generic shape

---

## Todo List

### ✅ Done

- [x] Define `ItemData` base interface (`src/lib/system/ItemData.ts`) — includes all gear-specific fields
- [x] `GearType` enum in `gearType.ts` — discriminant values for `ItemData.itemType`
- [x] Define all typed gear sub-interfaces (armor, weapon, implant, device, vehicle, license, sin, program)
- [x] `createItem<T>()` factory in `ItemData.ts` — auto-assigns `crypto.randomUUID()` as `id`, handles parent/child
  linking
- [x] `createItemMap()` utility in `ItemData.ts` — builds a `Record<string, ItemData>` from items/arrays
- [x] `CharacterSheet.gear` typed as `Record<string, ItemData>` (flat map, UUID-keyed)
- [x] `GearApi` interface with `set`, `add`, `remove`, `setParent`, `addChild`
- [x] `useGearApi()` hook in `UseGearApi.ts` — reads `store.state.gear` via `CharacterSheetContext`; also exports
  `useGearById`, `useGearByType`, `useGearParent`, `useGearChildren`, `useGearFilter`
- [x] `CharacterSheetProvider` exposes `CharacterSheetContext` used by `useGearApi()` (no separate GearProvider needed)
- [x] `CharacterBuilderStoreProvider` wraps `CharacterSheetProvider` so builder gear components can call `useGearApi()`
- [x] `GearSection.tsx` — accordion UI with all 8 category panels in the builder
- [x] `GearUtils.ts` (builder) — budget constants and reactive `useGearBuildPoints` / `useGearTotalCost` /
  `useGearAvailabilityIssues` hooks
- [x] All builder gear panels: Armor, Cyberware, Devices, Lifestyle, Misc, Vehicles, Weapons, SINs & Licenses
- [x] Generic builder forms: `UseItemForm` (form state inline as `ItemData`), `GearItemFormFields`, `GearItemCard`,
  `GearItemsList`, `GearItemFormDialog`
- [x] Cyberware-specific forms: `UseImplantForm` (form state inline as `ImplantData`), `ImplantFormFields`
- [x] SINs & Licenses forms: `UseSinForm`, `UseLicenseForm`, `SinFormFields`, `LicenseFormFields`, `SinUtils`,
  `LicenseUtils`
- [x] Availability warnings and BP/nuyen budget progress in `GearSection.tsx`
- [x] `AvailabilityChip` shared component
- [x] Essence tracking in `CyberwarePanel` — grade-adjusted cost, error alert on depletion, cyber/bio split display
- [x] `StartingNuyenSection` — dice roller for starting nuyen derived from lifestyle + unspent budget remainder
- [x] Generic gear form uses `ItemData` directly — no separate `GearItemFormState` type needed

### ❌ Not Yet Done

- [ ] **Viewer gear route** — `src/routes/$characterId/gear.tsx` is a stub; implement a read-only gear sheet view (
  mirrors the builder sections but display-only)
- [ ] **Viewer gear display components** — no display-only components exist for the character sheet gear tab (e.g. a
  read-only `ImplantCard`, `WeaponCard`, etc.)
- [ ] **Reconcile `description` vs `notes`** — `ItemData` has both fields; form hooks use `description` for user-visible
  text; pick one and align all layers
- [ ] **`SectionHeader` enum coverage** — `GearType.software` and `GearType.firearmAccessory` have no corresponding
  `SectionHeader` panel; decide if they belong under Misc or get dedicated panels
- [ ] **Character schema migration** — if any field renames land (e.g. `description` → `notes`, or `itemType` string
  normalisation), a `CharacterMigration` entry must be added to `src/lib/storage/characters/migrations/index.ts`
- [ ] **Barrel / index export** for `src/components/Gear/` — add an `index.ts` so consumers import from
  `#/components/Gear` rather than individual file paths
