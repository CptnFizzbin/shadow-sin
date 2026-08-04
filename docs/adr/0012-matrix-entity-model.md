# Matrix stats and entities reuse the existing Attribute/Item systems

Matrix Tests (`Response`/`System`/`Firewall`/`Signal` + Program rating) already mirror
`Attribute + Skill` tests structurally, so rather than building a parallel stat/resolver system
for `MatrixNode` and other matrix-capable Entities, we extended `AttributeKey` with the four
matrix stats and made every attribute bag (`RunnerData.attributes`, and any Entity's matrix
stats) `Partial<Record<AttributeKey, number>>`, with `selectAttrBase`/`selectAttrValue`
defaulting absent/inapplicable keys to `0`. This lets Matrix Tests reuse the existing dice-pool
and `GameEffect` machinery end-to-end, answering the open question left in
`docs/features/0005-matrix-programs.md` about whether matrix tests need their own resolver.

Similarly, `Agent` was deliberately placed as an `Item` subtype (`Entity → Item → Program →
Agent`) rather than a standalone Entity alongside `Spirit`/`Sprite`, even though it's
autonomous and requires a `StatusSheet` like they do — `Vehicle` already proves "is an Item" and
"requires a StatusSheet" aren't exclusive. This keeps Agent inside the existing Item/gear
tooling (lists, forms, `ItemType` dispatch) instead of introducing a fourth storage location for
stat-bearing things.

## Consequences

- `RunnerData.attributes` moves from a fully-populated `Record` to a `Partial<Record>` — a
  type-level breaking change for any code assuming every key is present. No data migration is
  needed (existing persisted Runners already populate all 12 original keys); this is a call-site
  audit, not a schema change.
- An Entity's simplified matrix presence (`matrix: true`) derives its four stats from the
  Entity's own Rating live, rather than storing a snapshot — avoids drift after the Entity's
  Rating changes, at the cost of nothing being a plain stored number for the simple case.
- Response/Signal for a running `ActiveProgram` (Program or Agent) are resolved from its current
  host `MatrixNode`, never from the Program/Agent's own data — this is a resolver-level rule, not
  something visible in either type's shape.
