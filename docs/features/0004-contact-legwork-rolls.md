# Contact Legwork Rolls & Gear Search

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

Contacts are currently stored on `RunnerData` with Connection and Loyalty ratings, serving as a
reference-only record. The planned upgrade allows Players to roll checks through a Contact to
locate gear or gather information — both for a **Nuyen** fee.

Two actions are planned:
- **Find gear** — roll using the Contact's Connection rating to source an Item with a given
  Availability, modified by Loyalty
- **Gather information** — roll a legwork check for intel on a target, location, or organisation

## Open Questions

- [ ] Which attribute/skill drives the Contact roll — the Contact's Connection alone, or combined
      with a Runner skill (e.g. Etiquette + Charisma)?
- [ ] Is the fee a fixed cost, a roll-dependent cost, or player-negotiated?
- [ ] Does a failed roll still cost Nuyen, or only on success?
- [ ] Should gear found via a Contact be added directly to `RunnerData.gear`, or surfaced as a
      pending acquisition the Player confirms?
- [ ] Where does this UI live — on the Contact card in the Viewer, or in a dedicated gear search
      flow?

## Constraints

- Both actions cost Nuyen; the fee must be deducted from `RunnerData.nuyen.current`.
- Connection and Loyalty ratings are already stored on `ContactData`; no new fields are needed
  unless the roll formula requires additional data.
- Gear found via a Contact is subject to the same Availability and restriction rules as
  gear acquired any other way.

## Domain Notes

- **Contact** — NPC with Connection and Loyalty ratings; currently reference data only
- **Connection** — how useful and well-networked a Contact is
- **Loyalty** — how much the Contact likes the Runner
- **Nuyen (¥)** — the in-world currency; fee is paid from `RunnerData.nuyen.current`
- **Availability** — rating + restriction code; determines how hard a Contact can source an item

## Out of Scope

- Contacts performing actions that don't involve dice rolls (e.g. pure roleplay information)
- Automated legwork — the Player decides when to call a Contact; the app facilitates the roll
- Contact reputation decay or relationship management over time

## Related Features

_None at this time._
