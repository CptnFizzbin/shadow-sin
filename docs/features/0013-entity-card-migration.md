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
- [x] **Ammo gets its own custom, dedicated element** (Weapon-specific — not a generalization of
  `DamageTrack` into a shared current/max "Counter"/"Meter" primitive, which was considered and
  rejected). The rest — `recoil`, `attachmentPoints`, `reach`, `meleeType`, `dmgType`, `attribute`
  (Weapon); `deviceOS`, `dataProcessing`, `programSlots` (Device); `vehicleCategory`, `model`,
  `pilot`, `sensor`, `seats` (Vehicle) — are plain scalars that just need wiring to the existing
  generic `Stat`, no new element required.
- [x] **Migration order: type-by-type**, not big-bang. Scope here exceeds either prior
  precedent (spans Item's 9 subtypes plus Spirit conversion, Sprite/Spell/Power new builds);
  Sprite is already blocked on the `SpriteData.damage` migration from `0008` landing first,
  forcing some staging regardless; and validating the new flat-elements/`EntityCard` foundation
  on simple types before the ones needing brand-new elements (Weapon's `Ammo`) mirrors what
  worked in ADR-0008's own rollout (start with License/SIN/Credstick, tackle complex types last).
- [x] **A `DicePool` element wraps the existing `src/components/system/dicePool/dicePool.tsx`
  component, passing its props straight through** — no new dice-pool logic, no reimplementing
  pool math. That component is already mature and reused across Weapon attacks, Spell
  casting/drain resistance, and Spirit summoning today, just outside any card. Each typed card
  that has a linked test computes its own `groups` via the existing hooks (`useDiceGroup`,
  `skillDicePools.ts`, etc.) and hands them to the element. Which typed cards actually assemble
  it isn't a fixed list — decided per type during migration, based on whether that type has a
  linked test (Weapon's attack pool, Spell's casting/drain pools are the known examples so far).

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

Builds on **Entity**, **EntityCard**, **Rating** (all in `CONTEXT.md`) and ADR-0010.
`EntityData` — the concrete interface underlying Entity — is implementation detail scoped to
this doc and ADR-0010 rather than the glossary; see the Rough Interface Sketches below for its
shape. New terms introduced by this doc, not yet in `CONTEXT.md` pending resolution above:

- **SubType** — a secondary type label distinct from an Entity's main Type badge, currently
  reinvented per-type (Device, Vehicle, Implant, Credstick each derive their own "subtype"
  string). Worth formalizing as a shared element (defined once in the flat elements folder,
  assembled into `ItemCard` since only Item categories currently need it) rather than per-type
  plumbing, once this migration starts.

## Rough Interface Sketches

`EntityData`, the concrete interface underlying **Entity** — the fields shared by every current
category (`ItemData`, `QualityData`, `SpellData`, `AdeptPowerData`). Each category-level type
extends it with its own additional fields (e.g. `ItemData` adds
`cost`/`quantity`/`availability`/`equipped`/`stashed`; `SpellData` adds
`drain`/`duration`/`category`/`range`). `PowerData` (`src/system/powers/powerData.ts`) already
implements close to this exact shape today, scoped to the power family only. Spirit/Sprite are
Entities conceptually but don't implement this interface — their shape is different enough
(no `source` field on `SpiritData` at all) that forcing them onto it isn't worth it.

```ts
interface EntityData {
  id: string
  name: string
  description?: string
  source?: SourceData
  effects?: GameEffectData[]
  rating?: Rating
}
```

`Rating`, the shared type behind `EntityData.rating` — parameterized so each consumer only
accepts the sentinel meaningful to it, rather than one global string union every Rating field
would nominally accept:

```ts
type Rating<TSentinel extends string = never> = number | TSentinel

// EntityData.rating?: Rating -- defaults to plain number
// SinData / LicenseData (Real SIN/Licence case): rating: Rating<"real">
// LanguageSkillData (not an Entity -- Skill isn't in scope, reuses the type anyway): rating: Rating<"native">
```

Planned location: `src/system/rating.ts`, kept neutral rather than living in `entityData.ts`,
since non-Entity consumers (Language skill) use it too. `ItemData.rating`'s current
`number | string` (used by Armor) was never a real Armor need — just `ItemData`'s loose base
type leaking into `ArmorDataSchema` through inheritance; `ArmorData` doesn't even declare its
own `rating` (its real stats are `ballistic`/`impact`). Tighten to plain `Rating` (i.e. `number`)
once this migration reaches Armor.

Element inventory by which compound card object assembles which elements — not where each
element is defined (all in one flat folder per ADR-0010, each named with a `CardElement` prefix
— e.g. `CardElementTitle`, `CardElementDamageTrack` — per the naming convention decided there),
and not data types. Dot-notation names below (`.Title`, `.DamageTrack`) are what each tier's
compound object exposes at call sites; no implementation code.

```
EntityCard: { .Header, .Body, .Footer, .Title, .Rating, .Source, .Effects, .Stat, .Action }
  (backed by CardElementHeader, CardElementBody, CardElementFooter, CardElementTitle,
   CardElementRating, CardElementSource, CardElementEffects, CardElementStat, CardElementAction)

ItemCard (assembles EntityCard's elements plus):
  { .Availability, .Cost, .Quantity, .DamageTrack, .Subitem, .SubType,
    .StatusIcon<Equipped | Stashed | Fixed | Wireless> }
  (backed by CardElementAvailability, CardElementCost, CardElementQuantity,
   CardElementDamageTrack, CardElementSubitem, CardElementSubType, CardElementStatusIcon)
  WeaponCard additionally assembles: .Ammo (CardElementAmmo — custom, dedicated, not a
    DamageTrack variant), .DicePool (CardElementDicePool — attack pool)

SpiritCard (assembles EntityCard's elements plus; SpriteCard shares this shape):
  { .SkillList, .PowerList, .AttributeBlock, .DamageTrack (CardElementDamageTrack, shared with
    ItemCard, see above), .Notes }
  (backed by CardElementSkillList, CardElementPowerList, CardElementAttributeBlock,
   CardElementNotes)

SpellCard (assembles EntityCard's elements plus):
  { rendered via CardElementStat: Category, Range, Duration, Drain, DamageType;
    a Sustained status icon; .DicePool (CardElementDicePool, casting pool + drain resistance
    pool — shared with WeaponCard, see above) }

PowerCard (assembles EntityCard's elements plus):
  { rendered via CardElementStat: Rating, CostPerRating }
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
