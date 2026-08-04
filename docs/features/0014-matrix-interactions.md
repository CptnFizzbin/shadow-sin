# Matrix Interactions

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

Player-facing helper tools for managing Matrix presence during a run: an active `MatrixNode`,
a roster of Known Nodes, running Programs/Agents, and a Matrix Actions cheatsheet — on the
existing Matrix tab (`src/routes/$runnerId/_viewer/matrix.tsx`). This pass is explicitly
bookkeeping, not simulation: it does not compute Matrix Test dice pools, run the Hacking on the
Fly/Probing extended tests, or model matrix combat. It establishes the entity model (`MatrixNode`,
`Program`/`Agent` as `Item` subtypes, the shared Matrix attribute system) that a later pass can
build real dice-pool computation on top of.

## Open Questions

- [ ] **Cheatsheet content** — what exact list of Matrix Actions (with descriptions/formulas)
      belongs on the cheatsheet, and is it static copy or does any of it read live Node/Runner
      values?
- [ ] **`ItemType.software` vs `ItemType.program`** — carried over from
      `docs/features/0005-matrix-programs.md`, still unresolved; doesn't block this feature since
      Program's own shape isn't changing, just gaining Agent as a subtype.
- [ ] **Complex Forms** — do Technomancer Complex Forms participate in `ActiveProgram` the same
      way Agents do, or are they out of scope for this pass? Not addressed in this design round.
- [ ] **Matrix tab layout** — exact placement/ordering of the Active Node panel, Known Nodes
      list, Programs/Agents lists, and cheatsheet on the existing Matrix tab.
- [ ] **Agent StatusSheet contents** — beyond `rating` and a Matrix damage track, does Agent need
      anything else in its stat block (e.g. does it ever act independently of being an
      `ActiveProgram`)?

## Constraints

- `AttributeKey` gains `firewall`, `response`, `signal`, `system`. `RunnerData.attributes` and
  any Entity's matrix-stats bag both become `Partial<Record<AttributeKey, number>>`;
  `selectAttrBase`/`selectAttrValue` return `0` for an absent or inapplicable key. See
  `docs/adr/0012-matrix-entity-model.md`.
- `EntityData.matrix?: true | MatrixStats` needs threading through every Entity kind that can
  have a matrix presence. `true` derives all four stats from the Entity's own **Rating**;
  `MatrixStats` (`Partial<MatrixAttrs>`) overrides specific keys, falling back to Rating for the
  rest.
- `MatrixNode` is a new top-level Entity kind (not an `Item`) — needs its own `MatrixNodeData`
  type, wherever Entity kinds are enumerated/switched over.
- `Program` (existing `ItemType.program`) gains `Agent` as a subtype (`Entity → Item → Program →
  Agent`). Agent requires a `StatusSheet`, following the `Vehicle` precedent that being an `Item`
  doesn't preclude one. Agent's `rating` serves as Pilot/System/Firewall/Skill; its Response/Signal
  resolve live from whichever `MatrixNode` currently hosts it as an `ActiveProgram` — this is
  resolver logic, not a stored field.
- `RunnerData.gameState` is a brand-new top-level namespace; `gameState.matrix` is its only
  member so far. Needs a migration adding the default empty shape.
- Existing Matrix tab pieces (damage track via `Selectors.damage.selectMatrixTrack`, the Programs
  list via `MatrixProgramsSection`) are the extension points — reuse, don't replace.
- Access Level and hacking thresholds are Player-set/display-only this pass — no Extended Test
  wiring, no dice pool computation.

## Domain Notes

New/changed `CONTEXT.md` terms (full definitions there): **MatrixAttrs**, **Entity Matrix
Presence**, **MatrixNode**, **Node Type**, **Processor Limit**, **Subscription Limit**, **Access
Level**, **Matrix Game State**, **Known Node**, **ActiveProgram**, **Clear Matrix Session**,
**Agent** (revised — now an `Item`/`Program` subtype, not a standalone Entity).

## Rough Interface Sketches

_High-level shapes only — no implementation code._

```ts
// AttributeKey gains four members (existing enum, see src/system/attributeKey.ts)
enum AttributeKey {
  // ...existing Runner attributes
  firewall = "firewall",
  response = "response",
  signal = "signal",
  system = "system",
}

type MatrixStats = Partial<Record<AttributeKey, number>> // conceptually restricted to the 4 matrix keys

interface EntityData {
  // ...existing fields
  matrix?: true | MatrixStats
}

enum NodeType { general = "general", nexus = "nexus" }

interface MatrixNodeData extends EntityData {
  id: string
  name: string
  rating: number
  matrix: MatrixStats // MatrixNode is always fully specced
  nodeType: NodeType
}

enum AccessLevel { none = "none", user = "user", security = "security", admin = "admin" }

type KnownNode = MatrixNodeData & { accessLevel: AccessLevel }

interface ActiveProgram {
  sourceId: string // id of an owned Program or Agent Item
  nodeId: string   // id of a KnownNode
}

interface MatrixGameState {
  knownNodes: KnownNode[]
  activeNodeId?: string
  activePrograms: ActiveProgram[]
}

interface RunnerData {
  // ...existing fields
  gameState: {
    matrix: MatrixGameState
  }
}

// Agent: Item subtype of Program
interface AgentData extends ProgramData {
  damage: { matrix: number } // Matrix Damage Track, per CONTEXT.md
  // rating (inherited) doubles as Pilot / System / Firewall / Skill
}
```

## Out of Scope

- Simulating Hacking on the Fly / Probing as Extended Tests (thresholds are displayed, not rolled)
- Matrix Test dice pool computation generally (deferred; this pass only establishes the shared
  attribute plumbing it will need)
- Full matrix combat (IC, trace, black ice) — same exclusion as `docs/features/0005-matrix-programs.md`
- Device modes (Active/Passive/Hidden) — deferred to a later pass
- Technomancer Complex Forms' relationship to `ActiveProgram` (open question above)

## Related Features

- [`docs/features/0005-matrix-programs.md`](./0005-matrix-programs.md) — Matrix Programs & Matrix
  Tests; this feature's `MatrixAttrs`/`ActiveProgram` groundwork directly informs that doc's open
  "GameEffect integration" question (answered: Node/Program ratings are literal `AttributeKey`
  entries, so no separate resolver is needed) but doesn't implement the dice pool itself
- [`docs/features/0008-entity-status-sheets.md`](./0008-entity-status-sheets.md) — Agent's
  StatusSheet follows the same pattern established there for Spirit/Sprite/Vehicle
- [`docs/adr/0012-matrix-entity-model.md`](../adr/0012-matrix-entity-model.md) — the attribute
  unification and Agent-as-Item decisions this feature is built on
