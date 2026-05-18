# Entity & Vehicle StatusSheets

## Status

Open — Entities (Spirits, Sprites) and Vehicles need their own in-play StatusSheets.

## Background

Four categories of things controlled by a Runner each have their own stat blocks, damage
tracks, and in-session state that need tracking independently of the Runner's main sheet.
**Entities** (Spirits and Sprites) are summoned/compiled beings. **Vehicles** cover all
vehicle-typed Items, including the conceptual subtype of **Drones** (no mechanical distinction
from a Vehicle — same `ItemType.vehicle`).

| Thing | Type | Key Stats |
|---|---|---|
| **Spirit** | Entity | Force, Services owed, Physical damage track |
| **Sprite** | Entity | Level, Services owed, Matrix damage track |
| **Vehicle** | Item (`ItemType.vehicle`) | Pilot, Sensor, Armor, Body, Physical damage track |
| **Drone** | Vehicle (conceptual subtype) | Same as Vehicle |
| **Matrix device** | Item (commlink, node, etc.) | Device Rating, Matrix damage track |

Currently, Spirits and Sprites are stored on `RunnerData` as flat data records. Vehicles and
matrix devices are stored as Items within `RunnerData.gear`. None have Viewer-side StatusSheets.
Matrix devices need a Matrix Damage Track; the current `ItemData` type has no damage field.

## Design Questions

1. **Shared abstraction?** Should Entities and Vehicles share a common "thing with a StatusSheet"
   interface, or is each modelled independently?
2. **Where does damage live?** On the data record in `RunnerData` (persisted), or in Session State?
3. **Spirit services** — is "services owed" a simple integer counter, or does each service need
   a description (e.g. "Guard the safehouse")?
4. **Drone distinction** — when creating a Vehicle Item, how does a Player indicate it's a Drone
   rather than a full-sized vehicle (tag, name convention, or a flag on `ItemData`)?
5. **UI placement** — are StatusSheets inline on the Runner sheet, in a drawer, or a separate route?

## Related

- `src/system/magic/spiritData.ts` — `SpiritData`
- `src/system/magic/spriteData.ts` — `SpriteData`
- `src/system/itemType.ts` — `ItemType.vehicle`
- `CONTEXT.md` — Entity, Vehicle, Drone, StatusSheet term definitions
- `docs/issues/game-effect-resolution-model.md` — Vehicle/Drone effects may feed into this
