# Contact Legwork Rolls & Gear Search

## Status

Open — Contacts are currently reference data only. Mechanical integration is planned.

## Background

Contacts are stored on `RunnerData` with Connection and Loyalty ratings. They currently serve as a record-keeping tool.
No rolls are made through them in the app today.

## Planned Feature

Allow a player to use a Contact to:

- **Find gear** — roll a test using the contact's Connection rating to source an item with a given Availability,
  modified by Loyalty
- **Gather information** — roll a legwork check for intel on a target, location, or organisation
- Both actions cost **Nuyen** (fee paid to the contact)

## Design Questions

1. Which attribute/skill drives the contact roll — the contact's Connection alone, or combined with a Runner skill (e.g.
   Etiquette + Charisma)?
2. Is the fee a fixed cost, a roll-dependent cost, or player-negotiated?
3. Does a failed roll still cost Nuyen, or only on success?
4. Should gear found via a contact be added directly to `RunnerData.gear`, or surfaced as a pending acquisition the
   player confirms?
5. Where does this UI live — on the Contact card in the Viewer, or in a gear search flow?

## Related

- `src/system/contactData.ts` — `ContactData` type
- `CONTEXT.md` — Contact term definition
