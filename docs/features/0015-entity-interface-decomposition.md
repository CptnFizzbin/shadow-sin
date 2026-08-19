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

## Open Questions

- [ ] **Zod schema composition** — no `EntityDataSchema` exists today; `MatrixNodeDataSchema`
      hand-duplicates `EntityData`'s fields instead of composing them. Do the new capability
      interfaces get their own composable Zod fragments (`EntityWithAttrsSchema`, etc.), and do
      existing hand-duplicated schemas get refactored to compose from them?
- [ ] **Migration sequencing** — the full ordered list of `NNN_*.ts` migrations needed: adding
      `kind` across `RunnerData`/`SpiritData`/`SpriteData`/`VehicleData`/`MatrixNodeData`;
      restructuring `attributes` for Vehicle/MatrixNode/Spirit exposure; restructuring `damage`
      to the universal `Partial<Record<DamageTrackKey, number>>` shape; nesting Attachment fields
      under `items`. Needs a concrete sequence, respecting "never edit an existing migration."
- [ ] **Exact `EntityKind` value set** — confirm the full list and whether `ItemData.itemType`
      stays a second-level discriminant under `kind: "item"`, or gets folded into `kind` directly.
- [ ] **`attributes` fallback when `rating` is also absent** — assumed to resolve to `0`, matching
      `selectAttrBase`'s existing `?? 0` convention. Confirm.
- [ ] **Backfill vs. forward-only** — does `WithMatrixPresence`'s `matrix: true` default apply
      retroactively to existing persisted Entities via migration, or only to newly created ones?
- [ ] **Program "loaded"/"running" states** (raised in discussion, not designed here) — needs its
      own pass against `docs/features/0014-matrix-interactions.md`'s `ActiveProgram` model.

## Constraints

- `AttributeKey` remains the single, dice-pool-test-relevant enum. New members added for Vehicle
  stats (`handling`, `armor`, ...) must each have a real Attribute+Skill-style test use per
  SR4A rules — not added merely because a value exists on some Entity. `speed` stays outside
  `AttributeKey` (not independently tested).
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
  rating?: Rating<string>
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
```

## Out of Scope

- Program "loaded"/"running" lifecycle states — belongs to a future pass on
  `docs/features/0014-matrix-interactions.md`'s `ActiveProgram` model, not this decomposition.
- Zod schema composition mechanics — flagged as an open question; not designed here.
- MatrixNode/Commlink StatusSheet UI, Matrix Test dice pool computation — unrelated to this doc.
- Confirming which specific Vehicle stats are legitimately testable under SR4A rules beyond the
  `handling`/`armor` examples discussed — needs a rulebook citation before implementation per
  AGENTS.md's citation policy, not assumed complete here.

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
