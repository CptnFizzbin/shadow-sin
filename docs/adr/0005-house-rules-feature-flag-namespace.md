# A separate "House Rules" feature-flag namespace, distinct from cited Optional Rules

`docs/features/0011-license-check-dialog.md` needs a toggle for its `rating × 2` Opposed Test
formula — a pacing choice made during prototyping, not a rule from any Shadowrun source book.
`optionalRulesRegistry` (`docs/adr/0002-feature-flags-design.md`) doesn't fit: every entry there
requires a `Source` citation (`{ book, page }`) and defaults to disabled, since an Optional Rule
is specifically a published SR4e variant a table opts into. Forcing a fabricated citation onto a
prototyping choice would be dishonest, and defaulting it to disabled would silently change the
feature's designed behaviour the first time anyone uses it.

We add a second, parallel namespace instead: `featureFlags.houseRules`, backed by a
`houseRulesRegistry` using the same `FeatureFlag<Value>` factory as `optionalRulesRegistry` (same
type-derivation benefit from ADR 0002), but entries have no `Source` field and each flag sets its
own default rather than uniformly defaulting to disabled. This isn't a deviation from ADR 0002 —
that ADR explicitly anticipated "future namespaces... can be added without touching the existing
shape"; House Rules is one of those namespaces.

Keys are dotted and feature-namespaced (e.g. `items.licenseCheck.ratingPlusRating`), unlike
`optionalRulesRegistry`'s flat keys (e.g. `encumbranceEnabled`) — House Rules are expected to
accumulate per-feature as more features need their own toggleable design choices, where a flat
namespace would risk collisions and lose the association with the feature that owns each flag.

## First consumer

`items.licenseCheck.ratingPlusRating` (`docs/features/0011-license-check-dialog.md`) — defaults to
enabled, since `rating × 2` is License Check's designed behaviour, not an opt-in variant.
