# Additional Build Modes (Priority Build & Karma Build)

## Status

Open — only BP Build is currently implemented. Priority Build and Karma Build are planned.

## Background

Shadowrun 4th Edition offers three official character creation methods:

1. **BP Build** _(implemented)_ — a flat pool of 400 Build Points covers all creation spending.
2. **Priority Build** _(planned)_ — the player assigns priorities A through E across five
   categories (Metatype, Attributes, Skills, Magic, Resources). Each priority level grants a
   fixed allocation for that category (e.g. Priority A in Skills = 50 skill points).
3. **Karma Build** _(planned)_ — the entire Runner is built using only Karma (generally 750 Karma
   for a starting character). No BP pool; everything has a Karma cost.

## Design Questions

1. How is `BuildMode` stored on `RunnerData`? Field on the root, or inside a `creation` sub-object?
2. The BP Build has `BuilderState.startingNuyen` — do Priority and Karma builds share this, or
   does each mode have its own shape?
3. For Priority Build, is the priority table static (hardcoded from the rulebook) or configurable
   per campaign?
4. Should switching Build Mode in the Builder be allowed after initial selection, or is it a
   one-time choice that locks in?
5. Karma Build means Karma is spent during *creation* — how does this interact with the
   post-creation Karma balance on `RunnerData.karma`? Are they the same pool or separate?

## Related

- `src/components/builder/` — current Builder implementation (BP Build only)
- `src/components/builder/buildPoints/` — BP budget logic
- `src/components/builder/builderState.ts` — `BuilderState` (currently just `startingNuyen`)
- `CONTEXT.md` — Build Mode, Karma, Build Points term definitions
