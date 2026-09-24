# src/components/entities/items — gear items

Each gear item type follows a three-layer pattern:

1. a `useXxxForm` hook (under `src/hooks/items/`) that wraps the app form with type-specific defaults and maps form
   state back to the typed item data;
2. an `XxxFormFields` component that renders the type's fields alongside the shared field groups;
3. an `XxxFormDialog` that combines the two.

The acquire / purchase / save submit decision is centralised in the shared item form dialog, not in each type. When
adding a type, copy the structure of an existing one (e.g. weapons: `useWeaponForm`, `WeaponFormFields`,
`WeaponFormDialog`).

Use **Item** for code identifiers and **Gear** only in UI copy — see `CONTEXT.md`.
