# Feature flags: namespaced registries over one flat store of refs

**Status:** implemented

**Supersedes:** in [ADR-0002](./0002-feature-flags-design.md), "Why namespaced sub-objects, not a flat bag" and the
per-namespace derived `OptionalRulesData` type; in [ADR-0005](./0005-house-rules-feature-flag-namespace.md), the
`featureFlags.houseRules` storage sub-object and the rule that House Rule entries have no `Source` field. Both ADRs' reasons for separating Optional Rules from House Rules, and
ADR 0005's dotted, feature-namespaced keys, still stand.

ADR 0002 stored each feature-flag namespace as its own sub-object under `RunnerData.featureFlags`, with a type
derived from that namespace's registry. Adding House Rules (ADR 0005) would have meant a second sub-object, a second
derived type and a namespace lookup in every reader. Before that existed, House Rules were read through a hardcoded
`switch` that ignored `RunnerData` altogether.

We store every override in one flat `featureFlags: Record<string, string | boolean>`, keyed by the flag's **ref**.
Flags are defined in registries built by `createFlagRegistry(namespace, flags)`: one for Optional Rules
(`"optionalRules"`) and one for House Rules (`"houseRules"`). The namespace is the kind of rule, so a flag's `ref` is
`<namespace>.<key>` (e.g. `houseRules.karma.nuyenExchange`) and there is no separate `type` field. Every flag has a
`default` that is a string or a boolean, may list `options` (`{ value, label }`), and keeps its `name`,
`description` and optional `source` in the registry for display. `source` is optional on every entry, whatever its
namespace.

Callers pass the whole registry entry to read a flag (`useFeatureFlag(houseRules["karma.nuyenExchange"])`), which
returns the stored value for its `ref`, else its `default`, typed by the `default`. A component that checks a
list of flags (hooks can't be called per list item) reads the whole store once with `FeatureFlagSelectors.selectAll`
and resolves each entry with `resolveFlagValue(featureFlags, flag)`, the same function the single-flag read uses.

## Considered Options

- **Namespaced sub-objects per kind of rule** (ADR 0002's shape). Rejected: every new namespace needs its own
  storage type and reader branch, while a flat store keyed by a namespaced `ref` gets the same separation from the
  key alone.
- **Namespaces per feature area, registries next to each feature** (`createFlagRegistry("items.licenseCheck", …)`).
  Rejected: the kind of rule (Optional vs House) is what the namespace must express, since that is the distinction
  ADRs 0002 and 0005 draw.
- **Key-based reads with a central key union** (`select({ key })`). Rejected: passing the entry gives the reader the
  `ref` and `default` directly, and a caller can only read a flag that's registered.

## Consequences

- The value type is no longer per-flag in storage: any ref may hold any `string | boolean`. A stored value whose
  type doesn't match the flag's `default` is ignored in favour of the `default`.
- Moving a flag between namespaces, or renaming its key, changes its `ref`, and so needs a migration of stored
  overrides.
- Migration `20261120_00_flattenFeatureFlags` flattens the old sub-objects into refs, renaming `encumbranceEnabled`
  to `optionalRules.items.armor.encumbrance`.
- Nothing enforces a `source` on an Optional Rule; that is left to review.
- `options` describe the values a settings UI offers; the reader does not reject a stored string outside them.
