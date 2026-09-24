# Matrix presence is a separate Matrix Entity, referenced by id

Any Item can be a matrix node, so we needed one place for matrix stats, loaded Programs, and
running Programs that works the same for a commlink, a drone, and an Agent. Rather than embed
that data on the Item (or keep ADR 0012's `matrix?: true | MatrixStats` flag), an Item's `matrix`
field holds the id of a separate **Matrix Entity** — a full Entity with its own `attributes`,
`items` (loaded Programs are its attachment children), and `programs.runningIds`. To make id
references resolvable, `RunnerData._data_.items` becomes `_data_.entities`, a single id-keyed store
for Items and Matrix Entities. Agents are both a Program and a Matrix Entity, so the same
loaded/running structure nests to any depth.

## Considered Options

- **Embed the Matrix Entity inside `item.matrix`** — rejected: a Program's `parentId` would point
  at something not in the store, forcing every id lookup and cascade to search nested fields.
- **A separate `loadedIds` list** — rejected: duplicates the existing `parentId`/`childIds`
  attachment tree and can disagree with it. Program and physical attachments are kept apart by
  hanging Programs off the Matrix Entity, not the owning Item.
- **Share one Program Item across devices** — rejected: Agents carry their own running list,
  script, and damage, so copies must be separate Items.

## Consequences

- Supersedes ADR 0012's `EntityData.matrix?: true | MatrixStats` presence flag; ADR 0012's
  `AttributeKey` unification and "Response/Signal resolve from the host" rule still stand.
- Known Nodes stay in `gameState.matrix` with the old `activePrograms` list until a later
  change moves them into the store, so two running-program mechanisms coexist for a while.
