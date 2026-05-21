# Additional Build Modes (Priority Build & Karma Build)

> **Status:** Draft
>
> **GitHub Issues / PRs:**
> <!-- Add links once the feature is ready to implement. A feature may have multiple. -->

Only **BP Build** is currently implemented. Shadowrun 4th Edition also defines two additional
creation methods:

- **Priority Build** _(planned)_ — the player assigns priorities A–E across five categories
  (Metatype, Attributes, Skills, Magic, Resources). Each priority level grants a fixed allocation
  for that category (e.g. Priority A in Skills = 50 skill points).
- **Karma Build** _(planned)_ — the entire Runner is built using only Karma (typically 750 Karma
  for a starting character). No BP pool; every attribute, skill, and quality has a Karma cost.

## Open Questions

- [ ] How is **Build Mode** stored on `RunnerData`? As a field on the root, or inside a
      `creation` sub-object?
- [ ] The BP Build has `BuilderState.startingNuyen` — do Priority Build and Karma Build share
      this shape, or does each mode define its own?
- [ ] For Priority Build, is the priority table static (hardcoded from the rulebook) or
      configurable per campaign?
- [ ] Should switching Build Mode in the Builder be allowed after initial selection, or is it a
      one-time lock-in?
- [ ] Karma Build spends Karma during *creation* — how does this interact with the post-creation
      Karma balance on `RunnerData.karma`? Same pool or separate?

## Constraints

- Only one Build Mode is active per Runner; modes are not combinable.
- Karma as a post-creation advancement currency is independent of Build Mode — this must remain
  true regardless of which creation mode is used.
- Priority table values are defined by the SR4e rulebook and should be treated as fixed unless
  campaign configuration is explicitly in scope.

## Domain Notes

- **Build Mode** — the ruleset used to create a Runner; determines resource allocation method
- **BP Build** — the currently implemented mode; fixed pool of Build Points
- **Priority Build** — table-driven allocation (A–E per category)
- **Karma Build** — Karma-only creation; no BP pool
- **Build Points (BP)** — creation-only currency; not used post-creation
- **Karma** — post-creation advancement currency; doubles as creation currency in Karma Build

## Out of Scope

- Non-SR4e build methods
- Mixing Build Modes within a single Runner
- Retroactively converting an existing Runner between modes

## Related Features

- [`docs/features/0007-migration-system-improvement.md`](./0007-migration-system-improvement.md)
  — adding `BuildMode` to `RunnerData` will require a migration; improved migration system
  should ideally land first
