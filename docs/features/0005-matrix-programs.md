# Matrix Programs & Matrix Tests

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

Matrix tests follow the same structure as physical skill tests — `Commlink Stat + Program` —
mirroring `Attribute + Skill`. Programs are already stored as Items, but loaded program tracking
and matrix test dice pool calculations are not yet implemented.

**Current state:**
- Programs exist as Items in `RunnerData.gear` with `ItemType.program`
- There is no model for "loaded" vs "installed but not loaded" programs
- No matrix test dice pool calculation exists
- `ItemType.software` also exists — its distinction from `ItemType.program` is unresolved

## Open Questions

- [ ] **Loaded vs installed** — is a Program an Attachment on a Commlink (parent/child), or does
      the Commlink track a separate `loadedProgramIds` field?
- [ ] **Program slots** — concurrent program load limit is capped by the Commlink's System
      rating. Enforced in Builder, Viewer, or both?
- [ ] **`ItemType.software` vs `ItemType.program`** — are these synonyms to merge, or does
      `software` cover non-test tools (OS, utilities) while `program` is the matrix-test subtype?
- [ ] **Technomancer Complex Forms** — do they share the `Commlink Stat + Program` dice pool
      structure, or use a distinct formula?
- [ ] **Matrix test UI** — where does a Player roll a matrix test? On the Commlink's StatusSheet,
      or inline on the main Viewer?
- [x] **GameEffect integration** — resolved by `docs/features/0014-matrix-interactions.md`:
      `Response`/`System`/`Firewall`/`Signal` are literal `AttributeKey` entries now, so Matrix
      Tests reuse the existing Attribute/`GameEffect` dice-pool machinery rather than a separate
      resolver. The dice pool computation itself is still not implemented.

## Constraints

- A Commlink has four hardware stats: Response, System, Firewall, Signal. These substitute for
  Attributes in matrix tests.
- Concurrent loaded programs are limited by the Commlink's System rating (SR4e rule).
- Technomancers compile Complex Forms in place of Programs — the two must remain compatible with
  whatever dice pool structure is chosen.

## Domain Notes

- **Commlink** — Runner's matrix device; has Response, System, Firewall, Signal stats
- **Program** — software loaded on a Commlink; rating contributes to matrix test dice pool
- **Matrix Test** — `Commlink Stat + Program` dice pool test
- **Complex Form** — Technomancer equivalent of a Program

## Out of Scope

- Full matrix combat (IC, trace, black ice) — out of scope until the core matrix test structure
  is established
- Technomancer Resonance-based abilities beyond Complex Forms

## Related Features

- [`docs/features/0008-entity-status-sheets.md`](./0008-entity-status-sheets.md) — Commlink
  StatusSheet (matrix damage track lives here)
- [`docs/features/0006-game-effect-resolution-model.md`](./0006-game-effect-resolution-model.md)
  — how Program ratings feed into dice pools
- [`docs/features/0014-matrix-interactions.md`](./0014-matrix-interactions.md) — Nodes, Agents,
  and the Matrix tab helper tools; establishes the shared `MatrixAttrs`/`AttributeKey` plumbing
  this feature's dice pools will run on
