# Licence Management & SIN Association

> **Status:** Implemented
>
> **GitHub Issues / PRs:**
> <!-- Add links once available. -->
>
> **Superseded design note:** this feature originally shipped as a standalone Quick-Buy dialog
> triggered from a "Buy License" icon on the item card. That dialog and its trigger hook
> (`QuickBuyLicenseDialog`, `useQuickBuyLicenseAction`) have been retired — licence
> acquire/change/remove now lives directly in the item's own edit form, and adding/removing the
> items a licence covers now lives in the licence's own edit form. See
> `docs/adr/0007-license-management-moves-into-item-form.md`. The sections below describe the
> current design; historical quick-buy specifics (sibling-name-and-type batch coverage) no
> longer apply and are called out where relevant.

In Shadowrun 4e, carrying a **Restricted** item legally requires a **Licence** registered to a **SIN**. Runners
typically carry multiple fake SINs, each with different sets of licences for different cover identities. Previously a
Player could only add a Licence as a freeform Item manually — there was no quick path to generate licences from
existing restricted gear, and no association between a Licence and the SIN it belongs to.

The feature adds:

- **From the gear form** (the item's own edit dialog, Builder and Viewer both): for a Restricted, non-Forbidden item,
  Acquire/Purchase assigns a licence — pick an existing licence or create a new one (pick or create the SIN it
  belongs to; the Licence's reality always matches its SIN's — the Real SIN produces a free, unrestricted Real
  Licence, a Fake SIN produces a Fake Licence with an adjustable rating defaulting to 3). Change reassigns the item
  to a different existing-or-new licence, silently overwriting its previous assignment. Remove unlinks just this
  item (the licence and any other items it covers are untouched). Acquire is free, Purchase withdraws Nuyen — Viewer
  only; the Builder has a single Add whose cost counts toward the Gear BP budget like any other item.
- **From the licence's own edit form**: an item picker to add or remove covered items. The picker lists any
  Restricted item, grouped by whether it's already covered by another licence or unlicensed; picking an
  already-covered item silently moves it to this licence. Removing an item unlinks it (it persists as unlicensed
  gear). This is now the mechanism for covering multiple items with one licence — the old quick-buy "also cover N
  other unlicensed items sharing the same name" batch checkbox is retired; there's no name/`ItemType` restriction on
  what a licence can cover.

## Resolved Questions

- **Licence ↔ SIN**: a Licence is an Attachment on its SIN (`Licence.parentId` = the SIN's id), reusing the existing
  Attachment mechanism rather than a new field.
- **Licence ↔ covered item(s)**: the reference lives on the *item* side, not the Licence — `ItemData.licenseId?: UUID`
  points at the covering Licence. This makes the relationship many-items-to-one-licence (a Licence has no covered-item
  list of its own; it's derived by filtering gear for `licenseId === license.id`), matching how a single Licence
  certifies a category of gear rather than one serial number.
- **Unlicensed-gear warnings**: not added. Out of scope for this pass — see Out of Scope below.
- **SIN burning**: not addressed. A dangling `licenseId` (its Licence was removed) is treated as unlicensed again by
  `isItemLicensed`, but there's no SIN-burning mechanic yet to key off.
- **Licence cost**: derived from a rating, same as before (`getLicenseCost`). Fake Licences default to rating 3
  (`DefaultFakeLicenseRating`) — both in the manual "Add License" form and the gear-form assign flow — and the
  Player can adjust it; a Real Licence has no rating and is always free.
- **Licence reality vs. SIN reality**: not independent — a Fake SIN can only carry Fake Licences, and only the Real
  SIN can carry a Real Licence. The assign flow derives `isReal` from the selected SIN's `rating` rather than
  offering it as a separate choice.
- **Where licence management lives**: acquire/change/remove for a single item's licence lives in that item's own
  edit form (`ItemDialog`), not a standalone dialog — see `docs/adr/0007-license-management-moves-into-item-form.md`.
  Adding/removing which items a licence covers lives in the licence's own edit form (`LicenseFormDialog`), with no
  name/`ItemType` restriction on eligible items (broader than the original quick-buy's "same name and type" sibling
  rule) — the picker groups candidates by whether they're already covered by another licence.

## Constraints

- Licences only apply to **Restricted** items (restriction code `R`). **Forbidden** (`F`) items cannot be licensed —
  they are illegal to own regardless. Enforced by `isLicenseQuickBuyEligible`.
- `ItemType.sin` and `ItemType.license` already exist; no new item types were needed.
- The relationship is expressed with a flat reference field (`ItemData.licenseId`) rather than the Attachment
  pattern, since an item covered by a Licence isn't physically mounted on it the way an accessory is on a weapon.

## Domain Notes

- **SIN** — matrix identity; Licences belong to a SIN via `parentId`
- **Licence** — covers zero or more gear items via each item's `licenseId`; a manually-created Licence has no covered
  items unless linked via the item's edit form or the licence's own item picker
- **Availability** — rating + restriction code; `R` triggers the licence requirement
- **Attachment** — parent/child Item relationship via `attachmentIds` / `attachedToId`, used here for Licence → SIN
  only, not for Licence → covered item

## Out of Scope

- Forbidden items — no licence path exists for `F`-rated gear
- Legal consequences of unlicensed gear — managed by the GM outside the app
- Automatic SIN expiry or SIN burning mechanics
- A Viewer warning for Restricted/Forbidden gear with no matching Licence on any SIN

## Related Features

- [`docs/features/0008-entity-status-sheets.md`](./0008-entity-status-sheets.md) — SIN/Licence display on a StatusSheet
  is out of scope until StatusSheets exist
