# One feature-flag registry, classified by `type`, with namespaced storage

**Status:** proposed

**Supersedes:** the "one registry per namespace" parts of [ADR-0002](./0002-feature-flags-design.md) and
[ADR-0005](./0005-house-rules-feature-flag-namespace.md). Both ADRs' storage shape — namespaced sub-objects under
`RunnerData.featureFlags` — still stands.

ADR 0002 gave each feature-flag namespace its own registry, and ADR 0005 added a second one,
`houseRulesRegistry`, for House Rules. Before any House Rule registry existed, its two consumers (License Check and
the Manage Karma wizard) read their flags through a hardcoded `switch` that ignored `RunnerData`. Separate
registries would also have needed a separate key type, selector and namespace lookup per namespace, all doing the
same thing.

We keep a single `featureFlagsRegistry` instead. Every entry is a `FeatureFlag<Value, Type>` carrying
`type: "optionalRule" | "houseRule"`. The `type` is a classification only: it says which kind of setting a flag is,
and it decides which `FeatureFlagsData` namespace stores the flag's override (`optionalRules` or `houseRules`).
`source` is optional for every flag, whatever its `type`. The registry is declared `as const satisfies`, so
`FeatureFlagKey` is a literal union and an unknown key is a compile error. One selector,
`FeatureFlagSelectors.select({ key })`, reads any flag: the stored override in its type's namespace, else the
registry's `defaultValue`.

All keys follow ADR 0005's dotted, feature-namespaced convention (`<area>.<feature>.<flag>`), so they are unique
across both types in the one registry.

## Considered Options

- **Two registries, each entry tagged with `type`.** Rejected. The tag would only repeat which registry the entry is
  in, and the key type, selector and namespace lookup would still be duplicated per registry.
- **One registry with flat storage (`featureFlags[key]`).** Rejected. It would replace ADR 0002's namespaced
  sub-objects with the flat bag ADR 0002 argues against, for no gain the namespaced storage doesn't already give.
- **Make `type` enforce citations** (`"optionalRule"` requires `source`, `"houseRule"` forbids it). Rejected for now:
  `type` is classification only. A discriminated union can be added later if citations need enforcing.

## Consequences

- The Encumbrance Optional Rule's key changes from `encumbranceEnabled` to `items.armor.encumbrance`, which needs a
  migration of stored overrides (`20261120_00_renameEncumbranceFlag`).
- Because `type` picks the storage namespace, reclassifying a flag (Optional Rule ↔ House Rule) moves its stored
  overrides between `optionalRules` and `houseRules`, and so needs a migration.
- Nothing enforces a citation on an Optional Rule; that is left to review.
- `FeatureFlagSelectors.select` returns the union of every registered flag's value type rather than the value type
  of the specific key, since reselect's combiner isn't generic over `key`. Every flag is a `boolean` today.
