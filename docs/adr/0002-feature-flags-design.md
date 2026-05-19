# Feature flags: namespaced registry over a flat config bag

`RunnerData.featureFlags` is a namespaced container whose keys are derived from typed registries
(e.g. `optionalRulesRegistry`). Each registry entry is a `FeatureFlag<Value>` descriptor carrying
display metadata and a source citation. Optional rules — published variant rules from Shadowrun
source books — are one namespace within this container; future namespaces (e.g. available source
books) can be added without touching the existing shape.

## Why a registry and `FeatureFlag<Value>` factory, not a plain config object

Each optional rule needs display metadata (name, description) and a source citation (`SourceData`)
for UI rendering and validation. Storing that alongside the flag definition in a typed registry
lets `OptionalRulesData` and its Zod schema be derived from one source of truth, preventing the
type and schema from drifting apart as new rules are added.

## Why namespaced sub-objects, not a flat bag

A flat `Record<string, boolean>` loses value-type safety (some flags are enums, not booleans)
and makes registry-driven type derivation impossible. A flat object also gives no room for the
future `sourceBooks` namespace without a breaking schema change. Namespaced sub-objects keep
each category's registry, type, and schema self-contained.

## Why optional rules are on RunnerData instead of GameConfig

Optional rules are a game-table decision and logically belong in `GameConfig` (GM-level, applied
to all Runners). However, the GM Game feature that links multiple Runners under a single
`GameConfig` is not yet implemented. `featureFlags` is placed on `RunnerData` as a pragmatic
stopgap — the shape mirrors `GameConfig.featureFlags` exactly so the field can be lifted with a
single migration once Games exist.

## Why optional rules default to disabled

Optional rules are opt-in by design — a Runner built without a particular rule in mind should not
be silently affected by it. Defaulting to disabled preserves stock SR4e behaviour for all existing
Runners and requires an explicit choice to activate a variant.
