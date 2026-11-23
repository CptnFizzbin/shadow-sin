# src/components/entities/items — gear items

Each gear item type follows a three-layer pattern:

1. a `useXxxForm` hook (under `src/hooks/items/`) that wraps the app form with type-specific defaults and maps form
   state back to the typed item data;
2. an `XxxFormFields` component that renders the type's fields alongside the shared field groups;
3. an `XxxFormDialog` that combines the two.

The acquire / purchase / save submit decision is centralised in the shared item form dialog, not in each type. When
adding a type, copy the structure of an existing one (e.g. weapons: `useWeaponForm`, `WeaponFormFields`,
`WeaponFormDialog`).

**Exception — adding credsticks.** `CredstickDialog` is a single hand-rolled dialog rather than the three layers, and
its add modes ("Receive" / "Create") write the new credstick themselves: a certified credstick costs a flat fee plus
the balance loaded onto it, which the shared cost-based purchase flow doesn't model. Its edit mode still follows the
shared rule — it returns the renamed credstick and `useEditItemDialog` saves it like any other Item. Its Withdraw
(deposit the balance, then remove) and Remove actions are credstick-only and also write in the dialog, since they
replace the save rather than produce an Item to save. Open every credstick edit through `useEditItemDialog`.

Use **Item** for code identifiers and **Gear** only in UI copy — see `GLOSSARY.md`.
