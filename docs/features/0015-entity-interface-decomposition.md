# Entity Interface Decomposition

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Added after running /to-prd. -->

Decompose the flat `EntityData` interface into composable capability interfaces
(`EntityWithAttrs`, `EntityWithDamage`, `WithMatrixPresence`, `WithItems`) so that selectors
(`AttrSelector`, `DamageSelector`, ...) can be written once against a capability interface and
reused across Runner and every Entity kind, instead of each domain re-implementing its own
attribute/damage access. Closes the open "Shared abstraction?" question in
[`docs/features/0008-entity-status-sheets.md`](./0008-entity-status-sheets.md).

Also retires `EntityData.rating`'s string-sentinel pattern (`Rating<TSentinel>`): `rating` becomes
a plain `number`, and the three current sentinel users (`SinData`/`LicenseData`'s `"real"`,
`LanguageSkillData`'s `"native"`) each become a discriminated union with an explicit `isReal`/
`isNative` flag instead. This is a migration on **shipped** behavior, not a green-field type
change — see Constraints below.

## Open Questions

- [ ] **Exact `EntityKind` string values** — the full list is settled in shape (every Entity
      including Item gets `kind`, `itemType`/`spiritType`/etc. stay as second-level discriminants
      under it) but the literal string union isn't fully enumerated yet.
- [ ] **`attributes` fallback when `rating` is also absent** — assumed to resolve to `0`, matching
      `selectAttrBase`'s existing `?? 0` convention. Confirm.
- [ ] **Backfill vs. forward-only** — does `WithMatrixPresence`'s `matrix: true` default apply
      retroactively to existing persisted Entities via migration, or only to newly created ones?
- [ ] **Program "loaded"/"running" states** (raised in discussion, not designed here) — needs its
      own pass against `docs/features/0014-matrix-interactions.md`'s `ActiveProgram` model.
- [ ] **`accel`/`pilot`/`sensor` AttributeKey membership needs a real rulebook citation** before
      implementation — `pilot`/`sensor` are provisionally in (join `AttributeKey`), `accel` is
      provisionally out (stays a plain Vehicle field, same as `speed`), per discussion, but per
      AGENTS.md's citation policy this isn't implementation-ready until cited.

## Migration Plan

Six independently-shippable slices; `kind` is the only foundational one (everything else's
per-`kind` selector dispatch depends on it existing first). Numbers below start at `026` (next
available) but are illustrative — actual numbers depend on what else lands first.

| # | Slice | Migration(s) | PRD ticket(s) |
|---|-------|--------------|----------------|
| 1 | `kind` discriminant | **One** migration (`026_addEntityKind.ts`) covering every `RunnerData` subtree (`gear`, `spirits`, `sprites`, `gameState.matrix.knownNodes`, `qualities`, `spells`, `complexForms`, `adeptPowers`) plus `RunnerData` itself — one coherent concern, not split per-collection | One ticket |
| 2 | Vehicle → `attributes` | One migration moving `handling`/`armor`/`body`/`pilot`/`sensor` into `attributes` (`accel`/`speed` stay put) | One ticket, blocked on the `accel`/`pilot`/`sensor` citation above |
| 3 | `damage` universalization | **None** — existing `SpiritData`/`SpriteData`/`VehicleData` damage shapes already satisfy `Partial<Record<DamageTrackKey, number>>` structurally; this is a type-only change | — |
| 4 | `MatrixNodeData.matrix` rename + presence flag | One migration: copy `matrix`'s stats value to a new `attributes` field, replace `matrix` with the new boolean (default `true`) | One ticket |
| 5 | Attachment → nested `items` | One migration nesting `parentId`/`childIds` under `items` | One ticket |
| 6 | Rating sentinel → `isReal`/`isNative` | **Three** migrations, one each for `SinData`, `LicenseData`, `LanguageSkillData` (same transform shape, different record types — matches the `024_normalizeArmorRating.ts` precedent), each with its own `*.test.ts` | **One** ticket covering all three — same feature, ships together, despite the file-level split |

Slice 6 also needs a full pass over the ~20 call sites currently doing `rating === "real"` /
`rating === "native"` (dice-pool sizing, cost calculation, display, form fields — see
`docs/features/0011-license-check-dialog.md` and the language skill list/improvement components).

## Constraints

- `AttributeKey` remains the single, dice-pool-test-relevant enum. New members added for Vehicle
  stats must each have a real Attribute+Skill-style test use per SR4A rules — not added merely
  because a value exists on some Entity. Settled: `handling`, `armor`, `body`, `pilot`, `sensor`
  join `AttributeKey`; `accel` and `speed` stay as Vehicle's own plain fields (not independently
  tested) — `accel`/`pilot`/`sensor` still need a real rulebook citation before implementation,
  see Open Questions.
- No new codebase-wide Zod schema-composition pattern. Every existing schema (`ArmorDataSchema`,
  `MatrixNodeDataSchema`, ~12 others) hand-duplicates its full field list today, several not yet
  wired to a real validator ("kept for parity" per `ArmorDataSchema`'s own comment) — cleaning
  that up is a separate dead-code pass, not this feature's problem. The only place this feature
  introduces any reuse is inside each new discriminated-union schema (`SinDataSchema`,
  `LicenseDataSchema`, `LanguageSkillDataSchema`): a private, file-local base `z.object` that both
  union branches `.extend()`, so the ~15 shared `ItemData`/`EntityData` fields aren't duplicated
  twice in the same file. That base is never exported and doesn't touch any other schema.
- `WithItems` (Attachment) stays strictly Item-to-Item and single-parent. The
  `MatrixNode`-hosts-`Program` relationship is many-to-many (`docs/features/0014`'s
  `ActiveProgram`) and must never be forced through Attachment's single-`parentId` shape.
- Spirit's attributes stay derived (`calculateSpiritAttributes`), never materialized into stored
  data — matches the "derive, don't snapshot" precedent from
  [`docs/adr/0012-matrix-entity-model.md`](../adr/0012-matrix-entity-model.md) (Entity Matrix
  Presence avoids storing a value that could drift after Rating changes; the same reasoning
  applies to Spirit's `force`/`spiritType`-derived attributes).
- `CONTEXT.md` is canonical — the **Entity** glossary revision (folding in Runner as a formal
  Entity; replacing the inline kind-listing with a pointer at the `kind` discriminant) is part of
  this feature's scope, not incidental drift, and lands as an explicit edit before/alongside
  implementation.
- Every structural change here needs new, additive migrations — no editing existing migration
  files.
- `SinData`/`LicenseData`/`LanguageSkillData` become 2-member discriminated unions
  (`{ isReal: true } | { isReal: false, rating: number }`, `isNative` equivalent for Language) —
  not just `{ isReal: boolean; rating?: number }`, which would still permit illegal states
  (`isReal: true` with a `rating` set, or `isReal: false` with `rating` absent) that a real
  discriminated union rules out at compile time.
- [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md) hard-codes the
  current `"real" | number` shape as a Constraint and in its Rough Interface Sketch — updated
  alongside this doc so the two don't contradict each other. Its own Issues (`#391`, `#393`,
  `#394`) are already closed/completed, so this is a follow-up migration on shipped code, not a
  change to in-flight implementation work; only `#389` (unrelated House Rules infrastructure)
  remains open.

## Domain Notes

- **Entity** (`CONTEXT.md`) — revised as part of this feature: Runner is added as a formal
  Entity (previously the glossary listed Entity's covered kinds explicitly and did not include
  Runner; several other glossary entries — e.g. **GameEffect** sources — describe Runner and
  Entity as distinct). The glossary entry stops enumerating covered kinds inline and instead
  points at the `kind` discriminant as the source of truth.
- **Entity Matrix Presence** (`CONTEXT.md`) — revised: `EntityData.matrix?: true | MatrixStats`
  (the shape sketched in `docs/features/0014-matrix-interactions.md`) becomes a plain
  `matrix: boolean`, default `true`. Presence and "derive vs. stored" fallback collapse into one
  flag now that `attributes` is the single universal bag for every Entity kind — see Rough
  Interface Sketches below. The `MatrixStats` type is retired; "fully specced" (Commlink,
  MatrixNode) is now just "explicit values are already present in `attributes`."
- **`EntityWithAttrs`**, **`EntityWithDamage`**, **`WithMatrixPresence`**, **`WithItems`**, **`kind`**
  — new terms, to be added to `CONTEXT.md`.
- **`kind`** also resolves a need independent of selector ergonomics: polymorphic spellcaster
  resolution, where a Spell's caster may be a Runner or a Spirit and the resolving code can't
  assume which at compile time.
- **Rating** (`CONTEXT.md`) — revised: drops "a few ratings use a special sentinel instead of a
  number for an unrated/default case." `rating` is always a plain `number` now; the previous
  sentinel cases each get their own explicit flag (`isReal` on SIN/Licence, `isNative` on Language)
  instead of overloading `rating` itself.
- **`isReal`**, **`isNative`** — new terms, to be added to `CONTEXT.md`. `isReal` already existed
  informally as a derived local variable in License Quick-Buy
  (`docs/features/0001-license-quick-buy.md`); this promotes it to a real stored field.

## Rough Interface Sketches

_High-level shapes only — no implementation code._

```ts
// Exact value set is an open question above.
type EntityKind =
  | "runner" | "item" | "spirit" | "sprite" | "matrixNode"
  | "quality" | "spell" | "complexForm" | "adeptPower"

interface EntityData {
  kind: EntityKind
  id: string
  name: string
  description?: string
  source?: SourceData
  effects?: GameEffectData[]
  rating?: number
}

/** Anything with a stat block. `attributes` is always the full AttributeKey-keyed bag; entries
 *  that don't apply to this Entity kind are simply absent (resolved to 0 downstream). */
interface EntityWithAttrs {
  attributes: Partial<Record<AttributeKey, number>>
}

/** Anything with a damage track. Tracks that don't apply to this Entity kind are absent
 *  (resolved to 0 downstream) rather than typed out per implementer. */
interface EntityWithDamage {
  damage: Partial<Record<DamageTrackKey, number>>
}

/** `true` (default): the four matrix AttributeKeys in `attributes` fall back to `rating` when
 *  unset, explicit values still win — this is how a "fully specced" presence (Commlink,
 *  MatrixNode) works, by simply setting those keys directly. `false`: matrix keys hard-zero
 *  regardless of what's stored. */
interface WithMatrixPresence {
  matrix: boolean
}

/** Item-to-Item Attachment only — never implemented by non-Item Entity kinds. */
interface WithItems {
  items: {
    parentId?: string
    childIds: string[]
  }
}

// selectEntityAttr dispatches per `kind` internally (memoized for computed cases, e.g. Spirit's
// force/spiritType-derived attributes), so callers get one accessor regardless of storage shape.
declare function selectEntityAttr(key: AttributeKey): (entity: EntityData & EntityWithAttrs) => number

// Rating's string-sentinel pattern (Rating<TSentinel>) is retired; EntityData.rating is a plain
// number. The three current sentinel users become discriminated unions instead of overloading
// `rating` with a string case:

interface SinDataBase extends ItemData {
  itemType: ItemType.sin
}
type SinData =
  | (SinDataBase & { isReal: true })
  | (SinDataBase & { isReal: false, rating: number })

interface LicenseDataBase extends ItemData {
  itemType: ItemType.license
}
type LicenseData =
  | (LicenseDataBase & { isReal: true })
  | (LicenseDataBase & { isReal: false, rating: number })

type LanguageSkillData =
  | { name: string, isNative: true, lingo?: string }
  | { name: string, isNative: false, rating: number, lingo?: string }
```

## Out of Scope

- Program "loaded"/"running" lifecycle states — belongs to a future pass on
  `docs/features/0014-matrix-interactions.md`'s `ActiveProgram` model, not this decomposition.
- Retrofitting the rest of the codebase's flat, duplicated Zod schemas onto a composable pattern —
  out of scope entirely; this feature's own new schemas use a private per-file base only.
- MatrixNode/Commlink StatusSheet UI, Matrix Test dice pool computation — unrelated to this doc.
- Citing the actual SR4A rulebook passage justifying `accel`/`pilot`/`sensor`'s `AttributeKey`
  membership — provisional calls are recorded in Constraints/Open Questions above, but a real
  citation is required before implementation per AGENTS.md's citation policy.

## Related Features

- [`docs/features/0008-entity-status-sheets.md`](./0008-entity-status-sheets.md) — this doc
  answers 0008's open "Shared abstraction?" question.
- [`docs/features/0014-matrix-interactions.md`](./0014-matrix-interactions.md) — this doc revises
  0014's `EntityData.matrix?: true | MatrixStats` sketch to a plain boolean; 0014's `ActiveProgram`
  many-to-many relationship is explicitly out of `WithItems`'s scope and stays untouched.
- [`docs/adr/0010-entity-card-composition.md`](../adr/0010-entity-card-composition.md) — precedent
  this doc must stay compatible with: ADR-0010 solved Entity category variance at the *component*
  layer (tiered `CardElements`); this doc solves a related but distinct variance at the *data/
  selector* layer. The two should be read together, not conflated.
- [`docs/adr/0012-matrix-entity-model.md`](../adr/0012-matrix-entity-model.md) — this doc's
  `AttributeKey` extension continues ADR-0012's attribute-unification decision.
- [`docs/features/0011-license-check-dialog.md`](./0011-license-check-dialog.md) — its Constraint
  and Rough Interface Sketch depended on the now-retired `rating: "real" | number` shape; updated
  to match. Its own Issues are closed/completed, so this is a follow-up migration on shipped
  behavior, not a change to work in flight.
- [`docs/features/0001-license-quick-buy.md`](./0001-license-quick-buy.md) — already derives
  `isReal` informally from `rating`; this doc promotes it to a real stored field.
