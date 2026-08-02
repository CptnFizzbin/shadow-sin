# Entity & Vehicle StatusSheets

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

Four categories of Runner-controlled things each have their own stat blocks, damage tracks, and
in-session state that need tracking independently of the Runner's main sheet. None currently have
Viewer-side StatusSheets.

| Thing | Type | Key Stats |
|---|---|---|
| **Spirit** | Entity | Force, Services owed, Physical damage track |
| **Sprite** | Entity | Level, Services owed, Matrix damage track |
| **Vehicle** | Item (`ItemType.vehicle`) | Pilot, Sensor, Armor, Body, Physical damage track |
| **Drone** | Vehicle (conceptual subtype) | Same as Vehicle |
| **Commlink / matrix device** | Item | Device Rating, Matrix damage track |

Currently Spirits and Sprites are stored on `RunnerData` as flat data records. Vehicles and
matrix devices are stored as Items in `RunnerData.gear`. `ItemData` has no damage field today.

## Open Questions

- [ ] **Shared abstraction?** Should Entities and Vehicles share a common "thing with a
      StatusSheet" interface, or are they modelled independently?
- [x] **Where does damage live?** Persisted directly on the data record, not Session State —
      matching `SpiritData.damage` precedent (not cleared on tab close, behaves like any other
      persisted stat). **Sprite needs the same treatment: `SpriteData` gets a persisted damage
      container matching `SpiritData`'s shape.** Decided as part of
      [`docs/features/0013-entity-card-migration.md`](./0013-entity-card-migration.md); not yet
      implemented — requires a migration, no code changes made yet.
- [ ] **Spirit services** — is "services owed" a simple integer counter, or does each service
      need a description (e.g. "Guard the safehouse")?
- [ ] **Drone distinction** — how does a Player indicate a Vehicle Item is a Drone? Tag, name
      convention, or a flag on `ItemData`?
- [ ] **UI placement** — are StatusSheets inline on the Runner sheet, in a drawer, or a separate
      route?

## Constraints

- Adding a damage field to `ItemData` (for Vehicles and matrix devices) requires a Migration.
- Spirits and Sprites already have data types (`SpiritData`, `SpriteData`); StatusSheet UI must
  be additive, not a type refactor.
- Drone has no mechanical distinction from a Vehicle in the data model — same `ItemType.vehicle`
  is used; any Drone distinction must be optional/cosmetic.

## Domain Notes

- **Entity** — collective term for Spirits and Sprites; summoned/compiled beings with their own
  stat block
- **Spirit** — magical Entity with Force and Services owed; Physical damage track
- **Sprite** — matrix Entity with Level and Services owed; Matrix damage track
- **Vehicle** — Item with its own stat block; Physical damage track
- **Drone** — conceptual Vehicle subtype; no mechanical distinction in the data model
- **StatusSheet** — the Viewer-side tracking view for an Entity or Vehicle
- **Session State** — combat-round data on `RunnerData`; persisted across page reloads

## Out of Scope

- Full Vehicle combat rules (ramming, chases, mounted weapons)
- Critter / NPC stat blocks — these are GM-facing; out of scope until the GM Game feature exists
- Commlink StatusSheet (tracked in `docs/features/0005-matrix-programs.md`)

## Related Features

- [`docs/features/0006-game-effect-resolution-model.md`](./0006-game-effect-resolution-model.md)
  — Vehicle/Drone GameEffect resolution
- [`docs/features/0009-session-api-transient-state.md`](./0009-session-api-transient-state.md)
  — if Entity/Vehicle damage is Session State, this feature defines where it lives
