# Gear UX Overhaul

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Added after running /to-prd. -->
> - [#390 — Unified per-item action menu; Equip becomes universal](https://github.com/CptnFizzbin/shadow-sin/issues/390)
>   — folded into this feature's action dialog
> - [#392 — Multi-select bulk actions](https://github.com/CptnFizzbin/shadow-sin/issues/392)
> - [#664 — Hide empty gear sections and expand all sections by default](https://github.com/CptnFizzbin/shadow-sin/pull/664)
>   — shipped
> - [#666 — Show every Item's Matrix presence on its details page](https://github.com/CptnFizzbin/shadow-sin/pull/666)
>   — shipped

An overhaul of how Players see and act on their Items, during play first and during building
second. The Gear page is the Runner's complete inventory; the other runner tabs (Offense, Defense,
Vehicles, Drones, Licenses, Matrix) are prefiltered views of the Items the Runner has on hand.
Every Item gets one consistent set of actions wherever its card appears, Items nest to any depth,
and every Item is a Matrix node unless the Player turns that off.

Problems this addresses, as of the current Gear page:

- **Weapons and armor miss the other tabs.** Offense and Defense list only Equipped weapons and
  armor, so a holstered spare pistol never appears where the Player attacks from.
- **Actions are scattered.** Edit, Remove, Equip, and Stash live in different places on the card,
  the details page, and the per-type form dialogs.
- **The details page shows less than the card.** For example, a firearm's card shows AP, firing
  mode, RC, and ammo, but its details page shows only DV and Skill.
- **Misc collects weapons.** Weapons entered as "other" Items land in Misc and never reach
  Offense or the attack workflow.
- **Space is wasted.** Card stats sit in inconsistent positions, and desktop renders one
  stretched column.

## Resolved Questions

- **Priority:** play time first, then building. Phases that change how the Player acts on Items
  mid-session come before the add/edit flows.
- **The Gear page is the complete inventory.** The other tabs are prefiltered views over the
  same Items, filtered to what is **Available**, not separate lists with their own card variants.
- **Three Item states**, matching `CONTEXT.md`:
  - **Stashed:** left at the safehouse.
  - **Available:** carried or nearby, Equipped or not.
  - **Equipped:** in use in combat; its stats and Modifiers apply.
- **One action dialog per Item.** Every Item card has a menu button that opens a dialog listing
  everything the Player can do with that Item: Stash/Unstash, Equip/Unequip, Attack, Run, Edit,
  Sell, Delete, and so on. The dialog lists every action that applies to the Item, wherever the
  card is shown.
- **Attack and Run are also quick actions.** On the Offense tab, a weapon card has an Attack
  button on its left side; on the Matrix tab, a Program card has a Run button there. Both actions
  still appear in the action dialog on every page.
- **Items nest to any depth.** Attachments can have Attachments of their own, and the UI must
  render and act on the whole tree, not just one level.
- **Attachments inherit their parent's state.** Stashing or equipping an Item applies to its
  whole Attachment tree.
- **Every Item is a Matrix node by default.** An Item that sets no Matrix attributes is a
  Rating 1 node. The Item's edit form has a flag that disables its Matrix presence entirely.
  Attachments share their parent's node, and an Item with wireless off or removed is offline
  rather than node-less (shipped in #666).
- **Sell** removes the Item and credits 50% of its cost to the Runner's Nuyen. Selling records no
  transaction history.
- **Selling Attachments:** the Sell action has a "Sell attachments" toggle, on by default. When it
  is on, the Item's whole Attachment tree is sold with it, each Attachment crediting 50% of its own
  cost. Fixed Attachments are always sold with their parent, whatever the toggle says. When the
  toggle is off, unfixed Attachments stay in the inventory as top-level Items, even when the sold
  Item was itself an Attachment.

## Open Questions

- [ ] **Sale price:** is 50% a fixed amount, or a default the Player can edit before confirming?
      Does Sell need a confirmation step, as Delete has?
- [ ] **Middle state label:** the carry-status picker shipped in #666 reads Equipped / **Carried**
      / Stashed. `CONTEXT.md`'s **Available** includes Equipped Items, so it can't label the
      middle option. Keep "Carried" as on-screen wording for "Available but not Equipped", or add
      it to `CONTEXT.md` as a term?
- [ ] **View ordering:** within a prefiltered view, do Equipped Items sort first?
- [ ] **Gear page filters:** should the Gear page open on Available Items, with Stashed ones one
      tap away? Should the active filter live in the URL, so a view's "See all in Gear" link lands
      on a matching filter?
- [ ] **Desktop layout:** a multi-column card grid on wide screens, or stay mobile-first and only
      avoid stretching?
- [ ] **Misc weapons:** should a Player be able to reclassify existing "other" Items that are
      really weapons, and should adding an Item ask for its type before anything else?
- [ ] **Nested Items in views:** when a view's filter matches an Attachment but not its parent
      (e.g. a Program on a Device on the Matrix tab), does the view show the Attachment on its
      own, or its parent with the matching branch expanded?
- [ ] **Bulk actions (#392):** which actions in the dialog also apply to a multi-selection?

## Constraints

- Stash and Equip interact through the gear reducer's existing bookkeeping (ADR-0006): stashing
  forces an Item unequipped and un-stashing restores its prior Equipped value.
- Items are stored flat with `parentId`/`childIds` links, so arbitrary nesting is a UI and
  selector concern, not a schema change.
- Dialogs are declared locally through `use*Dialog()` hooks (ADR-0004); the action dialog follows
  the same pattern rather than a global dialog registry.
- Card composition follows ADR-0010's tiered elements; the details page follows ADR-0009's
  compound slots.

## Domain Notes

- **Item**, **Attachment**, **Equipped**, **Stashed**, and **Available** are existing
  `CONTEXT.md` terms and are used here with those meanings.
- **Containers** (an Item holding other Items that keep their own state, e.g. a backpack) were
  discussed and deferred; no term is introduced for them.

## Proposed Phases

Each phase is meant to be an independently shippable slice.

1. **Action dialog and states.** The menu button and action dialog on every card, including
   Attack, Run, and Sell; Attachments following their parent's state.
2. **Play-time Gear page.** Available/Stashed filtering, page-level tools (Availability Test,
   License Check) moved into a toolbar.
3. **Prefiltered views.** Offense, Defense, Vehicles, Drones, Licenses, and Matrix render the
   shared cards over Available Items, with the Attack and Run quick actions.
4. **Nesting UI.** Render and act on Attachment trees of any depth on cards and the details page.
5. **Details page.** Show everything the card shows and more, with the actions in one place.
6. **Card density.** One consistent stat layout across Item types, plus a compact row variant for
   Items with few stats.
7. **Build-time flows.** Type-first Add Item, then the compound edit dialog ADR-0009 deferred.

## Out of Scope

- Containers, an Item whose contents keep their own state.
- A nuyen transaction history or ledger for Sell.
- Folding Known Nodes into the Item store (see `0018-matrix-entities.md`).

## Related Features

- [`docs/features/0012-item-stashing.md`](./0012-item-stashing.md) — defines Stashed and the
  per-item action menu (#390) and bulk actions (#392) this feature builds on
- [`docs/features/0018-matrix-entities.md`](./0018-matrix-entities.md) — the eventual home of an
  Item's Matrix presence, loaded Programs, and running Programs
- [`docs/adr/0006-item-state-scope.md`](../adr/0006-item-state-scope.md) — Stash/Equip bookkeeping
- [`docs/adr/0009-item-details-page.md`](../adr/0009-item-details-page.md) — the details page and
  the deferred compound edit dialog
- [`docs/adr/0010-entity-card-composition.md`](../adr/0010-entity-card-composition.md) — card
  composition
