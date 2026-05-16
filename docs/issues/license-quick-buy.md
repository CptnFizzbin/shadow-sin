# Licence Quick-Buy & SIN Association

## Status

Open — Licences are currently freeform Items with no mechanical link to the gear or SIN they
relate to.

## Background

In Shadowrun 4e, carrying a **Restricted** item legally requires a **Licence** registered to a
**SIN**. Runners often have multiple fake SINs, each carrying different sets of licences to
maintain cover identities.

Currently a Player can add a Licence as a freeform Item manually. There is no quick path to
generate licences from existing restricted gear, and no association between a Licence and the
SIN it belongs to.

## Planned Feature

- **Quick-buy button** on Restricted Items (and/or a bulk action) that creates a Licence Item
  for that piece of gear
- If the Runner has multiple SINs, prompt the Player to choose which SIN the Licence is
  registered under
- The created Licence Item should reference what it covers (item name / type / rating) and the
  associated SIN

## Design Questions

1. Should a Licence be an **Attachment** on its SIN Item (SIN → Licence as parent → child), or
   stored flat with a `sinId` reference field?
2. Should a Licence reference the specific Item it covers by ID, by name, or is it still
   freeform text (more realistic — real licences describe gear categories, not serial numbers)?
3. Does the Viewer warn the Player when they have a Restricted/Forbidden item with no matching
   Licence on any active SIN?
4. What happens to licences when a SIN is burned (destroyed)? Are they auto-invalidated, or
   does the Player manage that manually?
5. Is Licence cost calculated from the item's Availability rating, or is it a flat fee?

## Related

- `src/system/itemType.ts` — `ItemType.sin`, `ItemType.license`
- `src/system/availabilityInfo.ts` — `AvailabilityInfo` type
- `src/components/gear/availabilityChip.tsx` — `AvailabilityChip` (Restricted/Forbidden badges)
- `CONTEXT.md` — SIN, Licence, Availability term definitions
