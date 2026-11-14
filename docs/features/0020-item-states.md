# Item States

> **Status:** In Progress
>
> **GitHub Issues / PRs:**
> <!-- Added after running /to-prd. -->
> - See [`docs/adr/0021-item-state-single-field.md`](../adr/0021-item-state-single-field.md) — replaces the
>   `equipped`/`stashed` booleans with one `state` field, superseding
>   [ADR 0006](../adr/0006-item-state-scope.md)

Every Item is in exactly one **Item State** at a time: Equipped, Implanted, Available, or Stashed. The Item's type
decides which of those it can be in. A Player changes it with a toggle in the item edit dialog, or with one named
action in the Item's action menu: Equip, Unequip, Implant, Extract, Stash, or Unstash.

Today an Item has two independent booleans, `equipped` and `stashed`. A reducer invariant keeps them consistent, and
the Player opts each Item in to "Equippable" and "Stashable". That model has no Implanted state: implants were saved
unequipped with no way to equip them, which switched off their Game Effects until a migration forced them all to
`equipped: true`. It also lets a medkit or a SIN be marked Equipped while saying nothing about what that means. This
feature makes the type, not the individual Item, decide which states make sense, and gives each state its own name.

## Resolved Questions

### Which states each type has

The type decides, so there is no per-Item opt-in:

| ItemType | States (as labelled on screen) |
|---|---|
| weapon, firearm, armor, device, other | Equipped / Available / Stashed |
| implant | Implanted / Available / Stashed |
| program (including Agents), software | Loaded / Stashed |
| vehicle, credstick, sin, license, firearmAccessory | Available / Stashed |

- **Loaded is the on-screen label for Available** on programs and software, not a separate state. Programs and
  Agents are always Matrix things, so a Program the Runner has on hand is the Program **Loaded** on its Matrix Entity
  (see Domain Notes). A Stashed Program is on a chip at the safehouse.
- **Equipped and Implanted are the active states.** Available and Stashed are not active.

### Game Effects

- An Item's Game Effects apply **only while it is in an active state** (Equipped or Implanted).
- Types with no active state (program, software, vehicle, credstick, sin, license, firearmAccessory) **never
  contribute Runner-level Game Effects**, whatever their state. Today, effects on an Item with no `equipped` field
  always apply. That stops, and those types hide the item dialog's "Has effects" option so a Player can't add
  effects that never apply.

### Transitions

| Action | From | To |
|---|---|---|
| Equip | any (where the type has Equipped) | Equipped |
| Implant | any (implants only) | Implanted |
| Unequip | Equipped | Available |
| Extract | Implanted | Available |
| Stash | any | Stashed |
| Unstash | Stashed | Available |

- **Unstash always lands on Available.** It doesn't restore whatever the Item was before it was stashed; to put it
  back on, the Player Equips or Implants it again. This drops the "remember and restore Equipped" behaviour from
  [feature 0012](./0012-item-stashing.md).
- Every change goes through one state-setting write that enforces the type's allowed states and the cascade rules
  below, so a form write and a menu action can't disagree.

### Attachments

- **Stash and Unstash cascade to every Attachment, to any depth**, as Stash already does today. Unstash takes the
  whole tree to Available.
- **Equip, Implant, Unequip, and Extract cascade only to Attachments whose type has that same active state.**
  Implanting a cyberarm implants its implant-type Attachments. Equipping armor equips an "other" mod on it. A
  firearmAccessory has no active state, so it is left alone.
- **An Attachment is never more active than its parent.** It can't be Equipped or Implanted while its parent isn't,
  and it can't be Unstashed while its parent is Stashed. It can be deactivated on its own while its parent stays
  active, for example by Unequipping one mod on worn armor or Stashing just the scope.

### Action menu

The state actions are one shared set, shown on **every** Item card's action menu and on the Item details page.
Only actions valid for the Item's type and current state appear:

| Current state | Actions |
|---|---|
| Available | Equip *or* Implant (if the type has one), Stash |
| Equipped | Unequip, Stash |
| Implanted | Extract, Stash |
| Stashed | Unstash |

- Stashed → Equip or Implant is a valid transition, but it isn't offered in the menu. The Player Unstashes first,
  which keeps the menu short. The edit-dialog toggle can still go straight from Stashed to Equipped.
- The weapon and armor cards' own Equip/Unequip entries are removed in favour of the shared set.

### Edit dialog

- The Carry Status toggle is **always shown**, with one button per state in the type's set (two or three), labelled
  as in the type table. The middle button "Carried" becomes "Available" ("Loaded" for programs and software).
- For an Attachment, buttons the cascade rules forbid (for example Equipped while the parent isn't active) are
  disabled, with a tooltip saying why.
- The per-Item **"Equippable" and "Stashable" checkboxes are removed** from the item options, along with the
  per-type forcing of those options in the weapon, armor, and implant form dialogs.

### Display

- **Equipped:** keeps its current status icon and details-page chip.
- **Implanted:** gets a new status icon and chip.
- **Stashed:** unchanged. It keeps its icon, is greyed out, and is listed last.
- **Available / Loaded:** no status shown. It's the resting state, so a chip would be noise on most gear.

### Migration

Each stored Item gets a `state`, in this order:

1. `stashed: true` → **Stashed**
2. `equipped: true` → the type's active state (Equipped or Implanted), or **Available** if the type has none
3. anything else, including an absent `equipped` → **Available**

`equipped`, `stashed`, and `_state` are then removed. Because of rule 3, Items whose Game Effects relied on "no
`equipped` field means always on" switch those effects off until the Player Equips them. This includes every
program and vehicle, since their types have no active state. Implants were already all marked `equipped: true` by an
earlier migration, so they become Implanted. The PR that ships the migration must say all this.

## Open Questions

- [ ] What does "Loaded" mean for an Available Program that isn't an Attachment of any Matrix Entity, for example
  one added straight to the gear list? Either such a Program shows "Loaded" anyway, or choosing Loaded asks which
  Matrix Entity to load it on. This depends on how [feature 0018](./0018-matrix-entities.md) places Programs.

## Constraints

- Needs a Runner schema migration (see `src/data/AGENTS.md`).
- Every reader of `item.equipped`/`item.stashed` (encumbrance, armor totals, Game Effects, damage, attack weapon
  selection, License Check, cards, details) moves to the new field or a helper built on it. There are about 40 call
  sites.
- Weapons and armor still need to be told apart from other Equipped Items where a feature only cares about worn armor
  or wielded weapons (armor totals, encumbrance, the attack workflow). Those read sites keep filtering by type as well
  as by state.

## Domain Notes

New or changed `CONTEXT.md` terms (now in `CONTEXT.md`):

- **Item State** (new): the one state an Item is in: Equipped, Implanted, Available, or Stashed. Its type decides
  which are allowed.
- **Implanted** (new): an implant installed in the Runner's body. Active, like Equipped.
- **Available** (changed): now *only* the resting state, on hand but neither Equipped nor Implanted. It previously
  meant "not Stashed".
- **On Hand** (new): not Stashed, meaning Available, Equipped, or Implanted. This is what Available used to mean;
  License Check's "what the Runner is carrying" reads On Hand.
- **Loaded** (Program, extended): also the on-screen label for a Program's or Software's Available state. A Program
  on hand is Loaded on its Matrix Entity; a Stashed Program is Loaded nowhere.
- **Equipped** / **Stashed**: unchanged in meaning. Drop the note that un-stashing restores the previous state.

## Rough Interface Sketches

_High-level shapes only — no implementation code._

```ts
type ItemState = "equipped" | "implanted" | "available" | "stashed"

interface ItemData {
  // ...existing fields; `equipped`, `stashed`, `_state` removed
  state?: ItemState // absent means Available
}

// One table, keyed by ItemType, read by the reducer, the toggle, and the action menu
type ItemStateSets = Record<ItemType, readonly ItemState[]>
```

## Out of Scope

- Bulk multi-select actions ([#392](https://github.com/CptnFizzbin/shadow-sin/issues/392)). They would reuse the same
  state-setting write later.
- Running and Terminating Programs, and which Matrix Entity a Program is Loaded on. Those belong to
  [feature 0018](./0018-matrix-entities.md).
- Any surgery, Essence, or availability rules around Implanting or Extracting. Changing state is bookkeeping only.

## Related Features

- [`docs/features/0012-item-stashing.md`](./0012-item-stashing.md): introduced Stash, the per-Item Equippable opt-in,
  and the restore-on-Unstash behaviour that this feature replaces.
- [`docs/adr/0006-item-state-scope.md`](../adr/0006-item-state-scope.md): superseded by
  [ADR 0021](../adr/0021-item-state-single-field.md).
- [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md): reads On Hand (was `!stashed`).
- [`docs/features/0018-matrix-entities.md`](./0018-matrix-entities.md): owns the Matrix meaning of Loaded.
