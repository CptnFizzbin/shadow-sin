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

- [ ] **`SpriteData` has no `damage` field**, but `CONTEXT.md`'s Matrix Damage Track entry states
  Sprites have "their primary damage track." Is `SpriteData` missing a field (needs a migration
  to add `damage{physical,stun}` or similar, mirroring `SpiritData`), or is that glossary line
  aspirational and Sprites don't actually track matrix damage yet? Blocks building
  `SpriteCard`'s condition-monitor element.
- [ ] Does `ConditionMonitor` (Spirit/Sprite) reuse `DamageTrack` outright (same
  current/max shape), or does it need its own element? Leaning reuse, not confirmed.
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
  string). Worth formalizing as a shared `ItemCard.SubType` element rather than per-type
  plumbing, once this migration starts.
- **ConditionMonitor** — the Spirit/Sprite-tier equivalent of `DamageTrack`, pending the open
  question above about whether it's a distinct element or a reuse of `DamageTrack` itself.

## Rough Interface Sketches

_Element inventory by tier — component shapes, not data types. No implementation code._

```
EntityCard: { Header, Body, Footer, Title, Rating, Source, Effects, Stat, Action }

ItemCard (extends EntityCard's elements):
  { Availability, Cost, Quantity, DamageTrack, Subitem, SubType,
    StatusIcon<Equipped | Stashed | Fixed | Wireless> }

SpiritCard (extends EntityCard's elements; SpriteCard shares this shape):
  { SkillList, PowerList, AttributeBlock, ConditionMonitor, Notes }

SpellCard (extends EntityCard's elements):
  { rendered via generic Stat: Category, Range, Duration, Drain, DamageType;
    a Sustained status icon }

PowerCard (extends EntityCard's elements):
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
- [`docs/features/0012-item-stashing.md`](./0012-item-stashing.md) — introduces
  `ItemData._state.equipped`/`.stashed`, which the `StatusIcon` element must read via
  `isEquipped`/`isStashed` once that migration lands.
