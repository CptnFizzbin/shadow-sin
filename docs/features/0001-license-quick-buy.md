# Licence Quick-Buy & SIN Association

> **Status:** Implemented
>
> **GitHub Issues / PRs:**
> <!-- Add links once available. -->

In Shadowrun 4e, carrying a **Restricted** item legally requires a **Licence** registered to a **SIN**. Runners
typically carry multiple fake SINs, each with different sets of licences for different cover identities. Previously a
Player could only add a Licence as a freeform Item manually — there was no quick path to generate licences from
existing restricted gear, and no association between a Licence and the SIN it belongs to.

The feature adds:

- A **Buy License** quick-buy trigger on any Restricted, unlicensed gear item, in both Builder and Viewer
- A dialog to pick (or create) the SIN the Licence belongs to. The Licence's reality always matches its SIN's — the
  Real SIN produces a free, unrestricted Real Licence; a Fake SIN produces a Fake Licence with an adjustable rating
  (defaulting to 3) — and buy it: Acquire (free) or Purchase (withdraws Nuyen) in the Viewer; a single Add in the
  Builder (its cost simply counts toward the Gear BP budget like any other item)
- An option to extend the same Licence to other unlicensed items sharing the same name and `ItemType`, since a real
  Licence generally certifies a gear type rather than a single serial number (e.g. one Licence covers three Ares
  Predators)

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
  (`DefaultFakeLicenseRating`) — both in the manual "Add License" form and the quick-buy dialog — and the Player can
  adjust it; a Real Licence has no rating and is always free.
- **Licence reality vs. SIN reality**: not independent — a Fake SIN can only carry Fake Licences, and only the Real
  SIN can carry a Real Licence. The quick-buy dialog derives `isReal` from the selected SIN's `rating` rather than
  offering it as a separate choice.

## Constraints

- Licences only apply to **Restricted** items (restriction code `R`). **Forbidden** (`F`) items cannot be licensed —
  they are illegal to own regardless. Enforced by `isLicenseQuickBuyEligible`.
- `ItemType.sin` and `ItemType.license` already exist; no new item types were needed.
- The relationship is expressed with a flat reference field (`ItemData.licenseId`) rather than the Attachment
  pattern, since an item covered by a Licence isn't physically mounted on it the way an accessory is on a weapon.

## Domain Notes

- **SIN** — matrix identity; Licences belong to a SIN via `parentId`
- **Licence** — covers zero or more gear items via each item's `licenseId`; a manually-created Licence has no covered
  items unless linked through quick-buy
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
