# An Item's state is one field whose allowed values its type decides

**Status:** proposed

**Supersedes:** [ADR-0006](./0006-item-state-scope.md), along with the "Equip becomes universal, opt-in per Item"
part of [feature 0012](../features/0012-item-stashing.md).

An Item carried two independent booleans, `equipped` and `stashed`, and a per-Item "Equippable" opt-in. A reducer
invariant (`_state.equipOnUnstash`) kept the two booleans consistent. That model had no way to say Implanted, and it
let an implant be saved unequipped with its Game Effects silently off. We replace the booleans with one
`ItemData.state: "equipped" | "implanted" | "available" | "stashed"` field. A per-`ItemType` table fixes which values
each type allows. The type, not the Item, decides whether it can be Equipped or Implanted, and Game Effects apply only
in those two active states.

## Considered Options

- **Keep the booleans and relabel `equipped: true` as "Implanted"/"Loaded" per type.** Rejected. It's a smaller diff,
  but the stored data and the on-screen vocabulary would disagree, and the reducer would still have to keep two
  fields from contradicting each other.
- **Keep the per-Item Equippable opt-in.** Rejected. It's what let implants end up permanently unequipped, and it
  makes "can this be Equipped?" a fact about each Item rather than something the Player can predict from what the
  Item is.

## Consequences

- An Item can only ever be in one state, so ADR 0006's write-boundary invariant and `_state.equipOnUnstash` go away.
  Unstash lands on Available and no longer restores the previous state.
- Items of types without an active state (programs, vehicles, credsticks, …) no longer contribute Runner-level Game
  Effects. Previously an Item with no `equipped` field always applied them.
- Needs a migration: `stashed` → Stashed, `equipped: true` → the type's active state, everything else → Available.
  Effects on Items that were never explicitly Equipped switch off.
- "Available" narrows to the resting state only. The old meaning, "not Stashed", becomes **On Hand**.
