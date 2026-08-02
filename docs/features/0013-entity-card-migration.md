# EntityCard System Migration

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> - Depends on [`docs/adr/0010-entity-card-composition.md`](../adr/0010-entity-card-composition.md)
>   (architecture decision) and supersedes the card portion of
>   [`docs/adr/0008-item-card-redesign.md`](../adr/0008-item-card-redesign.md)

Every existing typed card (`WeaponDataCard`, `ArmorDataCard`, `DeviceDataCard`, `ProgramDataCard`,
`ImplantDataCard`, `VehicleDataCard`, `LicenseDataCard`, `SinDataCard`, `CredstickDataCard`,
`SpiritDataCard`) converts to the tiered `EntityCard`/`ItemCard`/`SpiritCard` system from ADR-0010.
New elements get built for fields that have no rendering anywhere today. Sprite gets a card for
the first time (none exists currently). Spell and Adept Power cards are new work, not migrations.

## Open Questions

- [x] **`SpriteData` has no `damage` field.** Not a fresh gap — already tracked as an open
  question in [`docs/features/0008-entity-status-sheets.md`](./0008-entity-status-sheets.md)
  ("where does damage live?"), now resolved there: both `SpriteData` and `SpiritData` get a
  persisted damage container directly on the record (matching `SpiritData`'s existing shape),
  not Session State. Decision only — no migration written yet, no code changes made.
- [x] Spirit/Sprite's condition monitor reuses `DamageTrack` outright — same pattern as
  `VehicleCard`: a locally-computed max (from Force, not stored) passed into `DamageTrack`,
  rendered twice for Spirit (Physical, Stun) and once for Sprite (Matrix only, per `CONTEXT.md`'s
  Matrix Damage Track entry). No distinct `ConditionMonitor` element.
- [x] **Elements live in one flat folder, not owned per-tier** — resolved in ADR-0010. The
  `DamageTrack` case above is exactly why: it's needed by `ItemCard` (Vehicle) and `SpiritCard`
  (Spirit, Sprite) — sibling tiers under `EntityCard`, not one extending the other — so no single
  tier can "own" it. Elements aren't strictly hierarchical.
- [ ] Is a dedicated **Ammo** element (size/remaining/type, counter-like) worth building now, or
  does Weapon's `ammo` field stay unrendered for this pass? Same question for `recoil`,
  `attachmentPoints`, `reach`, `meleeType`, `dmgType`, `attribute` (Weapon); `deviceOS`,
  `dataProcessing`, `programSlots` (Device); `vehicleCategory`, `model`, `pilot`, `sensor`,
  `seats` (Vehicle) — all currently unrendered anywhere, card or Details. Assumed in scope per
  "everything will need ... new elements created to support missing items," but the actual
  element shape (plain `Stat` vs. something bespoke) isn't decided per field yet.
- [ ] Migration order — does this land type-by-type (mirroring ADR-0008's original staged
  rollout) or big-bang (mirroring ADR-0009's Details rollout)? Not decided.

## Constraints

- Must follow the tiered structure decided in ADR-0010: `EntityCard` (universal) →
  `ItemCard`/`SpiritCard`/`SpellCard`/`PowerCard` (category) → concrete typed card. No new slot
  mechanism, no reverting to `DataCardSlot`'s child-scanning approach.
- `AnyItemCard` (renamed from `ItemDataCard`) remains the only module allowed to import every
  typed card — see ADR-0010 for why sharing that dependency with `ItemCard` creates a cycle.
- **Program's, License's, and SIN's own `rating` must actually render on themselves** once
  migrated — today all three only show a *nested* rating (Program inside a Device's `Subitem`,
  License inside a SIN's `Subitem`), never their own. This is a real display gap the migration
  should close, not carry forward.
- Cost and Stat elements must support a raw-vs-effective override (Implant already needs this —
  `effectiveNuyen`/`effectiveEssence` — so the element API should account for it structurally
  instead of each type pre-computing and silently overwriting the field before display).
- `Stat`'s existing `type` prop (`"damage"`, `"rating"`, `"modifier"`, etc.) driving visual
  treatment carries forward unchanged onto `EntityCard.Stat`.

## Domain Notes

Builds on **Entity**, **EntityData**, **EntityCard**, **Rating** (all in `CONTEXT.md`) and
ADR-0010. New terms introduced by this doc, not yet in `CONTEXT.md` pending resolution above:

- **SubType** — a secondary type label distinct from an Entity's main Type badge, currently
  reinvented per-type (Device, Vehicle, Implant, Credstick each derive their own "subtype"
  string). Worth formalizing as a shared element (defined once in the flat elements folder,
  assembled into `ItemCard` since only Item categories currently need it) rather than per-type
  plumbing, once this migration starts.

## Rough Interface Sketches

_Element inventory by which compound card object assembles which elements — not where each
element is defined (all in one flat folder per ADR-0010), and not data types. No implementation
code._

```
EntityCard: { Header, Body, Footer, Title, Rating, Source, Effects, Stat, Action }

ItemCard (assembles EntityCard's elements plus):
  { Availability, Cost, Quantity, DamageTrack, Subitem, SubType,
    StatusIcon<Equipped | Stashed | Fixed | Wireless> }

SpiritCard (assembles EntityCard's elements plus; SpriteCard shares this shape):
  { SkillList, PowerList, AttributeBlock, DamageTrack (shared with ItemCard, see above), Notes }

SpellCard (assembles EntityCard's elements plus):
  { rendered via generic Stat: Category, Range, Duration, Drain, DamageType;
    a Sustained status icon }

PowerCard (assembles EntityCard's elements plus):
  { rendered via generic Stat: Rating, CostPerRating }
```

## Out of Scope

- `EntityDetailsRoot` / the Details-page tier — explicitly deferred in ADR-0010 to its own future
  ADR, including whether Card and Details ever combine into one shared system.
- Adding the ammo/recoil/etc. fields to Details if they end up excluded from the Card — that's a
  separate Details-scoped decision once `EntityDetailsRoot` exists.
- Any new game-mechanical behavior — this is purely a rendering-layer migration; no field listed
  here changes what it means mechanically, only whether and how it's displayed.

## Related Features

- [`docs/adr/0010-entity-card-composition.md`](../adr/0010-entity-card-composition.md) — the
  architecture decision this migration implements.
- [`docs/adr/0008-item-card-redesign.md`](../adr/0008-item-card-redesign.md),
  [`docs/adr/0009-item-details-page.md`](../adr/0009-item-details-page.md) — prior card/details
  architecture this supersedes (card) or leaves untouched for now (details).
- [`docs/features/0008-entity-status-sheets.md`](./0008-entity-status-sheets.md) — owns the
  Spirit/Sprite persisted-damage-container decision this doc depends on for `ConditionMonitor`.
- [`docs/features/0012-item-stashing.md`](./0012-item-stashing.md) — introduces
  `ItemData._state.equipped`/`.stashed`, which the `StatusIcon` element must read via
  `isEquipped`/`isStashed` once that migration lands.
