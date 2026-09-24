# Matrix Entities: Loaded & Running Programs, Agents

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Added once this is sliced. -->

Gives every matrix-capable thing — a commlink, a drone, a smartgun, a Known Node, an Agent — one
shared **Matrix Entity** shape, so Programs can be *loaded* onto a device (stored on it) and
*running* on a node (active on it), and so Agents can carry and run their own Programs. This is
the model the Matrix tab's "Run Program" / "Run Agent" / "Move Agent" / "Terminate" controls
will be built on. It supersedes the `matrix?: true | MatrixStats` presence flag and the flat
`ActiveProgram { sourceId, nodeId }` list from
[`0014-matrix-interactions.md`](./0014-matrix-interactions.md) for everything except Known Nodes
(see Constraints).

## Decisions so far

Settled in a design grilling session; see [ADR 0018](../adr/0018-matrix-entity-by-reference.md)
for the structural "why".

- **Any Item can be a matrix node.** Items opt in through the `EntityWithMatrixNode` trait. Not
  every Entity is an Item, but every Item is an Entity.
- **`EntityWithMatrixNode.matrix` is an id** pointing at a **Matrix Entity**, not an embedded
  object and not a `true | MatrixStats` flag.
- **A Matrix Entity is a full Entity** (own `id`/`kind`) that implements `EntityWithAttrs` and
  `EntityWithItems`, and additionally carries an optional `nodeType` and a `programs` field.
  - `attributes` holds all four matrix attributes (Response/System/Firewall/Signal) plus any
    further attributes derived from other parts of the entity (e.g. from an Agent's rating).
  - `nodeType` is optional and defaults to `general` when absent.
  - `items.parentId` points at the owning Item (e.g. the commlink); `items.childIds` are the
    Programs **loaded** on it.
  - `programs.runningIds` lists which Programs are currently **running** on it.
- **Loaded is the attachment tree, not a separate list.** A Program is loaded wherever its
  `items.parentId` points — at a Matrix Entity. Physical attachments (scopes, mods) stay on the
  owning Item's own `items`; all program/matrix information lives on the Matrix Entity.
- **Agents are both a Program and a Matrix Entity.** `AgentData` extends `ProgramData` and the
  Matrix Entity shape directly (no nested `matrix` pointer), so an Agent's own loaded Programs are
  its `items.childIds` and its own running Programs are its `programs.runningIds`. Moving an Agent
  moves its whole sub-tree with it. Agents also gain a `script` field.
- **Copying a Program creates a new Program Item** (new id). Each Program Item is loaded on at
  most one Matrix Entity at a time. Copy Protection disables Copy but still allows Move.
- **`RunnerData._data_.items` is renamed `_data_.entities`** — the Runner's single id-keyed store,
  holding Items and Matrix Entities.
- **Known Nodes are unchanged for now.** They stay in `gameState.matrix.knownNodes` with
  `gameState.matrix.activePrograms`; folding them into `_data_.entities` is deferred to limit
  scope.

## Open Questions

- [ ] **Slicing** — proposed split, not yet agreed: (1) Matrix Entity + `_data_.entities` rename
      + Run/Terminate Program on devices; (2) Agents (script, Run Agent dialog, Move); (3) Program
      flags (Copy Protection, Copy vs Move, new category, `relatedAttr`/`relatedSkill`).
- [ ] **Two running-program mechanisms** — while Known Nodes keep `activePrograms`, device Matrix
      Entities use `programs.runningIds`. When (and how) do these merge?
- [ ] **Can a Program run somewhere it isn't loaded?** A Program loaded on the Runner's commlink
      running on a hacked Known Node suggests yes — does `runningIds` on a device Matrix Entity
      only ever reference its own loaded children, or any owned Program?
- [ ] **`programType` categories vs existing `ProgramType`** — the proposed categories (common,
      hacking, agent, autosoft, system, firewall) are a different axis from today's
      `ProgramType` enum (attack, browse, command, …, other). Separate field, rename, or replace?
- [ ] **`relatedAttr` / `relatedSkill`** — display-only metadata this pass, or does it drive a
      Matrix Test dice pool (see `0005-matrix-programs.md`)?
- [ ] **Terminate** — is it just "stop running" (remove from `runningIds`), or something more?
- [ ] **Active Device or Node** — does the Matrix tab's single active selector pick among both
      owned Matrix Entities and Known Nodes? Does it replace `gameState.matrix.activeNodeId`?
- [ ] **Run Agent dialog** — pre-selects the Agent's already-running Programs; confirm that
      deselecting one terminates it.
- [ ] **Entity store scope** — `_data_.entities` holds Items and Matrix Entities this feature;
      do spirits, sprites, qualities, spells, complex forms, and powers move in later, and under
      which feature?
- [ ] **Device hardware stats** — `DeviceData.response/signal/system/firewall` move into its
      Matrix Entity's `attributes`; what happens to `deviceRating`, `dataProcessing`, and
      `programSlots`?
- [ ] **Agent `kind`** — an Agent is a Program Item and a Matrix Entity; which `kind` does it
      carry, and how do "find all Matrix Entities" selectors include it?

## Constraints

- Schema changes need timestamped, idempotent migrations (see `AGENTS.md`): the
  `_data_.items` → `_data_.entities` rename, moving device stats into new Matrix Entities, and
  re-parenting existing Programs onto a Matrix Entity.
- A Program has exactly one `items.parentId`, so "loaded on" is single-location. Anything
  many-to-many (a Program running on several nodes) must stay in `runningIds`/`activePrograms`,
  never in the attachment tree.
- Deleting an Item must cascade to its Matrix Entity, and deleting a Matrix Entity must cascade
  to (or detach) its loaded Programs and clear its id from any `runningIds`.
- Response/Signal for an Agent still resolve from its host node (ADR 0012's resolver rule).

## Domain Notes

New/changed `CONTEXT.md` terms: **Matrix Entity**, **Node** (now any Matrix Entity, including the
Runner's own devices), **Active Node**, **Loaded**, **Running**, **Terminate**, **Copy
Protection**, **Agent** (revised), **Program** (revised). **Entity Matrix Presence**,
**ActiveProgram**, and **Matrix Game State** are no longer glossary entries.

## Rough Interface Sketches

_Shapes only._

```ts
interface EntityWithMatrixNode {
  matrix: UUID // id of a MatrixEntity in _data_.entities
}

interface MatrixEntity extends EntityData, EntityWithAttrs, EntityWithItems {
  // attributes: response/system/firewall/signal + any derived extras
  // items.parentId: owning Item; items.childIds: loaded Programs
  nodeType?: NodeType // defaults to general
  programs: {
    runningIds: UUID[]
  }
}

interface AgentData extends ProgramData, MatrixEntity {
  script: string
}

interface ProgramData extends ItemData {
  // ...existing
  copyProtected?: boolean
  // category / relatedAttr / relatedSkill — see Open Questions
}

interface RunnerData {
  _data_: {
    entities: Record<UUID, EntityData> // formerly `items`
    // ...
  }
}
```

## Out of Scope

- Moving Known Nodes into `_data_.entities` (they keep `gameState.matrix.knownNodes`).
- Moving spirits, sprites, qualities, spells, complex forms, or powers into `_data_.entities`.
- Matrix Test dice pool computation, Processor/Subscription Limit enforcement, Access Level
  gating — unchanged from `0014-matrix-interactions.md`.
- Technomancer Complex Forms as running programs.

## Related Features

- [`0014-matrix-interactions.md`](./0014-matrix-interactions.md) — Known Node roster and the
  original `ActiveProgram` model this builds on and partially supersedes
- [`0005-matrix-programs.md`](./0005-matrix-programs.md) — answers its "loaded vs installed"
  question (loaded = attached to a Matrix Entity)
- [`0015-entity-interface-decomposition.md`](./0015-entity-interface-decomposition.md) —
  introduced `_data_.items` and `EntityWithItems`, which this renames and reuses
- [`docs/adr/0018-matrix-entity-by-reference.md`](../adr/0018-matrix-entity-by-reference.md)
