# Licence Quick-Buy & SIN Association

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

In Shadowrun 4e, carrying a **Restricted** item legally requires a **Licence** registered to a **SIN**. Runners
typically carry multiple fake SINs, each with different sets of licences for different cover identities. Currently a
Player can add a Licence as a freeform Item manually — there is no quick path to generate licences from existing
restricted gear, and no association between a Licence and the SIN it belongs to.

The planned feature adds:

- A **quick-buy button** on Restricted Items (and/or a bulk action) that creates a Licence Item for that gear
- A SIN selection prompt when the Runner has multiple SINs
- The created Licence references what it covers and which SIN it belongs to

## Open Questions

- [ ] Should a Licence be an **Attachment** on its SIN Item (SIN → Licence as parent → child), or stored flat with a
  `sinId` reference field?
- [ ] Should a Licence reference the specific Item it covers by ID, by name, or remain freeform text? (Real licences
  describe gear categories, not serial numbers.)
- [ ] Does the Viewer warn the Player when they have a Restricted/Forbidden item with no matching Licence on any active
  SIN?
- [ ] What happens to licences when a SIN is burned (destroyed)? Auto-invalidated, or managed manually by the Player?
- [ ] Is Licence cost calculated from the item's Availability rating, or is it a flat fee?

## Constraints

- Licences only apply to **Restricted** items (restriction code `R`). **Forbidden** (`F`) items cannot be licensed —
  they are illegal to own regardless.
- `ItemType.sin` and `ItemType.license` already exist; no new item types are needed.
- Any SIN-Licence data relationship must be expressible within the existing flat gear store using the Attachment pattern
  (`attachmentIds` / `attachedToId`) or a flat reference field.

## Domain Notes

- **SIN** — matrix identity; Licences logically belong to a SIN
- **Licence** — currently freeform; planned upgrade adds a mechanical link to gear and SIN
- **Availability** — rating + restriction code; `R` triggers the licence requirement
- **Attachment** — parent/child Item relationship via `attachmentIds` / `attachedToId`

## Out of Scope

- Forbidden items — no licence path exists for `F`-rated gear
- Legal consequences of unlicensed gear — managed by the GM outside the app
- Automatic SIN expiry or SIN burning mechanics

## Related Features

- [`docs/features/0008-entity-status-sheets.md`](./0008-entity-status-sheets.md) — SIN/Licence display on a StatusSheet
  is out of scope until StatusSheets exist
