# License management moves from a standalone Quick-Buy dialog into the item's own form

Licence acquire/purchase/change/remove for a gear item previously lived in a separate
`QuickBuyLicenseDialog`, triggered by a dedicated "Buy License" icon on the item card, while the
item's own edit form (`ItemDialog`) knew nothing about licensing. We moved licence management
into the item's own edit form — a new `GearFormLicenseSection`, composed into every per-type
form wrapper (`ArmorFormDialog`, `WeaponFormDialog`, `VehicleFormDialog`, `DeviceFormDialog`,
`ProgramFormDialog`, `ImplantFormDialog`, the generic `ItemFormDialog`) via the existing
`itemFields` slot each already uses for its own type-specific fields — so a licence is just
another part of editing the item, alongside cost, availability, and attachment. Acquiring is now
"assign an existing or new licence" from inside the item's form rather than a separate quick-buy
flow; the batch "also cover N unlicensed siblings" step is dropped in favor of adding items
directly from the licence's own edit form (see the amended
`docs/features/0001-license-quick-buy.md`).

`ItemDialog` itself stays generic and does not render the license section directly:
`GearFormLicenseSection` needs `useAssignLicenseDialog`, which needs `useSinFormDialog` (to
create a SIN inline), which wraps `ItemDialog` — rendering it from inside `ItemDialog` would
create an import cycle. Composing it into each per-type wrapper instead keeps `ItemDialog` a leaf
dependency. The previously-unused `licenseRequired`/`licenseAlwaysShow` option stubs on
`ItemDialog`'s generic toggle system were removed rather than repurposed: that system computes a
static forced/enabled flag once per dialog open, but license eligibility needs to react live as
the Player edits Availability within the same open form, which only `form.Subscribe` provides.

## Considered Options

- **Keep the standalone Quick-Buy dialog, add separate remove/change dialogs alongside it** —
  rejected: three overlapping dialogs (quick-buy, remove, change) for one relationship on one
  item is more surface area than a single license section inside the form that already opens for
  that item.
- **Render the license section directly inside `ItemDialog`** — rejected: creates an import
  cycle (`ItemDialog` → `GearFormLicenseSection` → `AssignLicenseDialog` → `SinFormDialog` →
  `ItemDialog`).
- **Compose `GearFormLicenseSection` into each per-type form wrapper via `itemFields`** ✅ — one
  place per item to see and manage its licence; reuses the acquire/purchase/save action pattern
  every other item type already has; keeps `ItemDialog` cycle-free.

## Consequences

- `QuickBuyLicenseDialog` and `useQuickBuyLicenseAction` are deleted; every item card that
  rendered the standalone "Buy License" trigger (`genericItemCard`, `gearViewItem`,
  `weaponItemCard`, `armorItemCard`, `vehicleItemCard`, `deviceItemCard`, `implantItemCard`)
  drops it — the action now lives only inside the item's edit form.
- The "also cover N other unlicensed siblings" batch shortcut from Quick-Buy has no direct
  replacement in `ItemDialog`; covering multiple items with one licence is now done from the
  licence's own edit form's item picker (`docs/features/0001-license-quick-buy.md`).
