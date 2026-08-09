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

### Slices

This doc's scope is bigger than any one PR. The **Known Node roster slice** — replacing the
current single flat `RunnerData.matrix` node with a `gameState.matrix.knownNodes[]` roster, an
Active Node designation, and per-node `ActiveProgram` tracking for owned `Program` items — is the
first slice, and the one the "Matrix tab layout" open question above now answers. It deliberately
excludes: `Agent` (doesn't exist in the codebase yet), the cheatsheet, Processor Limit/Subscription
Limit enforcement, and Access Level gating on starting an `ActiveProgram` (tracked but advisory
only this slice). Those stay open/deferred to later slices of this same doc.

## Open Questions

- [ ] **Cheatsheet content** — what exact list of Matrix Actions (with descriptions/formulas)
      belongs on the cheatsheet, and is it static copy or does any of it read live Node/Runner
      values? Deferred out of the Known Node roster slice (see "Slices" below).
- [ ] **`ItemType.software` vs `ItemType.program`** — carried over from
      `docs/features/0005-matrix-programs.md`, still unresolved; doesn't block this feature since
      Program's own shape isn't changing, just gaining Agent as a subtype.
- [ ] **Complex Forms** — do Technomancer Complex Forms participate in `ActiveProgram` the same
      way Agents do, or are they out of scope for this pass? Not addressed in this design round.
- [x] **Matrix tab layout (Known Node roster slice)** — the roster replaces the old single Active
      Node panel: a list of Known Node cards (name + `MatrixAttrs` + Access Level + Node Type),
      each with an "Edit" action opening a `useDialog`-based form and an explicit "Set
      Active"/"Deactivate" button. Each card also hosts a "Load Program" picker (the affordance
      for starting an `ActiveProgram` lives on the Node, not on the Program card) listing that
      card's currently-running Programs with a stop control. `MatrixProgramsSection` (the gear
      list) is unchanged by this slice. Cheatsheet placement remains open above.
- [ ] **Agent StatusSheet contents** — beyond `rating` and a Matrix damage track, does Agent need
      anything else in its stat block (e.g. does it ever act independently of being an
      `ActiveProgram`)? Moot for the Known Node roster slice — Agent doesn't exist in the codebase
      yet, so `ActiveProgram.sourceId` only ever references a `Program` this round.

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
  member so far. The migration that adds it also retires the old flat `RunnerData.matrix` node:
  its `{name, system, firewall, response, signal}` become `knownNodes[0]` (Access Level `public`,
  Node Type `general`) and `activeNodeId` — dropping `numberOfPrograms` entirely, since the
  running-Program count is now derived by counting `activePrograms` for that node rather than
  hand-typed.
- Existing Matrix tab pieces (damage track via `Selectors.damage.selectMatrixTrack`, the Programs
  list via `MatrixProgramsSection`) are the extension points — reuse, don't replace.
- Access Level and hacking thresholds are Player-set/display-only this pass — no Extended Test
  wiring, no dice pool computation. Starting an `ActiveProgram` on a node with insufficient Access
  Level is *not* blocked this slice (advisory only); Node Type is stored on every `MatrixNode`
  from this slice on but doesn't affect Response yet (Processor Limit enforcement is a later
  slice); the Subscription Limit is not enforced this slice (the roster is uncapped).
- `(sourceId, nodeId)` is a unique pair on `activePrograms` — starting a Program on a Node it's
  already running on is a no-op/toggle-off, not a second entry. A given Program can still run on
  several different Nodes simultaneously.
- Deleting a Known Node or an owned Program cascades: every `ActiveProgram` entry referencing the
  deleted `nodeId`/`sourceId` is removed with it, so `activePrograms` never holds a dangling
  reference. Deleting the Active Node clears `activeNodeId` rather than auto-promoting another
  Known Node.

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
  matrix: MatrixStats // MatrixNode is always fully specced; no separate top-level `rating`
  nodeType: NodeType
}

enum AccessLevel { none = "none", public = "public", user = "user", security = "security", admin = "admin" }

type KnownNode = MatrixNodeData & { accessLevel: AccessLevel } // defaults to accessLevel: "public" when added

interface ActiveProgram {
  sourceId: string // id of an owned Program (or, later, Agent) Item
  nodeId: string   // id of a KnownNode
  // (sourceId, nodeId) is a unique pair within activePrograms[] — no separate id field
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
- Processor Limit enforcement (the Response penalty math) and Subscription Limit enforcement (the
  roster-size cap) — `nodeType` is stored so a later slice doesn't need a backfill migration, but
  neither limit is computed or blocked against yet
- Gating `ActiveProgram` creation on the Node's Access Level — tracked and displayed, not enforced

## Related Features

- [`docs/features/0005-matrix-programs.md`](./0005-matrix-programs.md) — Matrix Programs & Matrix
  Tests; this feature's `MatrixAttrs`/`ActiveProgram` groundwork directly informs that doc's open
  "GameEffect integration" question (answered: Node/Program ratings are literal `AttributeKey`
  entries, so no separate resolver is needed) but doesn't implement the dice pool itself
- [`docs/features/0008-entity-status-sheets.md`](./0008-entity-status-sheets.md) — Agent's
  StatusSheet follows the same pattern established there for Spirit/Sprite/Vehicle
- [`docs/adr/0012-matrix-entity-model.md`](../adr/0012-matrix-entity-model.md) — the attribute
  unification and Agent-as-Item decisions this feature is built on
